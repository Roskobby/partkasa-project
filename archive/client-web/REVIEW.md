# Code Review Notes

## Navbar (`src/components/Navbar.js`)
- The `NavLink` pointing to `/` will be considered active for any nested route in React Router v6 unless the `end` prop is provided. As-is, the "Search" tab stays highlighted even when you visit `/results` or `/checkout`. Add `end` to that link to prevent incorrect active styling.

## Search Page (`src/pages/Search.js`)
- The guests field writes a string value back into state (as HTML form inputs always emit strings). Later you call `String(form.guests)` when building the query params, which hides the issue, but the component state will contain string values such as `'2'`. Consider normalizing the value to a number when you store it so downstream consumers receive the expected type.
- There is no validation to ensure `checkOut` is after `checkIn`. Adding a guard before navigation would prevent impossible date ranges from being submitted.

## Results Page (`src/pages/Results.js`)
- The CTA button uses `font-semibol` instead of `font-semibold`, so Tailwind ignores the class and the button renders with the default font weight.
- Navigating to `/checkout` does not carry any context about the selected listing. If checkout needs to know which property the user chose, pass an identifier in the URL (e.g., `/checkout/:listingId`) or via navigation state.

## Checkout Page (`src/pages/Checkout.js`)
- The credit card field is missing an explicit `type` and `autoComplete` attributes (e.g., `type="text"` with `inputMode="numeric"`, `autoComplete="cc-number"`). Without them, browsers cannot offer autofill or numeric keyboards on mobile.
- None of the inputs include validation. Even basic `required` attributes or client-side checks would improve the fidelity of this mock flow.

## General
- All pages rely on hard-coded data. To make the prototype more representative, consider reading from shared mock data modules or wiring the views to fetch functions so they can later be swapped for real APIs without structural changes.
