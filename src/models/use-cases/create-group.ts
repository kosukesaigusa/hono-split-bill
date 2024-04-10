import { Group } from '../../schema'
import { uuid } from '../../utils/uuid'
import { IGroupRepository } from '../repositories/group'

export interface ICreateGroupUseCase {
  invoke(name: string): Promise<Group>
}

export class CreateGroupUseCase implements ICreateGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async invoke(name: string): Promise<Group> {
    const group = await this.groupRepository.createGroup({
      groupUuid: uuid(),
      name,
    })

    return {
      groupUuid: group.groupUuid,
      groupName: group.groupName,
    }
  }
}
