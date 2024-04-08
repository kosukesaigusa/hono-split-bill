import { Member } from '../../schema'
import { IGroupMemberRepository } from '../repositories/group-member'

type Param = {
  groupUuid: string
  name: string
}

export interface IAddMemberToGroupUseCase {
  invoke(param: Param): Promise<Member>
}

export class AddMemberToGroupUseCase implements IAddMemberToGroupUseCase {
  constructor(private readonly groupMemberRepository: IGroupMemberRepository) {}

  async invoke(param: Param): Promise<Member> {
    return this.groupMemberRepository.addGroupMember(param)
  }
}
