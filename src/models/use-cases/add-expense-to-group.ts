import { CreatedExpense } from '../../schema'
import { areArraysEqual } from '../../utils/array'
import { uuid } from '../../utils/uuid'
import { IExpenseRepository } from '../repositories/expense'

type AddExpenseToGroupUseCaseResult =
  | {
      expense: CreatedExpense
      error?: undefined
    }
  | {
      expense?: undefined
      error: AddExpenseToGroupUseCaseError
    }

type AddExpenseToGroupUseCaseError = { message: string }

export interface IAddExpenseToGroupUseCase {
  invoke(param: {
    groupUuid: string
    paidByMemberUuid: string
    description: string
    amount: number
    participantMemberUuids: string[]
  }): Promise<AddExpenseToGroupUseCaseResult>
}

export class AddExpenseToGroupUseCase implements IAddExpenseToGroupUseCase {
  constructor(private readonly memberRepository: IExpenseRepository) {}

  async invoke(param: {
    groupUuid: string
    paidByMemberUuid: string
    description: string
    amount: number
    participantMemberUuids: string[]
  }): Promise<AddExpenseToGroupUseCaseResult> {
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

    const rawExpense = await this.memberRepository.addExpenseToGroup({
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
