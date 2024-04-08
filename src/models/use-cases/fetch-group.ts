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
      group_id: group.group_id,
      group_uuid: group.group_uuid,
      group_name: group.group_name,
    }
  }
}
