import { IGroupRepository } from '../models/repositories/group'
import { IGroupExpenseRepository } from '../models/repositories/group-expense'
import { IGroupMemberRepository } from '../models/repositories/group-member'
import { IAddMemberToGroupUseCase } from '../models/use-cases/add-member-to-group'
import { ICreateGroupUseCase } from '../models/use-cases/create-group'
import { IFetchGroupUseCase } from '../models/use-cases/fetch-group'
import { IFetchGroupExpensesUseCase } from '../models/use-cases/fetch-group-expenses'
import { IFetchGroupMembersUseCase } from '../models/use-cases/fetch-group-members'
import { DIContainer } from './di-container'

type DependencyTypes = {
  // Database client
  db: D1Database

  // Repositories
  GroupExpenseRepository: IGroupExpenseRepository
  GroupMemberRepository: IGroupMemberRepository
  GroupRepository: IGroupRepository

  // Use cases
  AddMemberToGroupUseCase: IAddMemberToGroupUseCase
  CreateGroupUseCase: ICreateGroupUseCase
  FetchGroupExpensesUseCase: IFetchGroupExpensesUseCase
  FetchGroupMembersUseCase: IFetchGroupMembersUseCase
  FetchGroupUseCase: IFetchGroupUseCase
}

const diContainer = new DIContainer<DependencyTypes>()

export { DependencyTypes, diContainer }
