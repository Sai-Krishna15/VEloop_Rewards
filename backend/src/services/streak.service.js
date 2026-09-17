// src/services/streak.service.js
// All streak business logic lives here. Controllers are thin wrappers.
// Full implementation in Phase 1. Stubs provided so the server boots without crashing.

/**
 * Return full streak state: cycle + reward cards + wallet balance.
 * - Lazy-creates Cycle #1 if no active cycle exists (edge case 1).
 * @param {string} userId - from JWT
 */
async function getStreakStatus(userId) {
  // TODO Phase 1
  throw new Error('streak.service.getStreakStatus: not yet implemented (Phase 1)');
}

/**
 * Lightweight eligibility check used by frontend timer poll.
 * Returns { eligible: bool, nextClaimAt, currentDay }
 * @param {string} userId
 */
async function getEligibilityStatus(userId) {
  // TODO Phase 1
  throw new Error('streak.service.getEligibilityStatus: not yet implemented (Phase 1)');
}

/**
 * Full claim pipeline (A4 steps 1–10).
 * dayHint is advisory only — actual eligible day is always derived server-side.
 * @param {string}  userId
 * @param {number|null} dayHint - client-provided hint (may be ignored/rejected)
 */
async function claimReward(userId, dayHint) {
  // TODO Phase 1
  throw new Error('streak.service.claimReward: not yet implemented (Phase 1)');
}

/**
 * Paginated StreakClaim history.
 * @param {string} userId
 * @param {number} page
 * @param {number} limit
 */
async function getClaimHistory(userId, page, limit) {
  // TODO Phase 1
  throw new Error('streak.service.getClaimHistory: not yet implemented (Phase 1)');
}

module.exports = { getStreakStatus, getEligibilityStatus, claimReward, getClaimHistory };
