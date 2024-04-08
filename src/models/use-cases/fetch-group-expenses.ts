import { Expense } from '../../schema'
import {
  IGroupExpenseRepository,
  RawExpense,
} from '../repositories/group-expense'

type Param = {
  groupUuid: string
  limit: number
  offset: number
}

export interface IFetchGroupExpensesUseCase {
  invoke(param: Param): Promise<Expense[]>
}

export class FetchGroupExpensesUseCase implements IFetchGroupExpensesUseCase {
  constructor(
    private readonly groupExpensesRepository: IGroupExpenseRepository
  ) {}

  async invoke(param: Param): Promise<Expense[]> {
    const rawExpenses = await this.groupExpensesRepository.fetchGroupExpenses(
      param
    )
    return this.transformExpense(rawExpenses)
  }

  private transformExpense(rawExpenses: RawExpense[]): Expense[] {
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
}
