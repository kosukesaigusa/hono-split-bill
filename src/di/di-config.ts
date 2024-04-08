import { IGroupRepository } from '../models/repositories/group'
import { IGroupExpensesRepository } from '../models/repositories/group-expenses'
import { IGroupMembersRepository } from '../models/repositories/group-members'
import { ICreateGroupUseCase } from '../models/use-cases/create-group'
import { IFetchGroupUseCase } from '../models/use-cases/fetch-group'
import { IFetchGroupExpensesUseCase } from '../models/use-cases/fetch-group-expenses'
import { IFetchGroupMembersUseCase } from '../models/use-cases/fetch-group-members'
import { DIContainer } from './di-container'

type DependencyTypes = {
  // Database client
  db: D1Database

  // Repositories
  GroupExpensesRepository: IGroupExpensesRepository
  GroupMembersRepository: IGroupMembersRepository
  GroupRepository: IGroupRepository

  // Use cases
  CreateGroupUseCase: ICreateGroupUseCase
  FetchGroupExpensesUseCase: IFetchGroupExpensesUseCase
  FetchGroupMembersUseCase: IFetchGroupMembersUseCase
  FetchGroupUseCase: IFetchGroupUseCase
}

const diContainer = new DIContainer<DependencyTypes>()

export { DependencyTypes, diContainer }
