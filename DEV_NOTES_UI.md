
# DEV_NOTES_UI.md

Generated: 2025-10-30T08:19:59.363838Z

This file contains prioritized UI/UX improvements and implementation guidance for GoWorld Tours.

## Priorities
1. Responsive search bar with filters (destination, dates, price, tags).
2. Listing cards: image, title, price, rating, vendor badge, CTA.
3. Mobile-friendly booking CTA (sticky bottom button).
4. Improved dashboards: admin, vendor, user (scaffolded under /src/app/dashboard/...).
5. Performance: Next.js Image, lazy load, code splitting.

## Suggested file structure (Next.js app router)
- src/app/
  - (home page)
  - dashboard/
    - admin/
    - vendor/
    - user/
  - components/
    - ListingCard.tsx
    - BookingFlow/
    - ItineraryEditor/

## Firebase integration notes
- Use custom claims for `role` (admin/vendor/user).
- Use Cloud Functions for vendor verification & payouts.
- Do not store card/bank details in Firestore.

## Sample UI components to implement
- ListingCard: responsive with picture, price overlay, rating chip.
- BookingModal: multi-step form with summary and pay button.
- ItineraryEditor: drag & drop days + quick add.

