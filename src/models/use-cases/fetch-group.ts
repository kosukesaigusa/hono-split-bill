import { Group } from '../../schema'
import { IGroupRepository } from '../repositories/group'

export interface IFetchGroupUseCase {
  invoke(groupUuid: string): Promise<Group | undefined>
}

export class FetchGroupUseCase implements IFetchGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async invoke(groupUuid: string): Promise<Group | undefined> {
    const group = await this.groupRepository.fetchGroup(groupUuid)

    if (!group) return undefined

    return {
      groupUuid: group.groupUuid,
      groupName: group.groupName,
    }
  }
}
