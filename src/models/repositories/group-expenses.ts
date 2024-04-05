type Param = {
  db: D1Database
  groupUuid: string
  limit?: number
  offset?: number
}

export type RawExpense = {
  expense_id: number
  amount: number
  description: string
  created_at: string
  paid_by_member_id: number
  paid_by_member_name: string
  participant_member_id: number
  participant_member_name: string
}

export const queryGroupExpenses = async (
  param: Param
): Promise<RawExpense[]> => {
  const groupUuid = param.groupUuid
  const limit = param.limit ?? 10
  const offset = param.offset ?? 0

  const { results } = await param.db
    .prepare(
      `
SELECT 
  e.expense_id,
  e.amount,
  e.description,
  e.created_at,
  gm.member_id AS paid_by_member_id,
  gm.member_name AS paid_by_member_name,
  ep.member_id AS participant_member_id,
  gm2.member_name AS participant_member_name
FROM Expenses AS e
JOIN Groups AS g ON e.group_id = g.group_id
JOIN GroupMembers AS gm ON e.paid_by_member_id = gm.member_id
LEFT JOIN ExpenseParticipants AS ep ON e.expense_id = ep.expense_id
LEFT JOIN GroupMembers AS gm2 ON ep.member_id = gm2.member_id
WHERE g.group_uuid = ?
ORDER BY e.created_at DESC
LIMIT ? OFFSET ?;
`
    )
    .bind(groupUuid, limit, offset)
    .all()

  return results.map((r) => {
    return {
      expense_id: r.expense_id as number,
      amount: r.amount as number,
      description: r.description as string,
      created_at: r.created_at as string,
      paid_by_member_id: r.paid_by_member_id as number,
      paid_by_member_name: r.paid_by_member_name as string,
      participant_member_id: r.participant_member_id as number,
      participant_member_name: r.participant_member_name as string,
    }
  })
}
