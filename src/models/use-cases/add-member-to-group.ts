import { Member } from '../../schema'
import { uuid } from '../../utils'
import { IGroupMemberRepository } from '../repositories/group-member'

export interface IAddMemberToGroupUseCase {
  invoke(param: { groupUuid: string; name: string }): Promise<Member>
}

export class AddMemberToGroupUseCase implements IAddMemberToGroupUseCase {
  constructor(private readonly groupMemberRepository: IGroupMemberRepository) {}

  async invoke(param: { groupUuid: string; name: string }): Promise<Member> {
    const { groupUuid, name } = param
    const memberUuid = uuid()
    return this.groupMemberRepository.addGroupMember({
      groupUuid,
      memberUuid,
      name,
    })
  }
}
