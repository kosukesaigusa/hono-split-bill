import { Group } from '../../schema'
import { IGroupRepository } from '../repositories/group'

export interface ICreateGroupUseCase {
  invoke(name: string): Promise<Group>
}

export class CreateGroupUseCase implements ICreateGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async invoke(name: string): Promise<Group> {
    const group = await this.groupRepository.createGroup({
      name,
      uuid: crypto.randomUUID(),
    })

    return {
      group_id: group.group_id,
      group_uuid: group.group_uuid,
      group_name: group.group_name,
    }
  }
}
