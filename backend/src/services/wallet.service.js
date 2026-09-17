// src/services/wallet.service.js
// ─────────────────────────────────────────────────────────────────────────────
// Per Architecture A9: the ONLY place any currency balance is changed.
// No feature service (streak, spin, referral) may call Wallet.updateOne() directly.
// Built Phase 0 as stubs; full implementation in Phase 1.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const AuditLog = require('../models/AuditLog');
const { CURRENCIES } = require('../config/constants');

/**
 * Credit a user's wallet for a specific currency.
 *
 * Enforces (A9):
 *  1. amount > 0
 *  2. currency is a known enum value
 *  3. Runs inside the caller's Mongo session (atomicity with StreakClaim insert)
 *  4. Writes WalletTransaction + AuditLog
 *  5. Idempotent on referenceId — no-op if transaction already exists
 *
 * @param {string}            userId      - from JWT, never from client body
 * @param {string}            currency    - one of CURRENCIES
 * @param {number}            amount      - must be > 0
 * @param {string}            source      - e.g. 'DAILY_STREAK'
 * @param {string}            referenceId - e.g. StreakClaim._id.toString()
 * @param {ClientSession}     session     - mongoose session for atomicity
 * @returns {Promise<{balanceBefore, balanceAfter, transactionId}>}
 */
async function creditWallet(userId, currency, amount, source, referenceId, session) {
  // TODO Phase 1: implement full body
  // Placeholder validates inputs only so Phase 0 server boots correctly
  _validateCreditDebitInputs(currency, amount);
  throw new Error('wallet.service.creditWallet: not yet implemented (Phase 1)');
}

/**
 * Debit a user's wallet for a specific currency.
 * Uses a conditional update ($gte: amount) so balance can never go negative under a race.
 * Fully guarded but no feature calls this yet — ready for future withdrawal/spend features.
 *
 * @param {string}            userId
 * @param {string}            currency
 * @param {number}            amount
 * @param {string}            source
 * @param {string}            referenceId
 * @param {ClientSession}     session
 */
async function debitWallet(userId, currency, amount, source, referenceId, session) {
  // TODO Phase 1: implement full body
  _validateCreditDebitInputs(currency, amount);
  throw new Error('wallet.service.debitWallet: not yet implemented (Phase 1)');
}

/**
 * Get the balance for a single currency.
 * @param {string} userId
 * @param {string} currency
 * @returns {Promise<number>}
 */
async function getBalance(userId, currency) {
  // TODO Phase 1: implement full body
  if (!CURRENCIES.includes(currency)) {
    throw new Error(`Unknown currency: ${currency}`);
  }
  throw new Error('wallet.service.getBalance: not yet implemented (Phase 1)');
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function _validateCreditDebitInputs(currency, amount) {
  if (!CURRENCIES.includes(currency)) {
    const err = new Error(`Invalid currency: ${currency}`);
    err.status = 400;
    throw err;
  }
  if (typeof amount !== 'number' || amount <= 0) {
    const err = new Error('Amount must be a positive number.');
    err.status = 400;
    throw err;
  }
}

/**
 * Generate a transaction ID in the format STREAK-xxxxxxxx.
 * Exported for use in seed / tests.
 */
function generateTransactionId(prefix = 'STREAK') {
  return `${prefix}-${uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

module.exports = { creditWallet, debitWallet, getBalance, generateTransactionId };
