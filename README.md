# Odin Project Module · Where we left off

**Client:** Thor Plumbing & Heating
**Product:** Odin (Thor's internal field service / project management app, built by Web Wizards)
**Module:** Project Module (new functionality being added to Odin)
**Primary contact at Thor:** Justin Thorsteinson (super admin, business owner)
**Target ship:** June 15, 2026

---

## What's in this package

- **`PROJECT-MODULE-SPEC.md`**: 13-section specification document. Read this first.
- **`index.html`**: visual deck linking to all mockups, organized in three parts.
- **20 HTML mockups** with naming convention `odin-*.html`. Each is a self-contained page with the design on the left and design-rationale annotations on the right (yellow box).

Mockup breakdown:
- **Part 1: Module entry point** (1 mockup). Project List View, the screen you land on when clicking Projects in the sidebar.
- **Part 2: Per-project admin tabs** (8 mockups). Overview, Daily Logs, Activity, Change Notices PCN variant, Change Notices RFI variant, Assets, Assets Trash variant, Client Reports.
- **Part 3: Tech mobile surfaces** (11 mockups). Tech home, per-project view, project picker, daily log composer/detail/list, task list/detail, photos grid, photo upload step 2, project-variant timesheet submit.

Tasks and Time tabs don't have dedicated mockups; they reuse or lightly extend existing Odin production UI patterns. See spec sections 6.2 and 6.3.

## Current status

**Mockups are at v1.** All 20 are built in the current production Odin brand (white sidebar, dark topbar, blue accents, lowercase "odin" logo with red dot). The lime green / alternate brand visible in the existing Odin dev build is NOT what we're shipping with this module.

**Spec doc is at v1.** Section structure is settled, content is detailed enough for dev handoff with one significant exception: see the Change Notices rework below.

**The package is shareable internally** to other Web Wizards team members. NOT yet ready for Justin or Thor's dev team to receive as a final deliverable.

## Open items (in rough priority order)

### 1. Change Notices rework (HIGH PRIORITY, blocks final dev handoff)

The current Change Notices mockups (`odin-change-notices.html` and `odin-change-notices-rfi.html`) are based on an admin-initiated mental model: the office raises a PCN or RFI from the admin web app. Justin's email feedback (received May 21, 2026) clarified that the actual flow is mostly the opposite:

- **Field originates the notice.** Foreman or tech notices a discrepancy or change on site (e.g., drawings vs spec conflict).
- **Office formalizes and sends.** PM (Justin or delegate) reviews the field-captured info, formalizes it into a proper PCN or RFI document, and emails the PDF to the GC/client.
- **Reply comes back via email** (not in Odin) and PM manually updates the Odin record with the resolution.

Justin's bonus clarifications:
- **RFIs are outbound only.** They always come from Thor or its sub-trades, never from the GC.
- **PCNs are bidirectional.** GC-initiated PCNs can also land in Odin, captured by admin uploading the PDF the GC sent.
- **v1 send mechanism is Option A: file repository + downloadable PDF.** Admin sees the record in Odin, generates a formatted PDF, emails it from Outlook using their normal workflow. Reply comes back via email; admin manually updates the record. Option B (Odin sends and receives email directly) is parked for a future phase.
- **Possible reuse:** the existing Odin client/GC portal that delivers Client Reports could also deliver PCN/RFI PDFs. Confirm whether that portal actually exists in production or is conceptual.

**Work needed for this rework:**

1. **NEW mobile mockup**: Change Notice composer for the field (tech raises PCN or RFI from their phone, with type toggle, summary, optional photo).
2. **NEW admin detail mockup**: per-record view with field-origin metadata, formal fields, Generate PDF action, status changer (New / In Progress / Resolved / Rejected), and resolution field.
3. **UPDATE admin Change Notices register**: add direction indicator (Outbound for RFIs and Thor-PCNs, Inbound for GC-PCNs), source indicator (Field-raised vs Office-raised), status states.
4. **UPDATE tech home or per-project view**: add "Raise Change Notice" entry point.
5. **UPDATE spec section 6.6** (Change Notices) to reflect the new bidirectional model and the field-originated flow.
6. **Confirm with Brent (or whoever knows)**: does the client/GC portal Justin mentioned actually exist in production today?

### 2. Cancelled-status example on Project List View

The Project List View mockup (`odin-projects-list.html`) shows only one example row (an Active project). Add a few more rows showing the other statuses (On Hold, Completed, Cancelled) before final review, so the status pill colors can be validated visually.

### 3. Confirm where removed default settings live

Earlier in the design, the Project List View had two cards on it: Default Team Members and Default Project Folders. Those were removed from this screen (they didn't belong on the module entry point). Confirm with the dev team where those settings now live in Odin: account settings, admin config, or elsewhere.

### 4. Other items parked in spec section 11

The spec's section 11 ("Open decisions") lists several items that are intentionally deferred to v1.1 or later. Worth a scan before kicking off dev work.

## Style and brand conventions

These are non-negotiable for the deck:

- **No em dashes anywhere.** Use colons, semicolons, periods, or sentence breaks. This applies to spec doc, mockup annotations, and any new files.
- **No AI-hallmark phrasing.** Avoid words like "leverage," "delve," "navigate the," "streamline." Direct, plain prose.
- **Brand:** current production Odin brand only. White sidebar with logo, dark topbar (`#1c1d1f`), blue accents (`#1d62d3`), lowercase "odin" wordmark with red dot, pink-red gradient action buttons (`#f86077` to `#ed1c24`). Type: Inter (UI), IBM Plex Mono (IDs and codes).
- **No lime green.** The lime green visible in the existing Odin dev build is from an alternate brand that does not exist in production and is not what we're shipping.
- **No mascot character.**

## Working approach with Claude in this project

When you (or your collaborator) start a chat in this project:

- The spec doc and all mockups are in the project knowledge base, so Claude can reference them directly.
- Mention which file or section you're working on (e.g., "Looking at Section 5.6 of the spec, the Change Notices rework").
- For new mockups: Claude generates them as standalone HTML files. Match the existing pattern (annotations on the right in a yellow box, current Odin brand CSS variables).
- For spec updates: Claude can edit the spec doc directly or generate replacement sections.
- After significant changes, ask Claude to rebuild the index.html so the deck stays current.

## Decisions already made (don't relitigate without good reason)

A few things that took back-and-forth to settle. Worth knowing so you don't accidentally undo them:

- **Access model is open.** All Thor projects are accessible to all Thor users. Assignment is a soft signal for sorting/dashboards, not a permission gate. Per Justin's stated culture.
- **Tasks ≠ Work Orders.** They're separate entities. Tasks live in the new Project Module; Work Orders are the existing service-side production entity.
- **Roadblocks removed as a tab.** Roadblock is now the "Blocked" state of a Task, not a separate concept.
- **Comms tab renamed to Activity.** Activity is the chronological audit timeline of all project events: human posts plus system events from every tab. Comms as a separate concept is gone.
- **Client Reports has a non-bypassable approval workflow.** Admin must review before send. This is a deliberate guardrail.
- **Page title bar pattern** sits below the tab row on every admin web page (icon + h2 + subtitle + counter). Active tab in the tab row is bold + thicker underline + larger.
- **Density variance on lists.** Today's row stays full, older rows compress. Applied to Daily Logs feed on admin.

## Contact / context

This work was done by Claude in a Web Wizards chat session with Mike Bayes (May 2026). Mike is principal at Web Wizards (webwizards.ca), the Canadian digital services firm building Odin. The Thor Plumbing & Heating relationship is a co-development partnership with Justin Thorsteinson as primary contact and Brent as the technical lead on the Thor side.

The Expenses Module, which was developed in parallel during the same session, has been split into its own project. This deck is the Project Module ONLY.

---

**Next steps for someone picking this up:**

1. Read this README (you're doing it).
2. Read `PROJECT-MODULE-SPEC.md` end to end. Especially Section 5 (changes from current state) and Section 11 (open decisions).
3. Open `index.html` in a browser and click through every mockup. Read the yellow annotation boxes on each.
4. Decide whether to tackle the Change Notices rework first (highest-leverage open item) or polish other surfaces.
5. Start a chat in this project with whatever you want to work on. The knowledge base is loaded; Claude has everything.
