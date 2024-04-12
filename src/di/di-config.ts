import { IDbClient } from '../models/db-client/db-client'
import { IExpenseRepository } from '../models/repositories/expense'
import { IGroupRepository } from '../models/repositories/group'
import { IMemberRepository } from '../models/repositories/member'
import { IAddExpenseToGroupUseCase } from '../models/use-cases/add-expense-to-group'
import { IAddMemberToGroupUseCase } from '../models/use-cases/add-member-to-group'
import { ICreateGroupUseCase } from '../models/use-cases/create-group'
import { IFetchGroupUseCase } from '../models/use-cases/fetch-group'
import { IFetchGroupExpensesUseCase } from '../models/use-cases/fetch-group-expenses'
import { IFetchGroupMembersUseCase } from '../models/use-cases/fetch-group-members'
import { IRemoveMemberFromGroupUseCase } from '../models/use-cases/remove-member-from-group'
import { DIContainer } from './di-container'

type DependencyTypes = {
  // Database client
  dbClient: IDbClient

  // Repositories
  ExpenseRepository: IExpenseRepository
  GroupRepository: IGroupRepository
  MemberRepository: IMemberRepository

  // Use cases
  AddExpenseToGroupUseCase: IAddExpenseToGroupUseCase
  AddMemberToGroupUseCase: IAddMemberToGroupUseCase
  CreateGroupUseCase: ICreateGroupUseCase
  FetchGroupExpensesUseCase: IFetchGroupExpensesUseCase
  FetchGroupMembersUseCase: IFetchGroupMembersUseCase
  FetchGroupUseCase: IFetchGroupUseCase
  RemoveMemberFromGroupUseCase: IRemoveMemberFromGroupUseCase
}

const diContainer = new DIContainer<DependencyTypes>()

export { DependencyTypes, diContainer }
