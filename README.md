# DSC Ambassadors

Official site for the Digital Spenders Club Ambassador Program.

**Spenders Move, Follow the Motion ©**

## Stack

- React 19 + TypeScript
- React Router (client-side routing between real pages)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Vite

No backend. Forms are client-side only; the Apply wizard persists drafts to
`localStorage` and "submits" locally (no data leaves the browser).

## Running it

```bash
npm install
npm run dev       # start the dev server
npm run build     # typecheck + production build to dist/
npm run preview   # preview the production build
npm run lint       # oxlint
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — hero, three program tiles, commitment cadence strip, eligibility checker |
| `/program` | The Program — who we want, the commitment table, content rules, success metrics |
| `/kit` | The Kit — wearables/tools/comms, NFC keychain demo, membership card, kit configurator |
| `/campus` | Campus — chapter cards, merch kickback, chapter flow, chapter interest form |
| `/events` | Events — SWC/conference circuit map, keychain onboarding, materials request preview |
| `/apply` | Apply — 4-step ambassador application wizard |
| `/guidelines` | Guidelines — printable official rules |
| `/hq` | HQ — preview of the private ambassador HQ (Telegram, SYNC calls, Discord), gated as "after approval" |

## Interactive components

All under `src/components/interactive/` and `src/components/apply/`:

- **Eligibility checker** (`EligibilityChecker.tsx`) — four yes/no questions, resolves to
  Ready to apply / Not yet / Talk to us.
- **Apply wizard** (`apply/ApplyWizard.tsx`) — Identity → Presence → Fit → Agreement, with a
  cream progress bar, per-step validation, `localStorage` draft persistence, and a
  timestamped success screen.
- **Commitment table** (`CommitmentTable.tsx`) — click a cadence row to expand real examples.
- **Commitment calendar** (`CommitmentCalendar.tsx`) — illustrates the 2x/month post cadence,
  daily engagement, and the quarterly IRL slot on a single month grid.
- **Kit configurator** (`KitConfigurator.tsx`) — garment, colorway, size, and region, with a
  live SVG preview of the complimentary piece.
- **NFC tap demo** (`NFCTapDemo.tsx`) — simulated tap-to-phone animation into a short onboarding
  flow.
- **Campus interest form** (`CampusInterestForm.tsx`) — school/club/city/headcount, separate
  from the main ambassador application.
- **Event materials request** (`EventMaterialsRequest.tsx`) — intentionally disabled preview;
  unlocks for real in the private Telegram Assets channel after approval.
- **SWC / conference heat map** (`SWCHeatMap.tsx`) — stylized, clickable circuit map (editorial,
  not a live data feed).
- **Referral / onboarding counter** (`ReferralCounterPreview.tsx`) — HQ stat preview module.
- **Monthly SYNC agenda accordion** (`SyncAgendaAccordion.tsx`).

## Design system

Majority black (`#0A0A0A` / `#000000`) and cream (`#F3EDE3` and friends), a single restrained
gold (`#C4A574`) for small marks, hairline borders, Playfair Display for display type, Inter for
body/UI, and a monospace grotesque for small labels. See `src/index.css` (Tailwind `@theme`
tokens) and `src/components/ui/` for the shared primitives.

## Content source of truth

Official guideline copy (eligibility, commitment table, content rules, success metrics) lives in
one place — `src/content/guidelines.ts` — and is reused verbatim across the Program page, the
Guidelines page, and the Apply wizard's agreement step, so the rules can't drift between pages.
