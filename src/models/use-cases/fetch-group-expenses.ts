import { Expense } from '../../schema'
import { IExpenseRepository, RawExpense } from '../repositories/expense'

export interface IFetchGroupExpensesUseCase {
  invoke(param: {
    groupUuid: string
    limit: number
    offset: number
  }): Promise<Expense[]>
}

export class FetchGroupExpensesUseCase implements IFetchGroupExpensesUseCase {
  constructor(private readonly groupExpensesRepository: IExpenseRepository) {}

  async invoke(param: {
    groupUuid: string
    limit: number
    offset: number
  }): Promise<Expense[]> {
    const rawExpenses = await this.groupExpensesRepository.fetchExpenses(param)
    return this.transformExpense(rawExpenses)
  }

  private transformExpense(rawExpenses: RawExpense[]): Expense[] {
    return rawExpenses.reduce((acc: Expense[], curr) => {
      let expense = acc.find((exp) => exp.expenseUuid === curr.expenseUuid)
      if (!expense) {
        expense = {
          expenseUuid: curr.expenseUuid,
          amount: curr.amount,
          description: curr.description,
          createdAt: curr.createdAt,
          paidByMember: {
            memberUuid: curr.paidByMemberUuid,
            memberName: curr.paidByMemberName,
          },
          participantMembers: [],
        }
        acc.push(expense)
      }
      if (curr.participantMemberUuid) {
        expense.participantMembers.push({
          memberUuid: curr.participantMemberUuid,
          memberName: curr.participantMemberName,
        })
      }
      return acc
    }, [])
  }
}
