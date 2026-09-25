# VELoop Security Architecture

## 1. Authentication & Authorization
- **JWT Protection:** All API routes are protected by a JWT authorization middleware.
- **Payload Trust:** The `userId` is always extracted from `req.user.id` (populated by decoding the JWT). The application never trusts a `userId` passed in the request body or query parameters, preventing ID spoofing.

## 2. Race Condition Prevention
- **Database Locks & Indexes:** 
  - `StreakClaim` uses a unique compound index on `{ userId, cycleId, day }`. If two identical claim requests arrive concurrently, the database will throw a unique constraint violation on the second request.
  - `WalletTransaction` uses a unique index on `referenceId`. Every claim generates a deterministic `referenceId` (e.g., `claim_<cycleId>_<day>`). This ensures `creditWallet()` is strictly idempotent.
- **Transactions:** Core logic is wrapped in MongoDB transactions (`session.withTransaction`). If a credit succeeds but a streak update fails, the entire operation rolls back. *(Note: A fallback mechanism exists for non-replica local environments).*

## 3. Time Manipulation Mitigation
- **Server Time:** All time calculations (locking, missed streak checks) rely strictly on the backend clock (`new Date()`), completely ignoring the client's local machine time.
- **Strict Gating:** `nextClaimAt` enforces a 24-hour absolute lock between claims. Attempting to hit `/claim` early returns a `403 Forbidden`.

## 4. Rate Limiting
- The `/claim` endpoint is protected by `express-rate-limit`, permitting only a small number of requests per window, mitigating script-driven brute-force attacks on the economy layer.

## 5. Security Headers
- `helmet` is deployed in the Express application to set secure HTTP headers (e.g., preventing MIME-sniffing, XSS, and Clickjacking).
