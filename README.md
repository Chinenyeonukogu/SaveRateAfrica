# SaveRateAfrica 🇳🇬

The #1 remittance comparison platform for 
African diaspora in USA, UK and Canada.

## What It Does
- Compare real-time rates from 14 providers
- Find the best NGN payout instantly
- Savings calculator shows how much you save
- Currency trend charts (7Days/30Days)
- Rate alerts when NGN hits your target
- Credit card recommendations for immigrants
- No sign-up needed
- Works on all devices

## Built For
Africans sending money home from:
- 🇺🇸 United States (USD to NGN)
- 🇬🇧 United Kingdom (GBP to NGN)
- 🇨🇦 Canada (CAD to NGN)

## Providers Compared
Wise, Remitly, LemFi, Sendwave, WorldRemit,TapTap
MoneyGram, Western Union and more

## Tech Stack
- Next.js 
- React 
- TypeScript 
- Tailwind CSS 
- Framer Motion 
- Recharts 

## Live Site
[saverateafrica.com](https://saverateafrica.com)

## Vision
You work hard abroad. Your family deserves every naira of it. SaveRateAfrica helps
African diaspora in USA, UK and Canada compare 14 providers in seconds — so every
dollar, pound and loonie lands as more naira in your loved ones hands. No hidden fees. 
No guesswork. Just smarter sending money!

## Maintenance Mode
The site supports a server-enforced maintenance mode that shows every visitor a
dedicated "down for maintenance" page while you keep full access.

**Turn it ON/OFF:**
1. In the Vercel project settings, set the `MAINTENANCE_MODE` environment
   variable to `true` (on) or `false`/unset (off).
2. Redeploy (or click "Redeploy" on the latest deployment) for the change to
   take effect.

**Admin bypass (no login system required):**
1. Set a long random `MAINTENANCE_BYPASS_SECRET` environment variable (also in
   Vercel project settings) — keep this value private.
2. While maintenance mode is on, visit `https://www.saverateafrica.com/?bypass=YOUR_SECRET`
   once. This sets a secure, HttpOnly cookie in your browser and gives you full
   access to preview the live site; regular visitors without that cookie only
   ever see `/maintenance`.

The gate is enforced in `middleware.ts` on the server, so it can't be bypassed
by disabling JavaScript, and `/maintenance` itself is always reachable to avoid
redirect loops.

## Built By
Chinenye Onukogu
###
