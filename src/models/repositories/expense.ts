export type RawExpense = {
  expenseUuid: string
  amount: number
  description: string
  createdAt: string
  paidByMemberUuid: string
  paidByMemberName: string
  participantMemberUuid: string
  participantMemberName: string
}

export type RawCreatedExpense = {
  expenseUuid: string
  amount: number
  description: string
  createdAt: string
  paidByMemberUuid: string
}

export interface IExpenseRepository {
  fetchExpenses(param: {
    groupUuid: string
    limit: number
    offset: number
  }): Promise<RawExpense[]>

  addExpenseToGroup(param: {
    expenseUuid: string
    groupUuid: string
    paidByMemberUuid: string
    description: string
    amount: number
    participantMemberUuids: string[]
  }): Promise<RawCreatedExpense>
}

export class ExpenseRepository implements IExpenseRepository {
  constructor(private readonly db: D1Database) {}

  async fetchExpenses(param: {
    groupUuid: string
    limit: number
    offset: number
  }): Promise<RawExpense[]> {
    const { groupUuid, limit, offset } = param

    const { results } = await this.db
      .prepare(
        `
SELECT
  e.expense_uuid,
  e.amount,
  e.description,
  e.created_at,
  m.member_uuid AS paid_by_member_uuid,
  m.member_name AS paid_by_member_name,
  ep.member_uuid AS participant_member_uuid,
  gpm.member_name AS participant_member_name
FROM Expenses AS e
  JOIN Groups AS g ON e.group_id = g.group_id
  JOIN Members AS m ON e.paid_by_member_uuid = m.member_uuid
  LEFT JOIN ExpenseParticipants AS ep ON e.expense_uuid = ep.expense_uuid
  LEFT JOIN Members AS gpm ON ep.member_uuid = gpm.member_uuid
WHERE g.group_uuid = ?
ORDER BY e.created_at DESC, ep.member_uuid
LIMIT ? OFFSET ?;
`
      )
      .bind(groupUuid, limit, offset)
      .all()

    return results.map((r) => {
      return {
        expenseUuid: r.expense_uuid as string,
        amount: r.amount as number,
        description: r.description as string,
        createdAt: r.created_at as string,
        paidByMemberUuid: r.paid_by_member_uuid as string,
        paidByMemberName: r.paid_by_member_name as string,
        participantMemberUuid: r.participant_member_uuid as string,
        participantMemberName: r.participant_member_name as string,
      }
    })
  }

  async addExpenseToGroup(param: {
    expenseUuid: string
    groupUuid: string
    paidByMemberUuid: string
    description: string
    amount: number
    participantMemberUuids: string[]
  }): Promise<RawCreatedExpense> {
    const {
      expenseUuid,
      groupUuid,
      paidByMemberUuid,
      description,
      amount,
      participantMemberUuids,
    } = param

    const statements = [
      this.db
        .prepare(
          `
INSERT INTO Expenses (expense_uuid, group_id, paid_by_member_uuid, description, amount)
VALUES (?, (SELECT group_id FROM Groups WHERE group_uuid = ?), ?, ?, ?);
`
        )
        .bind(expenseUuid, groupUuid, paidByMemberUuid, description, amount),
      ...participantMemberUuids.map((participantMemberUuid) =>
        this.db
          .prepare(
            `INSERT INTO ExpenseParticipants (expense_uuid, member_uuid) VALUES (?, ?);`
          )
          .bind(expenseUuid, participantMemberUuid)
      ),
    ]

    const results = await this.db.batch(statements)

    if (results.some((r) => r.error)) throw new Error('Failed to add expense')

    const createdExpense = await this.db
      .prepare(`'SELECT * FROM Expenses WHERE expense_uuid = ?;`)
      .bind(expenseUuid)
      .first()

    if (!createdExpense) throw new Error('Failed to fetch created expense')

    return {
      expenseUuid: createdExpense.expense_uuid as string,
      amount: createdExpense.amount as number,
      description: createdExpense.description as string,
      createdAt: createdExpense.created_at as string,
      paidByMemberUuid: createdExpense.paid_by_member_uuid as string,
    }
  }
}
