# VELoop Database Architecture

## 1. User Model (`User.js`)
Handles authentication and core user identity.
- `username`: String (Unique)
- `password`: String (Hashed)

## 2. StreakCycle Model (`StreakCycle.js`)
Tracks the current state of a user's 7-day streak.
- `userId`: ObjectId (Index)
- `cycleStartDate`: Date
- `currentDay`: Number (1-7)
- `nextClaimAt`: Date (When the user can claim the next reward)
- `lastClaimedDay`: Number
- `status`: String (`ACTIVE`, `COMPLETED`, `MISSED`)
- **Index:** Unique compound index on `userId` and `status: "ACTIVE"` ensures a user only has one active cycle at a time.

## 3. StreakClaim Model (`StreakClaim.js`)
Immutable ledger of all successful claims.
- `userId`: ObjectId
- `cycleId`: ObjectId
- `day`: Number
- `reward`: Object (type, amount)
- `claimedAt`: Date
- **Index:** Unique compound index on `{ userId, cycleId, day }` completely eliminates race conditions (a user cannot claim the same day twice in the same cycle).

## 4. Wallet Model (`Wallet.js`)
An extensible wallet holding various currency balances.
- `userId`: ObjectId (Unique Index)
- `balances`: Map (Key: String, Value: Number) - E.g. `{"VEs": 100, "Gems": 5}`

## 5. WalletTransaction Model (`WalletTransaction.js`)
Double-entry ledger for wallet changes.
- `userId`: ObjectId
- `amount`: Number
- `currency`: String
- `type`: String (`CREDIT`, `DEBIT`)
- `referenceId`: String (Unique Index) - Corresponds to the claim ID or transaction ID. Prevents double-crediting.
- `status`: String (`COMPLETED`)

## 6. AuditLog Model (`AuditLog.js`)
System-wide event tracking.
- `userId`: ObjectId
- `action`: String (e.g., `STREAK_CLAIMED`, `WALLET_CREDITED`, `STREAK_MISSED`)
- `details`: Object
- `timestamp`: Date
