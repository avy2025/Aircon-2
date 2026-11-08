# AIRCON Automation India website preview

Responsive frontend prototype for AIRCON Automation India Pvt. Ltd. Built with React, TypeScript, Vite and custom CSS.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local development URL (usually `http://localhost:5173`). To build and preview the production bundle:

```sh
npm run build
npm run preview
```

## Project structure

- `src/App.tsx` - routes, reusable UI components and frontend interactions
- `src/data.ts` - division, product, project and company fact content
- `src/styles.css` - design system, responsive layouts, transitions and reduced-motion rules
- `public/assets/README.md` - asset placement guidance
- `docs/asset-inventory.md` - visual attachment inventory, mapping and outstanding approvals

The frontend uses client-side route handling with clean URLs and Vite's development fallback.

## Frontend-only behaviour

Product catalogue data is mock content. Cart selections persist in local storage. Contact, quote, review and checkout forms validate in the browser but do not send or store submissions. No payments, customer accounts, backend services, order processing or ERP connections are implemented.

## Source material required before launch

The workspace did not contain the company profile PDF or image files. In particular, the required factory-building hero image, original logo file, product and project photographs, approved customer logos, company contact details, mission/vision statements and profile-referenced project information must be supplied and verified. The current photo panels are explicit placeholders, not photographs. See `docs/asset-inventory.md`.
