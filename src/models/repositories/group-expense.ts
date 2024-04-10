export type RawExpense = {
  expense_id: number
  amount: number
  description: string
  created_at: string
  paid_by_member_uuid: string
  paid_by_member_name: string
  participant_member_uuid: string
  participant_member_name: string
}

export interface IGroupExpenseRepository {
  fetchGroupExpenses(param: {
    groupUuid: string
    limit: number
    offset: number
  }): Promise<RawExpense[]>

  addExpense(param: {
    groupUuid: string
    amount: number
    description: string
    paidByMemberId: number
    participantMemberIds: number[]
  }): Promise<RawExpense>
}

export class GroupExpenseRepository implements IGroupExpenseRepository {
  constructor(private readonly db: D1Database) {}

  async fetchGroupExpenses(param: {
    groupUuid: string
    limit: number
    offset: number
  }): Promise<RawExpense[]> {
    const { groupUuid, limit, offset } = param

    const { results } = await this.db
      .prepare(
        `
SELECT
  e.expense_id,
  e.amount,
  e.description,
  e.created_at,
  gm.member_uuid AS paid_by_member_uuid,
  gm.member_name AS paid_by_member_name,
  ep.member_uuid AS participant_member_uuid,
  gpm.member_name AS participant_member_name
FROM Expenses AS e
  JOIN Groups AS g ON e.group_id = g.group_id
  JOIN GroupMembers AS gm ON e.paid_by_member_uuid = gm.member_uuid
  LEFT JOIN ExpenseParticipants AS ep ON e.expense_uuid = ep.expense_uuid
  LEFT JOIN GroupMembers AS gpm ON ep.member_uuid = gpm.member_uuid
WHERE g.group_uuid = ?
ORDER BY e.created_at DESC, ep.member_uuid
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
        paid_by_member_uuid: r.paid_by_member_uuid as string,
        paid_by_member_name: r.paid_by_member_name as string,
        participant_member_uuid: r.participant_member_uuid as string,
        participant_member_name: r.participant_member_name as string,
      }
    })
  }

  async addExpense(param: {
    groupUuid: string
    amount: number
    description: string
    paidByMemberId: number
    participantMemberIds: number[]
  }): Promise<RawExpense> {
    const {
      groupUuid,
      amount,
      description,
      paidByMemberId,
      participantMemberIds,
    } = param

    throw new Error('Not implemented')
  }
}
