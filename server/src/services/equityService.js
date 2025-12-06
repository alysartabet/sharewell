const db = require("../db");

// 0.001 equity units per $1 spent
const EQUITY_PER_DOLLAR = 0.001;

/**
 * Award equity units for an order.
 *
 * @param {object} client - pg client from withTransaction
 * @param {object} params
 * @param {number} params.customerId
 * @param {number} params.orderId
 * @param {number} params.orderTotalCents
 *
 * Returns: { equity_record, total_equity }
 */
async function awardEquityForOrder(client, { customerId, orderId, orderTotalCents }) {
  const dollars = orderTotalCents / 100;

  // Simple rule
  const equityUnits = Number((dollars * EQUITY_PER_DOLLAR).toFixed(4));

  if (equityUnits <= 0) {
    return null;
  }

  const insertRes = await client.query(
    `
    INSERT INTO equity_records (
      customer_id,
      order_id,
      equity_units,
      notes
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id, customer_id, order_id, equity_units, notes, created_at
    `,
    [customerId, orderId, equityUnits, "Equity awarded from purchase"]
  );

  const equityRecord = insertRes.rows[0];

  const totalRes = await client.query(
    `
    SELECT COALESCE(SUM(equity_units), 0) AS total_equity
    FROM equity_records
    WHERE customer_id = $1
    `,
    [customerId]
  );

  const totalEquity = Number(totalRes.rows[0].total_equity);

  return {
    equity_record: equityRecord,
    total_equity: totalEquity,
  };
}

module.exports = {
  awardEquityForOrder,
};

//Later: add view/helper to compute total equity balance per customer