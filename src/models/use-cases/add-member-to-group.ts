import { Member } from '../../schema'
import { IGroupMemberRepository } from '../repositories/group-member'

export interface IAddMemberToGroupUseCase {
  invoke(param: { groupUuid: string; name: string }): Promise<Member>
}

export class AddMemberToGroupUseCase implements IAddMemberToGroupUseCase {
  constructor(private readonly groupMemberRepository: IGroupMemberRepository) {}

  async invoke(param: { groupUuid: string; name: string }): Promise<Member> {
    return this.groupMemberRepository.addGroupMember(param)
  }
}
