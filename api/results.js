// /api/results.js
// Vercel serverless function (Node.js runtime). Works alongside a plain
// static site with zero framework config — Vercel auto-detects any file
// under /api as a serverless function.
//
// Required environment variables (set in Vercel Project Settings > Environment Variables):
//   SUPABASE_URL              — from Supabase Project Settings > API
//   SUPABASE_SERVICE_ROLE_KEY — from Supabase Project Settings > API ("service_role", NOT "anon")
//
// The service role key is only ever used here, server-side. It is never sent
// to the browser. Do not rename these env vars without also updating them in
// the Vercel dashboard.

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SCREENSHOT_BUCKET = 'screenshots';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('test_results').select('*');
      if (error) throw error;
      const map = {};
      data.forEach((row) => { map[row.row_key] = row; });
      return res.status(200).json({ results: map, serverTime: new Date().toISOString() });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const {
        row_key, screen_name, screen_file,
        status, qa_notes, dev_response,
        screenshot_base64, clear_screenshot,
        updated_by,
        category, test_case, expected_result, is_custom,
      } = body || {};

      if (!row_key) return res.status(400).json({ error: 'row_key is required' });

      const update = { row_key, updated_at: new Date().toISOString() };
      if (screen_name !== undefined) update.screen_name = screen_name;
      if (screen_file !== undefined) update.screen_file = screen_file;
      if (status !== undefined) update.status = status;
      if (qa_notes !== undefined) update.qa_notes = qa_notes;
      if (dev_response !== undefined) update.dev_response = dev_response;
      if (updated_by !== undefined) update.updated_by = updated_by;
      if (category !== undefined) update.category = category;
      if (test_case !== undefined) update.test_case = test_case;
      if (expected_result !== undefined) update.expected_result = expected_result;
      if (is_custom !== undefined) update.is_custom = is_custom;

      if (clear_screenshot) {
        update.screenshot_url = null;
      } else if (screenshot_base64) {
        const match = screenshot_base64.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!match) return res.status(400).json({ error: 'screenshot_base64 must be a data: URL' });
        const contentType = match[1];
        const buffer = Buffer.from(match[2], 'base64');
        const ext = contentType.split('/')[1] || 'png';
        const path = `${row_key.replace(/[^a-zA-Z0-9_-]/g, '_')}-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(SCREENSHOT_BUCKET)
          .upload(path, buffer, { contentType, upsert: true });
        if (uploadError) throw uploadError;

        const { data: pub } = supabase.storage.from(SCREENSHOT_BUCKET).getPublicUrl(path);
        update.screenshot_url = pub.publicUrl;
      }

      const { data, error } = await supabase
        .from('test_results')
        .upsert(update, { onConflict: 'row_key' })
        .select();
      if (error) throw error;
      return res.status(200).json({ result: data[0] });
    }

    if (req.method === 'DELETE') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { row_key, delete_row } = body || {};
      if (!row_key) return res.status(400).json({ error: 'row_key is required' });

      if (delete_row) {
        // Fully remove a custom row the team added themselves.
        const { error } = await supabase.from('test_results').delete().eq('row_key', row_key);
        if (error) throw error;
        return res.status(200).json({ ok: true, deleted: true });
      }

      const { error } = await supabase
        .from('test_results')
        .update({ status: 'notrun', qa_notes: '', dev_response: '', screenshot_url: null, updated_at: new Date().toISOString() })
        .eq('row_key', row_key);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Unknown server error' });
  }
};
