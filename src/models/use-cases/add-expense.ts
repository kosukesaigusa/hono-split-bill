import { CreatedExpense } from '../../schema'
import { areArraysEqual } from '../../utils/array'
import { uuid } from '../../utils/uuid'
import { IGroupExpenseRepository } from '../repositories/group-expense'

type AddExpenseUseCaseResult =
  | {
      expense: CreatedExpense
      error?: undefined
    }
  | {
      expense?: undefined
      error: AddExpenseUseCaseError
    }

type AddExpenseUseCaseError = { message: string }

export interface IAddExpenseUseCase {
  invoke(param: {
    groupUuid: string
    paidByMemberUuid: string
    description: string
    amount: number
    participantMemberUuids: string[]
  }): Promise<AddExpenseUseCaseResult>
}

export class AddExpenseUseCase implements IAddExpenseUseCase {
  constructor(
    private readonly groupMemberRepository: IGroupExpenseRepository
  ) {}

  async invoke(param: {
    groupUuid: string
    paidByMemberUuid: string
    description: string
    amount: number
    participantMemberUuids: string[]
  }): Promise<AddExpenseUseCaseResult> {
    const expenseUuid = uuid()
    const {
      groupUuid,
      paidByMemberUuid,
      description,
      amount,
      participantMemberUuids,
    } = param

    if (areArraysEqual(participantMemberUuids, [paidByMemberUuid])) {
      return {
        error: {
          message:
            'Expenses with no participants other than the payer cannot be recorded.',
        },
      }
    }

    const rawExpense = await this.groupMemberRepository.addGroupExpense({
      expenseUuid,
      groupUuid,
      paidByMemberUuid,
      description,
      amount,
      participantMemberUuids,
    })

    return {
      expense: {
        expenseUuid: rawExpense.expenseUuid,
        amount: rawExpense.amount,
        description: rawExpense.description,
        createdAt: rawExpense.createdAt,
        paidByMemberUuid: rawExpense.paidByMemberUuid,
      },
    }
  }
}
