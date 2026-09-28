# Carters Logistics 🚚

A complete, worldwide **consignment & logistics** website with real-time shipment
tracking and a full admin dashboard. Built with **Next.js 14 (App Router)**,
**TypeScript**, and **Tailwind CSS**.

## Features

### Public website
- **Home** — hero with live tracking search, services, stats, process, testimonials, and CTA
- **About**, **Services**, **FAQ**, **Contact**, **Get a Quote**, **Privacy**, **Terms**
- **Choose a carrier** — pick one of the top 5 US couriers (USPS, FedEx, UPS, DHL,
  Amazon Logistics) to open that carrier's own **themed tracking page**
- **Track Shipment** — each carrier's tracking page adopts its brand colors and fonts,
  then entering a tracking number shows the shipment details (sender, recipient,
  destination, status timeline, etc.)

### Admin dashboard (`/admin`)
- **Multi-admin signup & login** — anyone can create an admin account; each admin only
  sees and manages **their own** shipments
- **Dashboard** — stats and a table of your shipments (with a courier column)
- **Add Shipment** — pick the delivery service (courier), enter the product + sender +
  recipient details; a **random tracking number is generated automatically** in that
  courier's real-world format
- **Edit Shipment** — update any detail, including the editable **status/process text**
- **Settings** — edit the company details, tracking page text, the "Contact Customer Care"
  button text, and the **status/timeline step labels** shown to customers

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

### Admin access
- **Sign up:** http://localhost:3000/admin/signup
- **Log in:** http://localhost:3000/admin/login (username **or** email + password)

There is no single shared admin account anymore — create your own.

A sample USPS shipment with tracking number **`9400 1000 0000 0000 0000 00`** is seeded
on first run so you can try the themed tracking page immediately at
`/track/usps?number=9400100000000000000000`.

### Courier logos

Drop your own carrier logo images into `public/images/couriers/` using these names
(SVG or PNG):

```
usps.svg   fedex.svg   ups.svg   dhl.svg   amazon.svg
```

Until a logo file exists, the app shows a styled text wordmark in that carrier's
brand color.

## Configuration

Set these environment variables — in a `.env.local` file locally, or in
**Vercel → Project Settings → Environment Variables**:

```bash
ADMIN_SECRET=change-me-to-a-long-random-string
```

> **Admin login:** create your own account at `/admin/signup`. Set `ADMIN_SECRET`
> to a long random string to keep session cookies secure before going live.

## Deploying to Vercel

The app is fully wired for production. In **Vercel → Project Settings → Environment
Variables**, add these (the code auto-detects them and falls back to local JSON/files in
development):

- `POSTGRES_URL` — Vercel Postgres (or Neon). Stores shipments, settings, and admin users.
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob. Stores uploaded product images.
- `RESEND_API_KEY` + `EMAIL_FROM` — Resend. Sends the tracking number to the client's email automatically.
- `NEXT_PUBLIC_SITE_URL` — your public domain (e.g. `https://carterslogistic.com`), used in emails.
- `ADMIN_SECRET` — signs the admin session cookie.

Without these variables the app still runs locally (JSON files + on-disk uploads), so
you can develop and preview everything before connecting services.

## How data is stored

- **Production (Vercel):** Postgres (shipments, settings, admin password) + Vercel Blob (images).
- **Local development:** JSON files under `data/` + images under `public/uploads/`.

The data layer lives in `src/lib/store.ts` (Postgres ↔ JSON switch) and
`src/lib/uploads.ts` (Blob ↔ disk switch).


## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) for icons
- Google Fonts: Poppins + Inter
