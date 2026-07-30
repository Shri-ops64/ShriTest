# Odin Project Module Specification

**Author:** Mike Bayes
**Date:** May 20, 2026
**Target delivery:** June 15, 2026
**Audience:** Mike (working spec for own reference; will be adapted for dev hand-off to Brent & Mandeep)

---

## Contents

1. [What we're building](#1-what-were-building)
2. [Primary user](#2-primary-user)
3. [What changes from the current state](#3-what-changes-from-the-current-state)
4. [Module entry point: Project List View](#4-module-entry-point-project-list-view)
5. [Tab structure (eight tabs)](#5-tab-structure-eight-tabs)
6. [Tab specifications](#6-tab-specifications)
   - 6.1 Overview · 6.2 Tasks · 6.3 Time · 6.4 Daily Logs · 6.5 Activity · 6.6 Change Notices · 6.7 Assets · 6.8 Client Reports
7. [Tech mobile surfaces](#7-tech-mobile-surfaces)
   - 7.1 Access model · 7.2 Tech home · 7.3 Per-project tech view · 7.4 Project picker · 7.5 Daily Log composer · 7.6 Daily Log detail · 7.7 My Daily Logs list · 7.8 My Tasks list · 7.9 Task detail · 7.10 My Photos grid · 7.11 Photo upload flow · 7.12 Submit Timesheet (project variant) · 7.13 What the tech does NOT see
8. [Removals (explicit list)](#8-removals-explicit-list)
9. [What stays as-is](#9-what-stays-as-is)
10. [Data model notes](#10-data-model-notes)
11. [Open decisions (parked for v1.1)](#11-open-decisions-parked-for-v11)
12. [Phasing](#12-phasing)
13. [Reference materials](#13-reference-materials)
14. [Development and Testing Plan](#14-development-and-testing-plan)

---

## 1. What we're building

A project management module inside Odin for **Thor Plumbing & Heating admin users** to manage project-based work. Distinct from the existing service / work orders side.

The primary mission of the module is **proof of work**: capturing and surfacing evidence that work was done, when, by whom, and to what standard. Daily logs from techs on site, project communications, photos, and structured records of changes and clarifications all feed into this. Everything else in the module supports that mission.

The secondary mission is **client visibility**: surfacing project status to the customer through AI-generated, admin-approved client reports.

## 2. Primary user

**Thor admin users.** Project managers, site managers, owners. They sit at a desk on a web browser. They manage projects, review tech submissions, approve documents, generate client reports.

**Not** Web Wizards staff. We're the software development company building this for Thor.

**Tech users (Thor field technicians)** are out of scope for this spec. They use a separate mobile-first interface that already exists. This module is the receiving and consumption side of what techs submit.

## 3. What changes from the current state

The current project module has been partially built but is structurally wrong in several places. Specific changes:

### Hierarchy fix (critical)
- **Remove** the intermediate "project landing page" with widgets that requires clicking "Go To Project" to enter the working area.
- Clicking a project from the All Projects list lands directly on the **Overview tab** of the project, with tabs visible at the top.
- The widgets from the current landing page (burn down, milestones, WIP, tasks summary) are repositioned into the Overview tab content alongside new KPI cards.

### Tab restructure
- **Remove:** Roadblocks tab. Roadblocks are not a separate concept. They are a state of a Task. See section 6.2.
- **Remove:** Project Reports tab in its current form (the checkbox-config screen). Replace with **Client Reports** as a workflow surface. See section 6.8.
- **Add:** Activity tab for the chronological audit timeline of all project events. See section 6.5.
- **Add:** Change Notices tab for PCNs and RFIs as a register-style view. See section 6.6.
- **Rename:** Daily Logs stays as a tab but its UI changes completely. The current "Project Site Report" folder-based UI is replaced. See section 6.4.

### Branding
- All new screens are built in the **current Odin brand** (dark sidebar with white panels, blue accents, lowercase "odin" logo with red dot). The lime green branding visible in the current dev iteration is from a new brand that does not exist yet in production.
- A brand swap may happen later but is out of scope here.

## 4. Module entry point: Project List View

The Project List View is the first screen the admin sees when clicking **Projects** in the Odin sidebar. It is one level above the per-project tabs (sections 5 and 6) and serves as the entry point to the Projects module.

**Mockup:** `odin-projects-list.html`

### 4.1 What changes from the current state

A version of this screen already exists in the development build, rendered in the alternate (lime green) brand. This rebuild is a **brand conversion plus a layout cleanup**.

What stays the same:
- Six core statistics: Total Projects, Active, On Hold, Completed, Total Tasks, Completed Tasks
- Status donut chart with 4 status colors (Active / On Hold / Completed / Cancelled)
- Projects table with all columns (Project, Code, Client, Manager, Status, Start Date, End Date, Team, Progress, Actions)
- Search and Add Project actions in the top right
- Pagination with per-page selector

What changes:
- Lime green topbar replaced with the dark topbar (`#1c1d1f`) used across the rest of the module
- All UI chrome (cards, buttons, pills, table) converted to current Odin brand styling
- A page title bar is added below the topbar following the same pattern as the per-project tabs (icon + h2 + subtitle + counter)
- Status pill colors switched from the alternate brand palette to the current Odin palette (green for Active, amber for On Hold, purple for Completed, red for Cancelled)
- **Default Team Members and Default Project Folders cards removed from this screen.** Those settings are handled elsewhere in Odin (likely account settings or admin config). Removing them frees up real estate so the KPI tiles can have proper proportions.
- **KPI layout restructured.** The previous 5-column "Overview / Work / Status / Team / Folders" header strip with stacked stat cards is replaced with a two-row layout: a primary row of 4 big tiles (Total Projects, Active, On Hold, Completed) and a secondary row with 2 small task tiles plus an expanded Status donut card spanning two columns.

### 4.2 Layout

Top to bottom:

1. **Topbar** with "Projects" breadcrumb, Help link, user identity.
2. **Page title bar**: Projects icon, "Projects" h2, subtitle "All company projects, statistics, and default project setup", and counter on the right ("X active · Y total").
3. **Top actions row**: search input (rounded pill with search icon) and Add Project button (blue primary), right-aligned.
4. **KPI section label**: small uppercase muted text "Company-wide statistics".
5. **Primary KPI row** (4 equal columns): four big tiles with icon, label, large value, sub-label, and a thin blue gradient band at the bottom edge.
   - **Total Projects** (neutral icon): all projects in the system.
   - **Active** (blue icon): currently in progress. This is the headline number.
   - **On Hold** (amber icon): paused or blocked.
   - **Completed** (green icon): finished this year.
6. **Secondary KPI row** (3 cells, ratio `1fr 1fr 2fr`):
   - **Total Tasks** (small tile).
   - **Completed Tasks** (small tile with completion-rate sub-label).
   - **Status breakdown** donut card (spans the remaining width). Header with icon and title, 2-column legend grid (Active + Completed in row 1, On Hold + Cancelled in row 2), foot line ("X tasks across Y active projects"), 130px donut with center text showing the active count.
7. **Projects table**: standard data table with sortable columns and row actions.
8. **Pagination** at the bottom of the table.

### 4.3 Projects table

The list of all company projects. One row per project.

**Columns:**

| Column | Type | Notes |
|---|---|---|
| Project | Text (blue link) | Clicking navigates to the per-project Overview tab |
| Code | Monospace ID | Project identifier (e.g., 9059, 1234) |
| Client | Text | Client/owner name |
| Manager | Text | Project manager name |
| Status | Pill | Active (green) / On Hold (amber) / Completed (purple) / Cancelled (red) |
| Start Date | Date | M/D/YYYY format |
| End Date | Date | M/D/YYYY format |
| Team | Badge | Count of team members on this project |
| Progress | Bar + percentage | Visual bar plus right-aligned percentage label |
| Actions | Icon buttons | View (eye icon) and Delete (trash icon) |

**Row behavior:**
- Hover state: background tint.
- Project name in blue, hover underline. Clicking navigates to the per-project Overview tab.
- View icon also navigates to per-project Overview.
- Delete icon opens a confirmation modal (modal not in this mockup).
- Empty progress bar uses muted grey; positive progress uses blue.

### 4.4 Pagination

Standard pattern: "Per page" select (25 / 50 / 100), counter ("X - Y of Z items"), prev/next arrow buttons (disabled when at boundary).

### 4.5 Open items for this screen

1. **Cancelled status example.** The mockup shows only one row (an Active project from the original screenshot). Add a few more example rows showing the other statuses (On Hold, Completed, Cancelled) before final review, so the status pill colors can be validated visually.
2. **Confirm location of removed defaults.** The Default Team Members and Default Project Folders cards were removed from this screen. Confirm with the dev team where those settings live (account settings, admin config, or another location).

## 5. Tab structure (eight tabs)

1. **Overview**: Command center. Live KPIs, milestones, latest daily logs, activity preview, team, WIP.
2. **Tasks**: Task list (keep existing UI, add Blocked state).
3. **Time**: Timesheet entries scoped to project, mirroring main Timesheets module pattern.
4. **Daily Logs**: Tech-submitted field reports with text and photos. Proof-of-work record.
5. **Activity**: Chronological audit timeline of all project events: human posts (notes, decisions) and system-generated events (task changes, time entries, log submissions, change notice updates, etc.). Single source of truth for "what happened on this project."
6. **Change Notices**: Register-style view of PCNs (Project Change Notices) and RFIs (Requests for Information). Formal change documents distinct from casual project chatter.
7. **Assets**: Per-project digital asset manager. Folders, files, images, docs.
8. **Client Reports**: AI-generated client-facing reports with admin approval workflow.

## 6. Tab specifications

### 6.1 Overview tab

The first screen a Thor admin sees when entering a project. Default tab.

**Top KPI row (4 large cards, same visual style as Timesheets overview cards):**

| Card | Content |
|------|---------|
| Hours This Week | Project hours this week, with billable / non-billable split, up/down arrow vs last week |
| Hours This Month | Project hours this month, with B/NB split, up/down arrow vs last month |
| Hours to Date | Total project hours vs estimated, expressed as `XX of YY hrs` with percentage |
| Project Health | Composite indicator: On Track / At Risk / Off Track. Driven by schedule + budget + open blockers |

**Secondary KPI row (5 smaller cards, same style as Timesheet Filtered Summary cards):**

| Card | Content |
|------|---------|
| Active Tasks | Count of in-progress tasks |
| Open Blockers | Count of blocked tasks. Red highlight if greater than 0. |
| Open RFIs | Count of RFIs awaiting response |
| Daily Logs This Week | Count of daily log submissions this week. Proof-of-work signal. |
| Days Remaining | Working days to project end date |

**Supporting widgets below KPIs (three-column grid):**

- Left column: Milestones list, Project Health detail (when health is At Risk or Off Track, show why)
- Center column: Activity feed preview (5 most recent events, link to full Activity tab)
- Right column: Latest Daily Logs (2-3 most recent with photo thumbnails), Team list with hours, WIP card

**Milestones management (lightweight, inline on the Overview card):**

Milestones are managed directly on the Overview card with no separate tab or settings page. They are deliberately lightweight to reflect their role as coarse, schedule-significant moments (typically 4-6 per project), distinct from tasks.

- Each milestone displays a checkbox, a name, and a date (target date if open, completed date if done).
- Clicking the checkbox toggles done state, captures `completed_at` timestamp and `completed_by` user.
- Done milestones display with strikethrough text and a green check.
- The currently active milestone (next upcoming, not yet done) renders with a blue ring on its checkbox and the date displayed in blue.
- Hovering a milestone reveals an edit pencil that opens an inline edit affordance for the name and date.
- An "Add milestone" link at the bottom of the card opens an inline composer (name field, date picker) to add a new milestone.
- Order is by target date ascending.

**Removed from current state:** "Go to project" button. The donut chart for Tasks (data now in KPI row). The mascot character bottom right.

**Header buttons:** No "New Post" or "Generate Client Report" buttons at the Overview page header. Those actions live in their respective tabs (Activity composer, Client Reports tab). The Overview page header carries only one action: "Edit Project" (opens the project details editor for name, description, dates, manager, clients).

### 6.2 Tasks tab

**Keep existing UI structure.** The current Tasks tab works: hierarchical task list with subtasks, estimated hours pills, status, due date, assignee, hours used, drag-to-reorder handles.

**Required changes:**

- Add **Blocked** as a task status alongside Not Started / In Progress / Complete. When a task is marked Blocked, capture a required `blocked_reason` text field. A Task Event is emitted to the Activity feed automatically.
- Blocked tasks bubble up to the Overview "Open Blockers" KPI card in the secondary KPI row, and are highlighted in red when the count is greater than zero.
- Add a "Mark Blocked" action to the task row context menu.
- Optional v1.1: add a small flag icon next to blocked tasks in the list view.

**Out of scope for v1:** Task UI overhaul. Current UI is acceptable. Plan to revisit after v1 ships based on user feedback.

### 6.3 Time tab

**Pattern: mirror the main Odin Timesheets Log module, scoped to this project.**

Decision deferred: whether project time also rolls up into the main Timesheets module. For now, build it as a standalone surface inside the project. Same visual language and column structure means future integration is a data plumbing decision, not a UX rebuild.

**Structure:**

1. **Overview row at top** (4 cards, project-scoped):
   - This Week (with B/NB split)
   - Last Week (with B/NB split)
   - This Month (with B/NB split)
   - Last Month (with B/NB split)

2. **Filters row:** Date, Date Range, Type, Employees, Status (Submitted / Pending / Approved)

3. **Filtered Summary row** (5 cards, project-scoped, reflecting current filter):
   - Employees with Entries
   - Regular hrs
   - Overtime
   - Total hrs
   - Entries

4. **Timesheet entries table.** Columns:
   - Employee / Dept (with avatar)
   - Type (Billable / Non-Billable type pill)
   - Date
   - Hrs
   - OT
   - Total
   - Job Status
   - Status (Submitted / Pending / Approved dot)
   - Actions (view, edit, delete)

5. **Export buttons** top right of table: Export, Export Payroll.

**Out of scope for v1:** Company Time grid view (the weekly grid by employee). v1 is list view only.

### 6.4 Daily Logs tab

The current implementation (a folder browser called "Project Site Report" with "RoadBlock" as a default folder) is **scrapped**. It conflates daily logs, site reports, and roadblocks into one concept and is not usable.

**Replacement structure:**

A list view of tech-submitted daily logs, sorted by date descending.

**List row contains:**
- Date
- Technician (avatar + name)
- Summary text preview (truncated, 2 lines)
- Photo thumbnails (up to 4, with "+N" overflow)
- Hours logged
- Tasks referenced (count, if any)
- Status indicator (submitted / reviewed by admin)

**Click on a row** opens the detail view:
- Full submission text
- All photos in a gallery
- Tasks referenced with links to task detail
- Time entries linked to this log
- Location chip (when GPS metadata captured by mobile app)

**Admin actions in the detail panel:**

- **Mark Reviewed** (primary action): Toggles the log's status from submitted to reviewed. Captures `reviewed_by` and `reviewed_at`. The amber "Awaiting admin review" banner disappears.
- **Export** (secondary): Generates a PDF of this single log including photos, for handoff outside the system.

**Filters at top of tab:**
- Date range
- Technician
- Tasks referenced
- Reviewed / unreviewed

**Daily log entry is mobile-first** and happens in the separate tech interface. Web side is review and consumption only. No web-side composer needed in v1.

**Data note:** Each daily log is a structured record. See section 10 for the full entity. The "Project Site Report" data model with folders should be removed entirely.

### 6.5 Activity tab

**Replaces the previously-planned "Comms" tab.** PCNs and RFIs move out into their own tab (section 6.6). What remains is the **chronological audit timeline** of the project: every meaningful event, human and system-generated, in one feed.

The Activity tab is the single source of truth for "what happened on this project." Every other tab is a destination for working with specific records. Activity is the running pulse.

**Event sources (everything flows into Activity):**

- **Posts** (human-authored): single post type, free-form text. Used for notes, decisions, reminders, general updates. The semantic of the post lives in the body, not in a type tag.
- **Tasks**: status changes (Started, Completed, Blocked, Unblocked), assignment changes, due date changes
- **Time**: timesheet entries submitted, approved
- **Daily Logs**: tech submitted a log, admin marked reviewed
- **Change Notices**: PCN raised, status changed, approved, rejected; RFI raised, answered, closed
- **Assets**: file uploaded, folder created, file deleted, file restored
- **Client Reports**: report drafted, approved, sent
- **Project**: milestone added, milestone completed, team member added/removed, project status changed

**Top of tab:**
- Composer at top (compact, Facebook-style single input "Share an update with the team"). Single post type only. Posts are short-form text with optional attachment and optional linked task. Decisions, status updates, and reminders are all just posts; the form factor doesn't change.
- Filter chips below composer: All / Posts / Tasks / Daily Logs / Change Notices / Time / Assets / Reports / Project. Single-select. The "All" view is the default.
- Free-text search input.

**Feed structure (chronological, newest first):**

Two visual treatments based on event source:

- **Human posts** get the full treatment: initials avatar, name, type tag, timestamp, body, optional meta row.
- **System-generated events** get a lighter treatment: small icon avatar instead of initials, single-line content where possible, dimmer text color. Visually de-emphasized so the eye flows over them when scanning for human-authored items.
- **Inline photo thumbnails** appear on system events that reference image content (Daily Log submissions, Asset uploads of images). Renders as a small row of 28×28 thumbnails to the right of the content, before the timestamp.

**System event examples (single-line format):**

- `Mark Panteluk marked task "Install main supply line" as Blocked · Reason: Waiting on revised P&ID drawings`
- `Adam Coey submitted 7.5 hrs to West wall rough-in`
- `Justin Thorsteinson raised PCN #003 · Relocate utility room access door`
- `Mark Panteluk submitted daily log · 5 photos · 6.5 hrs`
- `Sam Paterson uploaded 3 files to Site Photos`
- `Milestone reached: Rough-in installation`
- `Adam Coey marked PCN #002 as Approved`

Each system event links to its source record (click "PCN #003" jumps to the Change Notices tab with that record open).

**Notification routing (open decision):** Who gets notified for which event types. Park for v1.1. For v1, all events are visible to all project members, no external routing.

### 6.6 Change Notices tab

**New tab.** Register-style view of formal change documents: PCNs (Project Change Notices) and RFIs (Requests for Information). These are contractually significant records distinct from casual project communication.

**Top of tab:**
- Action button: "Raise New" (opens a document-first modal to create a PCN or RFI)
- Filter chips: All / PCN / RFI (single-select), then separately Open / Closed (single-select)
- Free-text search across number, title, body

**Main view: register table**

Columns:
- Number (e.g., "PCN-003" / "RFI-007")
- Type pill (PCN or RFI)
- Title (with paperclip indicator + count when attachments present)
- Status pill with colored dot
- Raised by (avatar + name)
- Raised on (date)
- Due (RFI: due date for response, with amber highlight if within 3 days, red if overdue)
- Cost (PCN only, $)
- Hours (PCN only, h)
- Actions: open, download, archive

Sortable columns. Default sort: status (open first), then raised-on date descending.

**Summary strip above the toolbar** shows: Total count (with PCN/RFI split), Open count, Approved cost impact to date, Pending cost impact (if all open were approved), Average RFI turnaround in days.

**Raise New modal: the document-first form:**

When the user clicks "Raise New", a modal opens with PCN/RFI toggle at the top. The form is document-first by design: the formal artifact (typically a signed PDF from owner, engineer, or GC) is the source of truth; the form fields are the searchable metadata index around it.

**PCN form layout:**

1. **File upload zone** (prominent, blue-tinted, drag-and-drop). Accepts PDF, image formats, .docx. Multiple files supported.
2. **Details section:** Number (auto-generated, readonly), Date raised, Title (required), Description (required, textarea)
3. **Impact section:** Cost impact ($), Hours impact, Schedule impact (days), Reason for change (dropdown: Owner request / Field condition / Engineer change / Code requirement / Other), Linked task (optional dropdown of project tasks)
4. **Status section:** Initial status (Draft or Pending Sign-off)
5. **Notify on submit:** placeholder field, disabled in v1, marked v1.1

**RFI form layout (different fields from PCN):**

1. **File upload zone** (same as PCN). Typically a marked-up drawing or spec excerpt.
2. **Details section:** Number (auto-generated, readonly), Date raised, Subject (required), Question (required, textarea, phrased as a question, not a description)
3. **Recipient & Timing section:** Send to (required, free-text name/email), Discipline (dropdown: General / Plumbing / Mechanical / Electrical / Structural / Architectural), Response needed by (required date), Priority (Standard / Urgent / Critical)
4. **Reference section:** Drawing reference (free text, e.g. "M-201, Detail 3"), Spec section (free text, e.g. "22 11 16, Part 2.4.A"), Linked task (optional), Blocking task? (Yes/No. If Yes, raising the RFI auto-marks the linked task as Blocked with the RFI as the reason; auto-unblocks when answered)
5. **Status section:** Initial status (Draft or Awaiting Response)
6. **Notify on submit:** placeholder field, disabled in v1, marked v1.1

Footer: Cancel · Save Draft · Submit PCN/RFI.

**Detail view (opens when register row clicked):**

Side panel similar to Daily Logs detail panel.

- Header: number, title, status pill, raised by, raised on
- Action row: Edit, status transition button (varies by current state: Mark Approved/Rejected for pending PCN, Mark Answered for awaiting RFI, etc.), Export PDF, Archive
- Attached documents (primary)
- Body: full description
- Impact section (PCN only): cost, hours, schedule, reason, linked task
- Recipient and due date (RFI only)
- Response section (RFI only, appears once status is Answered): response body, response date
- Audit trail: every status transition with user and timestamp
- Threaded discussion: team replies (separate from formal status changes)

**Field set is provisional.** Construction PCN/RFI conventions vary by region, contract type, and customer. The fields documented here are sensible defaults pulled from common industry practice but should be validated with Justin and adjusted based on feedback. Expected client-specific additions: project phase tagging, contract reference number, specific GC/engineer fields, e-signature workflow.

**State machines:**

- PCN: `DRAFT` → `PENDING_SIGN_OFF` → `APPROVED` | `REJECTED`
- RFI: `AWAITING_RESPONSE` → `ANSWERED` → `CLOSED`

Status transitions emit `CHANGE_NOTICE_STATUS_CHANGED` events to the Activity tab with old/new values in metadata.

**Out of scope for v1:** External signature workflow (DocuSign integration). External recipient response capture (RFI responses arrive via email today; admin manually marks Answered and pastes response). Email notifications on creation/status change. These are v1.1.

### 6.7 Assets tab

**Per-project digital asset manager.** Replaces the current empty Assets folder browser with a functional DAM.

**Structure:**

- Left sidebar: folder list (sticky, scrollable), with "+" button at top to add a new folder
- Main area: file grid (default view) or list view (toggle in toolbar)
- Toolbar: breadcrumb, item count and total size, search within folder, view toggle, Upload button
- Drag-and-drop upload affordance always visible as a thin strip below the toolbar

**Default folders on project creation:**

1. Drawings
2. Site Photos
3. Permits & Inspections
4. Contracts & Quotes
5. Submittals
6. Safety Documents
7. Closeout

Plus **Trash** (system-managed, always present, cannot be removed).

**Folder management:**
- Any user with edit access can add new folders and rename existing ones
- All folders (including defaults) can be deleted. They go to Trash, contents included
- Folder defaults are configurable at the org level (extends the existing "Default Project Folders" admin setting visible in the current Projects list page). Changes to org defaults affect newly-created projects only, not existing ones.

**File types supported:**
- Images (jpg, png, heic from mobile)
- Documents (pdf, doc, docx, xlsx, pptx)
- v1.1 stretch: email exports (eml, msg)

**Per-file metadata:**
- Filename
- Uploaded by (user reference)
- Upload date
- File size
- Tags (optional)
- Description (optional)

**Per-file actions** (via context menu / three-dot icon on the file card): Rename, Move, Download, Move to Trash.

**Bulk actions:** select multiple via checkbox on hover, then: Move to folder, Move to Trash, Download as zip.

**Auto-routing from Daily Logs (v1.1 stretch):** Photos uploaded by techs via Daily Logs should auto-land in Site Photos so they're findable from both surfaces. v1 keeps them associated to the daily log only; v1.1 would replicate them into the DAM.

**Deletion model (two-stage with Trash as the safety net):**

- Any user with edit access can "delete" a file or folder. This moves it to Trash, not gone.
- Trash is project-scoped. Each project has its own Trash.
- From Trash, items can be **Restored** to their original location (any user with edit access), or **Permanently Deleted** (project admin only).
- After 30 days in Trash, items are auto-purged by the system. Each Trash item shows its auto-purge date.
- Folder deletion moves the folder and all contents to Trash together. Restoring the folder restores everything inside it.
- Every delete, restore, and permanent-delete action emits an Activity event (`ASSET_DELETED`, `ASSET_RESTORED`, `ASSET_PURGED`). Nothing disappears silently.
- No items are permanently undeletable in v1. Protected/locked files is a v1.1 feature.

**Permission model:**
- Project Admin: full control (upload, edit, move, delete to Trash, restore, permanently delete from Trash)
- Project Member (edit): upload, edit, move, delete to Trash, restore from Trash
- Project Member (view): browse and download only
- Read-only client view: out of scope for v1 (see Client Reports for client-facing surface)

### 6.8 Client Reports tab

**Replaces the existing Project Reports checkbox-config screen.**

Client Reports are **AI-generated, customer-facing communications** that go through admin approval before sending to the client. The reference visual design for the report output itself is the existing customer-report mockup (see attached `odin_client_report_mockup.html` for the deliverable look and feel).

**Tab structure (three zones, top to bottom):**

**Zone 1: Generate panel**

- Reporting Period (dropdown: Last 7 days / Last 14 days / Last 30 days / Custom range)
- Template (dropdown: Standard Client Update / Project Kickoff / Project Milestone / Project Closeout)
- Tone (dropdown: Professional / Conversational / Brief)
- Primary action: "Generate Draft" button

When clicked, the AI generates a draft report pulling data from:
- Daily logs (technician submissions, photos)
- Activity events (notes, decisions, task changes, status updates)
- Change Notices (PCNs, RFIs)
- Completed tasks and milestones
- Hours logged
- Project status

The draft is created and routed to Zone 2.

**Zone 2: Pending Approval queue**

List of drafts awaiting admin action. Each row shows:
- Title (auto-generated, e.g., "Client Update Report · 28 Apr – 12 May")
- Status pill: Awaiting Admin Review / Draft (Not Submitted)
- Generated timestamp and author
- Summary preview (1-2 lines)
- Actions: Edit / Review & Approve / Open Draft / Submit for Approval (varies by state)

**Zone 3: Report History**

Chronological list of reports sent to the client. Each row:
- Title
- Sent date, time
- Approver name
- Recipient(s)
- Status pill: Sent
- Actions: View, Download (PDF), Resend

**Right-side context column:**
- Reporting Overview stats (sent count, pending, drafts, last sent, average time between sends)
- Scheduled Reports toggle (auto-generate on bi-weekly cadence; admin approval still required before send)
- Recipients list (configured per project)
- Visual of the approval workflow (3 steps: Generate Draft → Admin Review → Send to Client; current step highlighted)

**Approval gate is non-bypassable in v1.** Every report goes through human review before it's sent to the client, regardless of whether the draft was AI-generated automatically or kicked off manually. AI is a drafting assistant, not an autopilot. This is intentional design to keep human judgment in the loop on client-facing communications.

**Out of scope for v1.1 / future:**
- Client portal where they view reports natively (v1 sends as email + PDF)
- Two-way comments from client on a report
- Schedule customization (v1 supports off / bi-weekly only)

## 7. Tech mobile surfaces

This section covers the tech-facing mobile views that complement the admin web Project Module. The tech app already exists in production (timesheets, equipment, daily timesheets, etc); this is the project-related layer that gets added on.

### 7.1 Access model

**All Thor projects are accessible to all Thor users (admins and techs alike).** Per the customer's stated culture, there are no confidentiality walls between admins or between techs. Assignment to a project is a soft signal for sorting and dashboards, not a permission gate.

What this means in practice:

- **For admins:** Any admin can open and edit any project in the admin web Project Module. Team membership is informational metadata (who's the project manager, who's officially assigned), not an access control mechanism.
- **For techs:** Any tech can submit time and write daily logs against any active project. Project pickers sort assigned projects to the top, but show every active project as selectable. No request-for-access flows, no permission errors.
- **For data integrity:** The audit trail captures who submitted what against which project. That's the source of truth for "who worked on this project," distinct from formal team membership.

### 7.2 Tech home

The existing tech mobile home (logo, hero greeting, hours-today counter, Quick Actions, Work Orders widget) is the starting point. The Project Module adds one widget and otherwise leaves the home alone.

**Quick Actions remain unchanged from production:** "Submit a timesheet" (primary) and "Global Search" (secondary). Both apply to service and project techs. No project-specific actions appear here, because mixing surfaces causes confusion ("do I need to write a daily log?" thinking from a service tech).

**Work Orders widget stays in its existing position** directly below Quick Actions. Service is the dominant business line; it keeps prime real estate.

**New "My Projects" widget added below Work Orders.**

- Shows projects the tech is currently assigned to (filtered by team membership)
- Each row: project name, project ID, location, task pill summary (e.g., "3 tasks", "1 blocked" in red when applicable)
- Search field for filtering the list
- "View all" link in header opens the full project picker (see section 7.4)
- Tap a project row → opens the per-project tech view (section 7.3)
- For pure service techs (no project assignments), the widget is empty or hidden

### 7.3 Per-project tech view

The view a tech lands on after tapping a project from the home widget (or from the picker).

**Project header (compact):** project name, project ID pill, location. Mirrors the home hero treatment visually for continuity, but smaller.

**Two big primary action cards, side-by-side:**

1. **Submit Time** (pink-red gradient icon, matches Sign Off button styling): opens the existing TimeTracker form with this project pre-filled in the project field.
2. **Write Daily Log** (blue icon): opens the daily log composer with this project pre-filled.

**My Open Tasks card:** lists only the tasks assigned to this tech on this project. Status dot (hollow grey for Not Started, blue solid for In Progress, red for Blocked), task name, status label, due date. Blocked tasks surface the blocking reason inline. Tap to view task detail.

**My Recent Daily Logs card:** the 3 most recent logs this tech submitted to this project. Big day/month date block, summary text, hours, inline photo thumbnails when present. Tap to view full log.

**My Recent Photos card:** photo grid (8 most recent) plus a prominent "Add Photos" button at the top. The Add Photos button is the standalone upload affordance for when a tech took photos but didn't write a log (or wants to add photos to the project's Site Photos folder without going through a log).

**Everything scoped to "mine."** The tech only sees their own tasks, logs, photos. Other techs' work is not visible. Reduces noise and keeps the view focused on what the tech needs to do their job and document it.

**What's intentionally NOT on this view:** team list, project KPIs, hours-to-date, milestones, change notices, activity feed, assets folder browser, comms surfaces, client reports. Those are admin concerns.

### 7.4 Project picker

The screen that opens when a tech needs to pick a project from a flow, or browses the full project list.

**Two entry contexts, same UI:**

- **Picker mode** (in a flow): tapping a row continues the flow with the chosen project carried forward. Reached from:
  - Submit Timesheet → pick "Projects" work type → this picker
- **Browser mode** (from a non-flow entry): tapping a row opens the per-project tech view (section 7.3). Reached from:
  - "View all" link in the My Projects home widget
  - Hamburger menu → "All Projects" (recommended addition)

**Layout:**

- Title block ("Pick a Project") with subtitle
- Search field at top, full-width
- Section: "Assigned to me" with count, listing the tech's assigned projects
- Section: "All active projects" with count, listing every other active project in Thor's org
- Both sections show the same row structure: project icon, name, ID, location, chevron
- Search field searches across both sections

**Important:** there is no "not assigned" tag, warning, or friction on projects in the second section. The act of contributing to a project that isn't formally yours is treated as normal behavior. The data captures who submitted what; the UI doesn't moralize.

### 7.5 Daily Log composer (mobile)

The form a tech fills out to write a new daily log. Lands here from:
- Per-project view → "Write Daily Log" big primary button
- Daily Logs list → "New Log" button in app bar
- Daily Log detail (Draft state) → "Edit" button

**Layout, top to bottom:**

- App bar with Back button and a "Draft saved" amber indicator (updates as fields change)
- Title "Daily Log" with project context pill (project name, ID); not editable, set when the composer was opened
- Subtitle "For Wednesday, May 20, 2026". Today's date, auto-filled
- **Photos section (top):** "Take Photo" (primary black, opens camera) and "From Library" (secondary, opens picker) buttons side-by-side. Selected photos appear in a 4-column grid below, each with a remove (X) badge.
- **Summary textarea (required):** "What did you do today?" with placeholder examples. 2000 character max with live count.
- **Hours stepper:** big +/- buttons with 0.5 hr increments, plus quick-pick shortcut chips (4, 6, 6.5, 8, 10, Custom). Currently selected shortcut highlights solid black.
- **Tasks worked on (optional):** the tech's open tasks on this project with checkboxes. Tap to link the log to those tasks. Blocked tasks show with a red label.
- **Footer actions:** Save Draft (secondary outline) and Submit Log (primary pink-red gradient). Sticky-feel placement at bottom.

**Photo routing on submit:** photos attached to the log are also automatically saved to the project's Site Photos folder (admin DAM). One upload, two findability surfaces (the log and the folder).

**Draft auto-save:** fields persist on input change. If the tech navigates away mid-composing, the draft resumes when they return. Drafts show in the My Daily Logs list with a "Draft" pill.

**Date is fixed to today in v1.** Back-dating is v1.1.

### 7.6 Daily Log detail view (mobile)

Read view for an existing log. Lands here from:
- Per-project view → tap any row in My Recent Daily Logs
- My Daily Logs list → tap any row

**Header:** "Daily Log · May 20" with project pill, status pill (Reviewed/Awaiting Review/Draft), submission/review timestamps.

**Body sections:**
- Photos grid (3-column, denser than composer). Header has an "Add Photos" button for retroactive uploads. Tap a photo for full-size view.
- Summary text (preserves line breaks)
- Hours readout with the pink-red gradient icon
- Tasks worked on (read-only references)

**App bar Edit button** opens the composer with all fields populated. Adding photos retroactively also works directly via the "Add Photos" button in the Photos section header (faster than entering full edit mode).

**Draft state variant:** status pill reads "Draft" (grey), the bottom of the page gets a primary "Submit Log" button alongside the Edit button.

### 7.7 My Daily Logs full list (mobile)

Where "View all" from the per-project view's My Recent Daily Logs goes.

**Header:** "My Daily Logs" with project context pill, "New Log" button in app bar (shortcut to composer).

**Stats strip:** Total Logs / Hours / Drafts (highlighted amber when > 0).

**Filter chips:** All / This week / Last 30 days / Drafts only (horizontal scroll).

**Row format:** big day/month/weekday date block, status pill, summary text, meta row (hours, photo count, task count), photo thumbs on the right with overflow count.

**Tap behavior:** Reviewed/Awaiting Review opens detail view. Draft opens composer.

### 7.8 My Tasks full list (mobile)

Where "View all" from the per-project view's My Open Tasks goes.

**Filters:** Open (default, shows Not Started + In Progress + Blocked), All, Complete.

**Grouped by status** in priority order:
1. Blocked (most urgent for the tech)
2. In Progress
3. Not Started
4. Complete (only when Complete filter is active)

**Row format:** status icon, task title, meta row (due date with amber/red highlight when soon/overdue, hours logged). Blocked tasks get a red left border and an inline blocking-reason banner with "Blocked since" date.

**Tap a task** opens the Task detail screen.

### 7.9 Task detail (mobile)

Detail view for a single task. Lands here from My Open Tasks (per-project view or full list).

**Header:** status pill, task title, project context pill.

**Sections:**
- Description (read-only, authored by admin)
- Details (due date, assignee, hours logged, started date)
- Change Status action grid: two big buttons. "Mark Complete" (green icon) and "Mark Blocked" (red icon). When task is currently Blocked, "Mark Blocked" is replaced with "Unblock."
- My Activity on This Task: chronological list of the tech's own activity (hours logged via daily logs, status changes)

**Tapping Mark Blocked** opens a modal requiring a blocking reason text field. The reason then surfaces in admin Tasks view and in the inline blocked banner.

**Tapping Mark Complete** transitions to Complete with confirmation. Emits a Task Event to the admin Activity feed.

**Blocked state variant:** body shows a red-tinted "Blocked" banner at the top with reason and timestamp. Status pill reads Blocked (red).

**What's not here:** edit description (admin owns content), reassign (admin owns assignment), delete (admin only), comment thread (uses admin-side Activity for cross-team discussion).

### 7.10 My Photos full grid (mobile)

Where "View all" from the per-project view's My Recent Photos goes.

**Header:** "My Photos" with project context pill, "Add" button in app bar.

**Body:** 3-column edge-to-edge tile grid, grouped by date (Today / Yesterday / specific dates).

**Photos source:** unified view of (a) photos attached to daily logs the tech submitted, and (b) standalone uploads via the project view or here.

**Tap a tile** opens full-size viewer with caption/delete options.

### 7.11 Photo upload flow (mobile)

Two-step flow:

1. **Step 1 (OS native picker):** camera/library selection. Handled by device OS, not designed here.
2. **Step 2 (confirmation screen):** review and confirm before upload.

**Step 2 layout:**
- App bar: Cancel link, "Step 2 of 2" indicator
- Title "Upload N Photos" with subtitle "Review and confirm before upload"
- Selected photos preview: 3-column grid with remove (X) per photo
- Destination card: project context pill, then two radio options:
  - **Site Photos folder** (default): no log attachment
  - **Attach to today's daily log**: appears when tech has a draft (or auto-creates one)
- Optional caption textarea (applies to all photos in batch)
- Big primary upload button at bottom with count in label

**Defaulting to Site Photos** matches the workflow problem you identified: techs want to upload without going through a log. Hard sell to default to attaching since that adds a step.

### 7.12 Submit Timesheet (project context variant)

The existing production Submit Timesheet form with two changes when work type is "Projects":

**What changes:**
- "Work Order" field becomes "Project" field (different label, different picker source)
- Project is pre-filled and locked when the tech entered via the per-project "Submit Time" button
- New optional "Task" field appears below Project, listing the tech's open tasks on the selected project. Lets them attribute time to a specific task.

**What stays the same** (existing production fields):
- Timesheet Type (Billable / Non-Billable) radio
- Date picker
- Work Performed text
- Arrival / Departure time pickers
- Enter your time hours/minutes display
- Overtime button
- Supplier Receipts section
- Pink-red gradient Save button

**Two entry paths:**
- **From per-project view → Submit Time:** Project pre-filled and locked, work type implicit
- **From Home → Submit a timesheet → Projects work type:** form opens with Project field empty; tapping it opens the project picker (6.12)

### 7.13 What the tech does NOT see

For clarity, here is what is intentionally absent from the tech mobile surfaces, even when they have a project open:

- Project Manager name and contact (might add to a small "About this project" detail in v1.1 if requested)
- Other team members
- Milestones and project timeline
- Project status / health indicators
- Other techs' daily logs
- Other techs' time entries
- Other techs' photos
- Change Notices (PCNs, RFIs)
- Asset folder browser (just their own recent photos)
- Activity feed
- Client reports

**Rationale:** the tech's job is to do work and document it. Admin information is for admins. Adding admin-side surfaces to the tech view creates noise without adding value, and risks information overload on a small screen.

## 8. Removals (explicit list)

These exist in the current code and should be removed:

- The intermediate project landing page (the dashboard view that requires a "Go To Project" click)
- The Roadblocks tab and its associated data structure
- The "Project Site Report" folder-based UI on Daily Logs
- The "RoadBlock" folder concept from the daily log / site report data layer
- The Project Reports checkbox-config screen
- The mascot character on the project landing page

## 9. What stays as-is

These work and don't need rework for v1:

- The All Projects list page (image 1 of current state). Cosmetic cleanup only.
- The New Project Wizard (image 3 of current state). Functional and complete.
- The Tasks tab core UI (image 4). Add Blocked status only.
- The Default Team Members and Default Project Folders admin settings on the Projects list page.

## 10. Data model notes

Where the spec implies a data model change, here's what's needed at minimum:

**Task entity:** Add `status` enum value `BLOCKED`. Add `blocked_reason` text field, `blocked_at` timestamp, `blocked_by_user_id` foreign key. When a task transitions to/from Blocked, an Activity event of type `TASK_STATUS_CHANGED` is emitted.

**Activity event (new):** `id`, `project_id`, `event_type` (enum: POST / TASK_CREATED / TASK_STATUS_CHANGED / TASK_ASSIGNED / TIME_SUBMITTED / TIME_APPROVED / DAILY_LOG_SUBMITTED / DAILY_LOG_REVIEWED / CHANGE_NOTICE_RAISED / CHANGE_NOTICE_STATUS_CHANGED / ASSET_UPLOADED / ASSET_DELETED / CLIENT_REPORT_DRAFTED / CLIENT_REPORT_APPROVED / CLIENT_REPORT_SENT / MILESTONE_ADDED / MILESTONE_COMPLETED / TEAM_MEMBER_ADDED / PROJECT_STATUS_CHANGED), `actor_user_id` (nullable for pure system events), `subject_type` and `subject_id` (polymorphic reference to the record this event is about: a task, a daily log, a change notice, etc.), `body` (nullable, used for human posts), `metadata_json` (nullable, structured event-specific data like old/new status, photo IDs for thumbnail rendering), `created_at`.

Posts are the single human-authored event type, stored in this same table with `body` populated. System events typically have `body` null and rely on `metadata_json` to render their human-readable string and any inline thumbnails in the UI.

**Change Notice (new):** `id`, `project_id`, `type` (enum: PCN / RFI), `number` (auto-incrementing per project per type), `title` (PCN) or `subject` (RFI), `body` (description for PCN, question for RFI), `status` (varies by type), `raised_by_user_id`, `raised_at`, `attachments[]`, `linked_task_ids[]`, `closed_at` (nullable), `closed_by_user_id` (nullable).

**PCN-specific fields:** `cost_impact_cents` (nullable), `hours_impact` (nullable), `schedule_impact_days` (nullable), `schedule_impact_notes` (nullable, free-text), `reason_for_change` (enum: OWNER_REQUEST / FIELD_CONDITION / ENGINEER_CHANGE / CODE_REQUIREMENT / OTHER).

**RFI-specific fields:** `recipient` (free-text name or email), `discipline` (enum: GENERAL / PLUMBING / MECHANICAL / ELECTRICAL / STRUCTURAL / ARCHITECTURAL), `due_date`, `priority` (enum: STANDARD / URGENT / CRITICAL), `drawing_reference` (free text), `spec_section` (free text), `is_blocking_task` (boolean. If true on creation, the linked task is auto-marked Blocked with this RFI as the reason; auto-unblocks when RFI status becomes ANSWERED), `response_body` (nullable, populated when status moves to ANSWERED), `response_received_at` (nullable), `response_cost_impact_cents` (nullable, captured retroactively if the answer carries cost), `response_schedule_impact_days` (nullable).

State machines:
- PCN: `DRAFT` → `PENDING_SIGN_OFF` → `APPROVED` | `REJECTED`
- RFI: `AWAITING_RESPONSE` → `ANSWERED` → `CLOSED`

Every state transition emits an `Activity event` of type `CHANGE_NOTICE_STATUS_CHANGED` with old/new status in `metadata_json`.

**Change Notice reply (new):** `id`, `change_notice_id`, `author_user_id`, `body`, `created_at`. For threaded discussion on a PCN/RFI without polluting the Activity feed.

**Daily log entry (new structure):** `id`, `project_id`, `tech_user_id`, `log_date`, `summary_text`, `photos[]`, `referenced_task_ids[]`, `hours_logged`, `location` (optional GPS), `status` (submitted / reviewed), `reviewed_by_user_id`, `reviewed_at`. Remove the folder-based data model that exists today.

**Client Report (new):** `id`, `project_id`, `title`, `reporting_period_start`, `reporting_period_end`, `template`, `status` (draft / pending_review / approved / sent), `generated_at`, `generated_by_user_id`, `approved_by_user_id`, `approved_at`, `sent_at`, `sent_to[]` (email recipients), `content_json` (the structured report body), `pdf_url`.

**Asset folder (new):** `id`, `project_id`, `name`, `parent_folder_id` (nullable for top-level), `created_at`, `is_default` (true for auto-created folders), `deleted_at` (nullable, populated when moved to Trash), `deleted_by_user_id` (nullable), `original_parent_folder_id` (captured at deletion time so restore puts it back correctly).

**Asset file (new):** `id`, `project_id`, `folder_id`, `filename`, `file_size_bytes`, `mime_type`, `storage_path`, `uploaded_by_user_id`, `uploaded_at`, `tags` (jsonb), `description` (nullable), `deleted_at` (nullable), `deleted_by_user_id` (nullable), `original_folder_id` (captured at deletion time), `purge_at` (nullable, set to deleted_at + 30 days; system job purges items past this date).

**Project milestone (new):** `id`, `project_id`, `name`, `target_date`, `completed_date` (nullable), `completed_by_user_id` (nullable), `notes` (optional), `sort_order` (integer for manual reordering if target dates collide).

## 11. Open decisions (parked for v1.1)

These don't block v1 but need to be answered later:

1. **Notification routing.** Who gets notified on what events. Email vs in-app vs both. Currently no notifications are sent.
2. **External RFI routing.** When an RFI is raised, does the response come from someone inside Odin or outside (engineer, supplier)? If external, how does the response get back into the system?
3. **External PCN sign-off.** Same question for PCNs routed to an owner or GC for approval.
4. **Project time integration with main Timesheets module.** Build standalone for v1, decide on integration after customer feedback.
5. **Permission model.** Public / Private project setting exists in the wizard. Confirm enforcement rules.
6. **Client portal for reports.** v1 sends email + PDF. Future: native client view.
7. **PCN / RFI field set validation.** The form fields documented in section 6.6 are sensible industry defaults but not validated with Thor. Show Justin the Raise New form during the next review and iterate based on what he actually uses for change documentation. Likely additions: contract reference number, project phase tagging, custom recipient fields, e-signature.

## 12. Phasing

**v1 (delivery target June 15, 2026):**
- Hierarchy fix (remove landing page, direct land on Overview)
- Overview tab with new KPI structure
- Tasks tab with Blocked state added
- Time tab (mirroring main Timesheets pattern)
- Daily Logs tab (replace current UI, list + detail view, web is consumption only)
- Activity tab (chronological event feed: notes, decisions, system events from all other tabs)
- Change Notices tab (PCN/RFI register with detail panel)
- Assets tab (functional DAM with default folders, upload, folder management)
- Client Reports tab (Generate / Pending / History structure; AI generation can be stubbed if not ready)

**v1.1 (post-launch iteration):**
- AI report generation hooked up properly
- Notification routing
- External RFI / PCN routing if needed
- Task UI enhancements based on user feedback
- Email attachment support in Assets
- "Flag for Discussion" on daily logs (admin starts an Activity post referencing a noteworthy log entry)

**v2 (future):**
- Brand swap (separate workstream)
- Client portal for reports
- Company Time grid view inside project
- Additional report templates

## 13. Reference materials

**Current state screenshots:** see uploaded screenshots in the project dev folder (All Projects list, current Project landing page with "Go To Project" button, Tasks view, current Daily Logs / Project Site Report view, current Assets folder browser, current Project Reports config screen).

**Current Odin brand reference:** Odin Dashboard, Work Orders, Timesheets Log, Company Time, Non-Billable Types screens from the live production app.

**Client Report visual design (the deliverable sent to the client):** `odin_client_report_mockup.html`.

**Mockups for this spec (admin-facing surfaces, current brand):**
- `odin-overview-current-brand.html`: Overview tab
- `odin-daily-logs.html`: Daily Logs tab with detail panel
- `odin-activity.html`: Activity tab with mixed human and system events
- `odin-change-notices.html`: Change Notices register + PCN Raise New modal
- `odin-change-notices-rfi.html`: Change Notices with RFI Raise New modal variant
- `odin-assets-current-brand.html`: Assets DAM with folder browser and file grid
- `odin-assets-trash.html`: Assets Trash view variant
- `odin-client-reports.html`: Client Reports tab with Generate / Pending / History zones

**Mockups for this spec (tech mobile surfaces, current brand):**
- `odin-tech-home.html`: Updated tech mobile home with My Projects widget
- `odin-tech-project.html`: Per-project tech view
- `odin-tech-picker.html`: Project picker with two-section sort (assigned / all active)
- `odin-tech-log-composer.html`: Daily Log composer
- `odin-tech-log-detail.html`: Daily Log read view (with Edit affordance)
- `odin-tech-log-list.html`: My Daily Logs full list
- `odin-tech-task-list.html`: My Tasks full list, grouped by status
- `odin-tech-task-detail.html`: Task detail with status change actions
- `odin-tech-photos.html`: My Photos full grid, grouped by date
- `odin-tech-photo-upload.html`: Photo upload confirmation (Step 2)
- `odin-tech-time-submit.html`: Submit Timesheet (project context variant)

**No mockups produced for:**
- Tasks tab (uses current production UI with Blocked state added)
- Time tab (mirrors existing Timesheets module pattern; same visual language)

---

## 14. Development and Testing Plan

**Added:** July 30, 2026. **Source for development estimates:** developer-provided document *"Project Module — Remaining Work Estimation"* (Mandeep, received July 2026). **Source for testing estimates:** Web Wizards QA planning (see phased approach below).

**Note on the original target date.** The document header above lists a target delivery of June 15, 2026. That date has passed. This section replaces it with a revised, realistic plan based on the developer's current remaining-work estimate and a structured testing approach. Treat the summary at the end of this section as the current authoritative ETA.

### 14.1 How to read this plan

Development and testing are **not** sequential blocks that simply get added together. Screens are tested individually as they land in the test environment, feature areas are tested together once their related screens are complete, and only the full end-to-end workflow pass waits for all development to finish. This section lays out the plan in that order: the remaining work itself, then the four types of testing, then a combined milestone timeline, then risks and a summary.

### 14.2 Remaining development work

Per the developer's estimate. Where the developer's document leaves a scope item open (needs a decision, an approval, or a discussion before work can proceed), that is called out in the Dependencies column and repeated in the risks section below — these are schedule risks, not just notes.

| # | Module/Screen | Current Status | Remaining Development Work | Development ETA | Individual Screen Testing | Dependencies | Expected Ready-for-Workflow-Testing Date | Notes/Risks |
|---|---|---|---|---|---|---|---|---|
| 1 | Cross-cutting: merge new enhancements into Project Module | In progress | Merge all recently-built enhancements into the Project Module after they're pushed to master; resolve merge conflicts, especially on the Technician Home page | 1 day | N/A (infrastructure, not a screen) | Clean master branch; no conflicting in-flight branches | N/A | Conflict risk is explicitly called out by the developer on Tech Home specifically — that screen changed hands multiple times (KPI scoreboard rework, After Hours ring, clickable tiles) during mockup iteration this cycle |
| 2 | Technician desktop screens (~13 screens: Home, Per-Project View, Daily Log Composer/Detail, Project Tasks, Project Photos, Photo Upload, Submit Time, Raise RFI, Task Picker, and others) | Design mockups complete for the screens produced in this project's mockup workstream; developer confirmation needed on which of the 13 are already coded vs. still to build | Complete and review ~13 technician desktop screens against the approved mockups | 2 days | Part of Phase 1 (see 14.3) | Finalized mockups (available); confirmation from Mandeep on current build state per screen | Within Phase 1 window | **TBD – Developer Confirmation Required:** which of the 13 screens are already built vs. still pending is not stated in the estimate. Confirm before finalizing the Phase 1 schedule. |
| 3 | Photo Uploader + Project Photos (tech-side upload, Assets screen) | Blocked on approval | Add Photo Uploader to the technician side, update the Assets screen, and decide whether Project Photos should be organized folder-wise or date-wise | 2 days | 1 day (part of Phase 1) | **Approval from Shri and Mike required before development starts.** Folder-vs-date decision required. | Cannot start the 2-day clock until approval + decision land | Flagged by the developer as needing sign-off first. Until Shri/Mike approve and the folder-vs-date question is settled, this item cannot be scheduled with confidence. |
| 4 | Daily Timesheet / Daily Log — "add time" clarification | Blocked on clarification | Discuss the additional time requirement and clarify the original purpose before implementing anything | 1 day | 1 day (part of Phase 1, once clarified) | **Clarification meeting required** before development starts | Cannot start until clarified | Developer flagged this as needing discussion, not just build time. Treat the 1-day estimate as build time only, starting after the clarification conversation, which is not yet scheduled. |
| 5 | Timesheet dashboard + Time tab updates | Not started | Update both screens to reflect the "add time" changes from item 4 | 1 day | 1 day (part of Phase 2) | **Depends on item 4** being resolved first | After item 4 completes | Sequenced after item 4; cannot start earlier |
| 6 | Client Reports (workflow implementation) | Mockup complete (`odin-client-reports.html`); approval workflow not yet built | Discuss the approval process and implement the Client Reports workflow | 2 days | 1 day (part of Phase 2) | **Confirmation of the approval workflow required** before/during development | Within Phase 2 window | Spec section 6.8 already documents a non-bypassable admin-approval gate. Confirm the developer's "discuss the approval process" is reconciling implementation detail against that existing spec decision, not reopening whether approval is required at all. |
| 7 | Foreman and Supervisor Report — detail screens | Not documented in this spec (gap) | Complete Foreman and Supervisor report detail screens | 1 day | 1 day (part of Phase 2) | Spec addendum needed — see note | Within Phase 2 window | **Not currently in Section 6 or 7 of this spec.** Foreman/Supervisor time entry (Submit Time, project variant) is documented in 7.12, but a "Foreman/Supervisor Report" detail screen is not. Recommend a short spec addendum before or alongside this dev work so the built screen has a documented source of truth. |
| 8 | Foreman and Supervisor Report — compose screens | Not documented in this spec (gap) | Complete compose screens for Foreman and Supervisor reports | 2 days | 1 day (part of Phase 2) | Same as item 7 | Within Phase 2 window | Same gap as item 7 — recommend documenting alongside item 7's addendum rather than as a separate pass |
| 9 | Change Notice functionality (admin side) | **Known rework needed**, not just completion (see README "Change Notices rework," flagged high priority) | Complete Change Notice functionality | 1 day | 1 day (part of Phase 2) | Resolution of the Change Notices admin-vs-field-originated model (Justin's May 21, 2026 email) | Within Phase 2 window, **contingent on risk below** | **Highest risk item in this plan.** The README calls this the single highest-priority open item blocking final dev handoff — the current mockups (`odin-change-notices.html`, `odin-change-notices-rfi.html`) reflect an admin-initiated model that Justin's feedback superseded (field originates, office formalizes and sends). A 1-day estimate looks like it assumes the mockups already reflect the corrected model. Confirm this with the developer before treating 1 day as reliable. |
| 10 | RFI and PCN changes | Blocked on requirements confirmation; **also has an unresolved spec conflict** (see risk) | Discuss, implement, and test RFI and PCN changes | 2 days | 1 day (part of Phase 2) | **Confirmation of remaining RFI/PCN requirements required.** Resolution of the spec conflict noted below. | Within Phase 2 window | **Spec conflict:** Section 7.13 of this document explicitly lists "Change Notices (PCNs, RFIs)" as something the technician does **not** see. But item 11 below, and the tech-side Raise RFI mockup already built this cycle, assume technicians (and Foremen/Supervisors) *do* raise RFIs from the field — consistent with Justin's later direction, not with the original 7.13 text. Section 7.13 needs a formal update before dev treats it as current. |
| 11 | RFI Compose — technician side | Mockup built (`odin-tech-picker.html`-adjacent Raise RFI composer, this cycle); not yet in a coded/testable build per developer note | Test the technician-side RFI Compose functionality and fix issues if required | 1 day | 1 day (part of Phase 1, once built) | Depends on item 10's spec resolution (7.13 conflict, above) | Within Phase 1 or 2 depending on build timing | Same 7.13 conflict as item 10 applies here directly — this screen's existence is the concrete evidence that 7.13 is stale. Also not yet listed in the spec's Section 7 table of contents (7.1–7.13); recommend adding as new 7.14 (Raise RFI) and 7.15 (Task Picker, shared component) once the model is confirmed. |
| 12 | Integration testing (developer-side) | Not started | Developer-run end-to-end pass across the Project Module after all other items are complete | 2 days | N/A — this is the developer's own pre-QA check, distinct from Phase 3 below | All items 1–11 complete | Immediately precedes Phase 3 | This is the developer's own integration pass, separate from and prior to the two-week QA workflow/regression testing phase (14.3, Phase 3). Don't conflate the two — they serve different purposes and are run by different teams. |

**A note on the arithmetic.** The developer's document states development totals **18 days** and integration/regression testing **2 days**, for **20 working days total**. Summing the individual line-item estimates as given (items 1–11) comes to **16 days**, not 18 — a 2-day gap between the itemized rows and the developer's own stated total. This isn't something we can resolve from the document alone. **Recommend confirming with Mandeep** whether an item was under-stated, whether a line is missing, or whether the 18-day total already includes a buffer not broken out per item. **This plan uses the developer's stated 18-day total** (not the 16-day sum of visible line items) for all downstream scheduling, since it's the figure the developer explicitly presented as authoritative — but this is flagged as unconfirmed and worth resolving directly, not silently absorbed.

### 14.3 Testing plan

Testing happens in five overlapping phases, not as one block after development finishes. Phases 1 and 2 run *during* development, in parallel with items still being built. Phase 3 begins only once all development (including the developer's own integration pass) is complete.

**Phase 1: Individual Screen Testing** — **~1 week**, starting as soon as each screen is completed and pushed to the test environment, running in parallel with ongoing development on other items.

For each screen, test:
- Page loading and navigation
- Fields, buttons, dropdowns, filters, tabs, and actions
- Required-field validations
- Data creation, editing, saving, and deletion where applicable
- Role and permission behaviour
- Desktop and mobile responsiveness, where applicable
- Empty states, error messages, and edge cases
- Data displayed against the approved specification and mockups
- Integration with existing modules, including Work Orders, TimeTracker, reports, employees, clients, locations, and equipment where relevant

**Phase 2: Feature and Integration Testing** — begins as related screens become available; tests complete feature areas rather than isolated screens. Examples: creating and editing a project; creating tasks and subtasks; assigning employees or technicians; entering and rolling up time from subtasks to tasks and projects; updating project status and progress; managing roadblocks (as the Blocked task state); viewing project details and dashboard information; reviewing reports and time entries; confirming data stays consistent across admin and technician views.

**Phase 3: End-to-End Workflow Testing** — begins after all required screens and backend functionality are complete and available in the test environment (i.e., after item 12 above). Tests the complete project lifecycle: project creation; project setup and assignment; task and subtask creation; technician access and updates; time entry submission; time roll-up from subtask to task and project; status and progress updates; roadblock creation and resolution; report and dashboard updates; project completion or closure; historical data and completed-project review. **Allow approximately two weeks after full development completion** for this phase, inclusive of defect retesting, regression testing, and final validation.

**Phase 4: Defect Resolution and Regression Testing** — runs as an overlapping activity throughout Phase 3, not appended afterward. Includes: logging defects with steps to reproduce; developer investigation and correction; retesting corrected issues; regression testing of related screens and workflows; confirming fixes don't affect existing ODIN functionality.

**Phase 5: Final Review and UAT Readiness** — the final 1–2 days of the Phase 3 window. Before marking the module ready for UAT, confirm: all agreed screens are complete; critical and high-priority defects are resolved; full workflows have been successfully tested; data is consistent across connected screens; permissions have been validated; existing ODIN functionality has not been negatively affected; known limitations and lower-priority items are documented; the module is stable enough for client UAT.

### 14.4 Milestone timeline

Dates below assume development resumes **Monday, August 3, 2026** — this start date is an assumption, not a confirmed commitment, and should be confirmed with Mandeep before this timeline is shared externally. All working-day math excludes weekends; Labour Day (Monday, September 7, 2026) is excluded from the Phase 3 count.

| Milestone | Date | Basis |
|---|---|---|
| Screens currently ready for testing | **TBD – Developer Confirmation Required** | Design mockups are complete for all screens covered in this spec's mockup set (Sections 4, 6, 7). Which screens already have a working dev build deployed to the test environment today is not stated in the developer's estimate — confirm with Mandeep. |
| Development resumes (assumed) | Mon, Aug 3, 2026 | Assumption pending confirmation |
| Phase 1 (Individual Screen Testing) window | Aug 6 – Aug 13, 2026 (~1 week) | Runs in parallel with development on items 3–8, starting once the first newly-completed screens (item 2's technician desktop set) land in the test environment |
| Remaining development complete (items 1–11) | Wed, Aug 26, 2026 | 18 working days from Aug 3, per developer's stated total (see 14.2 arithmetic note) |
| Phase 2 (Feature and Integration Testing) window | Aug 14 – Aug 28, 2026 | Overlaps items 7–12 as each feature area's screens complete |
| Developer integration testing complete (item 12) | Fri, Aug 28, 2026 | 2 working days immediately following Aug 26 |
| Start of full workflow testing (Phase 3) | Mon, Aug 31, 2026 | First working day after development + developer integration testing complete |
| End of full workflow testing, regression, and final validation (Phases 3–5) | Mon, Sep 14, 2026 | 2 calendar weeks (10 working days) from Aug 31, adjusted for the Sep 7 Labour Day holiday |
| **Estimated UAT-ready date** | **On or about Mon, Sep 14, 2026** | Contingent on no critical defects requiring schedule extension during Phase 3 |
| **Estimated production-ready date** | **TBD – depends on client (Thor/Justin) UAT duration and sign-off timeline** | Not calculable from information available; typically UAT + a short fix cycle adds 1–3 weeks beyond the UAT-ready date, but this is a planning assumption, not a confirmed figure |

### 14.5 Critical path, dependencies, assumptions, and risks

**Critical path:** Items 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 (developer's sequencing) → Phase 3 (2 weeks) → UAT-ready. Any slip in items 3, 4, 6, 9, or 10 — the five items with an open approval, clarification, or spec-conflict dependency — pushes the entire chain, since the developer's estimate treats these as a single sequential list rather than parallel workstreams.

**Key risks and dependencies:**

- **Screens delivered later than planned.** The 13 technician desktop screens (item 2) are described only in aggregate; if individual screens slip, Phase 1 testing has less to work with and may not fill its full one-week window productively.
- **Backend functionality not available with the frontend.** Not explicitly flagged in the developer's estimate, but standard risk for any UI-first mockup-to-build handoff. Confirm backend/API readiness tracks with each screen's frontend completion, not after.
- **Changes to the approved specification.** Two live examples already exist in this document: the Section 7.13 tech-visibility conflict (item 10/11) and the undocumented Foreman/Supervisor Report screens (items 7/8). Both need spec resolution, ideally before or concurrent with the dev work, not after.
- **Incomplete integrations.** Phase 1's testing checklist explicitly includes integration with Work Orders, TimeTracker, reports, employees, clients, locations, and equipment — confirm these integration points are stable before Phase 1 begins, or testing will surface integration defects that look like Project Module bugs but aren't.
- **Delays in resolving critical defects.** Phase 3's 2-week window includes defect retesting and regression, but a critical defect found late in that window (e.g., during Phase 5's final review) could push the UAT-ready date past Sep 14.
- **Test-environment or test-data issues.** Not addressed in the developer's estimate. Confirm a stable, representative test environment and test data set (sample projects, tasks, techs, clients) will be available for Phase 1 start.
- **Dependencies between admin and technician-side screens.** The Activity tab (6.5) surfaces events from every other tab; Change Notices (6.6) and the tech-side RFI Compose (item 11) are directly coupled. Testing either side in isolation risks missing cross-side defects — Phase 2's feature-area testing approach is designed to catch this, but only if admin and tech screens for a given feature are tested together, not on separate schedules.
- **The 16-vs-18-day arithmetic gap** (see 14.2) is itself a risk: if the extra 2 days are real and simply missing from an item, the schedule above is 2 days optimistic.
- **Foreman/Supervisor Report screens (items 7–8) lack a spec reference.** Until documented, there's no approved source of truth for testers to check the built screens against, which risks Phase 1/2 testing being based on tester assumptions rather than an approved spec.

### 14.6 Summary

- **Estimated Development Completion:** Wednesday, August 26, 2026 (18 working days from an assumed Monday, August 3, 2026 start — start date pending confirmation)
- **Testing of Currently Available Screens:** Approximately one week (Phase 1), running in parallel with ongoing development
- **Full Workflow and Regression Testing:** Approximately two weeks after all development is complete (Phases 3–5), targeting August 31 – September 14, 2026
- **Estimated UAT-Ready Date:** On or about Monday, September 14, 2026
- **Estimated Production-Ready Date:** TBD – depends on client (Thor/Justin) UAT duration and sign-off; not calculable from information currently available
- **Key Assumptions:** Development resumes Monday, August 3, 2026; the developer's stated 18-day development total is used in place of the 16-day sum of individual line items; no additional scope is added mid-cycle; the five items with open approvals/clarifications/spec conflicts (items 3, 4, 6, 9, 10) are resolved on the schedule the developer's estimate implicitly assumes
- **Main Risks:** Section 7.13's tech-visibility conflict and the undocumented Foreman/Supervisor Report screens are open spec gaps that could stall items 7, 8, 10, and 11 if not resolved promptly; the Change Notices rework (item 9) is flagged elsewhere in this project as the single highest-priority open item and may be under-estimated at 1 day; the 2-day gap between itemized and total developer estimates is unresolved; several items are blocked on approvals or decisions (Shri/Mike photo uploader sign-off, Daily Log "add time" clarification, Client Reports approval-process confirmation) with no scheduled date for those conversations to happen
