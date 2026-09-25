# VELoop Testing Guide

## Running Tests

The backend suite uses Jest and Supertest to run isolated tests against an in-memory MongoDB database.

To run the tests:
```bash
cd backend
npm run test
```

## What Is Covered?

### 1. Wallet Idempotency (`wallet.test.js`)
Tests verify the `wallet.service.js` directly:
- **Concurrent Credits**: Simulates racing promises to ensure `referenceId` unique constraints prevent duplicate rewards from being added to the wallet.
- **Concurrent Debits**: Ensures race conditions cannot drive a wallet balance below zero.
- **Invalid Currencies**: Verifies the ledger strictly rejects unsupported currencies.

### 2. Streak Hardening & Tampering (`streak.test.js`)
Tests every row of the architecture matrix (Part B):
- **Valid Claims**: Confirms that claiming Day 1 succeeds and sets the `nextClaimAt` gate accurately.
- **Duplicate Claims (Idempotency)**: Sending identical claim requests in parallel results in only 1 database update and 1 wallet credit.
- **Time Gating Bypass**: Attempting to claim Day 2 before 24 hours have elapsed is met with a 403 Forbidden.
- **Missed Streak Reset**: Fast-forwarding time beyond 48 hours resets the user's cycle back to Day 1, punishing the missed day.
- **Incorrect Day Parameter**: Sending a payload claiming Day 5 when the user is on Day 2 is rejected by validation.

## Manual Edge-Case Testing (Phase 6)
To manually test edge-cases in the live application:
1. **Multi-tab Test**: Open the application in two tabs. Trigger a claim in Tab A. Switch to Tab B and try to claim the same day. The server will reject it cleanly.
2. **Refresh Stability**: Reload the page while the Claim Modal is open or during a countdown. State must persist correctly.
3. **Session Expiry**: Log out in one tab, and attempt to click a claim button in a second tab. The app should gracefully intercept the 401 and redirect to the login screen.
