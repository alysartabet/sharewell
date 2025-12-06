const db = require("../db");

// 1 XP per $1 of total order amount
const XP_PER_DOLLAR = 1;

/**
 * Award XP for a completed order.
 *
 * @param {object} client - pg client from withTransaction
 * @param {object} params
 * @param {number} params.customerId
 * @param {number} params.orderId
 * @param {number} params.orderTotalCents - order total in cents
 *
 * Returns: { xp_transaction, xp_balance, current_tier }
 */
async function awardXpForOrder(client, { customerId, orderId, orderTotalCents }) {
  // Convert cents -> dollars
  const dollars = orderTotalCents / 100;
  const xpAmount = Math.max(0, Math.floor(dollars * XP_PER_DOLLAR));

  // If no XP to award, just return null
  if (xpAmount <= 0) {
    return null;
  }

  // Insert into xp_transactions
  const insertRes = await client.query(
    `
    INSERT INTO xp_transactions (
      customer_id,
      order_id,
      amount,
      reason
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id, customer_id, order_id, amount, reason, created_at
    `,
    [customerId, orderId, xpAmount, "purchase"]
  );

  const xpTransaction = insertRes.rows[0];

  // Compute current XP balance
  const balanceRes = await client.query(
    `
    SELECT COALESCE(SUM(amount), 0) AS xp_balance
    FROM xp_transactions
    WHERE customer_id = $1
    `,
    [customerId]
  );

  const xpBalance = Number(balanceRes.rows[0].xp_balance);

  // Determine membership tier based on membership_tiers table
  let currentTier = null;
  try {
    const tiersRes = await client.query(
      `
      SELECT id, name, min_xp, discount_percent
      FROM membership_tiers
      ORDER BY min_xp ASC
      `
    );

    const tiers = tiersRes.rows;

    for (const tier of tiers) {
      if (xpBalance >= Number(tier.min_xp)) {
        currentTier = tier;
      }
    }
  } catch (e) {
    // If membership_tiers table / logic is missing, silently ignore
    console.warn("Could not compute membership tier:", e.message);
  }

   await client.query(
    `
    UPDATE customers
    SET
      xp_balance = $2,
      membership_tier_id = $3
    WHERE id = $1
    `,
    [customerId, xpBalance, currentTier ? currentTier.id : null]
  );

  return {
    xp_transaction: xpTransaction,
    xp_balance: xpBalance,
    current_tier: currentTier,
  };
}

module.exports = {
  awardXpForOrder,
};