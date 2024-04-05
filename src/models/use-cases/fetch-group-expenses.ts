import { Expense } from '../../schema'
import { RawExpense, queryGroupExpenses } from '../repositories/group-expenses'

type Param = {
  db: D1Database
  groupUuid: string
  limit: number
  offset: number
}

export const fetchGroupExpenses = async (param: Param): Promise<Expense[]> => {
  const rawExpenses = await queryGroupExpenses(param)
  return transformExpense(rawExpenses)
}

const transformExpense = (rawExpenses: RawExpense[]): Expense[] => {
  return rawExpenses.reduce((acc: Expense[], curr) => {
    let expense = acc.find((exp) => exp.expense_id === curr.expense_id)
    if (!expense) {
      expense = {
        expense_id: curr.expense_id,
        amount: curr.amount,
        description: curr.description,
        created_at: curr.created_at,
        paid_by_member: {
          member_id: curr.paid_by_member_id,
          member_name: curr.paid_by_member_name,
        },
        participant_members: [],
      }
      acc.push(expense)
    }
    if (curr.participant_member_id) {
      expense.participant_members.push({
        member_id: curr.participant_member_id,
        member_name: curr.participant_member_name,
      })
    }
    return acc
  }, [])
}
