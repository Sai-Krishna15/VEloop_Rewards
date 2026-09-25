# VELoop API Documentation

All routes expect the `Authorization: Bearer <token>` header. The `userId` is securely decoded from the token.

## Base URL
`/api/daily-streak`

---

## 1. Authentication

### `POST /auth/register`
Creates a new user and provisions an empty wallet.
**Body:**
```json
{
  "username": "user1",
  "password": "password123"
}
```

### `POST /auth/login`
Authenticates a user and returns a JWT.
**Body:**
```json
{
  "username": "user1",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUz...",
  "user": { "id": "...", "username": "user1" }
}
```

---

## 2. Daily Streak API

### `GET /`
Retrieves the user's current streak state, wallet balance, and the 7-day reward layout.

**Response:**
```json
{
  "success": true,
  "serverTime": "2026-09-25T12:00:00.000Z",
  "streak": {
    "currentStreak": 1,
    "currentDay": 2,
    "checkedIn": 1,
    "totalRewards": 7,
    "status": "ACTIVE",
    "nextClaimAt": "2026-09-26T12:00:00.000Z"
  },
  "rewards": [
    { "day": 1, "status": "CLAIMED", "reward": { "type": "VEs", "amount": 10 } },
    { "day": 2, "status": "TODAY", "reward": { "type": "VEs", "amount": 20 } },
    { "day": 3, "status": "LOCKED", "reward": { "type": "VEs", "amount": 30 } }
  ],
  "wallet": {
    "vesBalance": 10
  }
}
```

### `POST /claim`
Claims the reward for the current day. Validates time gates and prevents duplicate claims using idempotency keys.

**Body:**
```json
{
  "day": 2
}
```

**Response:** Returns the same structure as `GET /` with updated state.

**Common Errors:**
- `400`: Invalid day or missed streak (returns `{ "error": { "code": "STREAK_MISSED" } }`)
- `403`: Reward gated (returns `{ "error": { "code": "REWARD_GATED", "message": "Your next reward is not available yet." } }`)
- `409`: Already claimed today

### `POST /status`
(Testing/Admin) Manually sets the status of a specific day without waiting 24 hours.

**Body:**
```json
{
  "day": 2,
  "status": "COMPLETED"
}
```

### `POST /reset`
(Testing/Admin) Resets the user's streak cycle to Day 1, clearing all claims.
