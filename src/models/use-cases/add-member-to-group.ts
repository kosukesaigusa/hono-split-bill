import { Member } from '../../schema'
import { uuid } from '../../utils/uuid'
import { IMemberRepository } from '../repositories/member'

export interface IAddMemberToGroupUseCase {
  invoke(param: { groupUuid: string; name: string }): Promise<Member>
}

export class AddMemberToGroupUseCase implements IAddMemberToGroupUseCase {
  constructor(private readonly memberRepository: IMemberRepository) {}

  async invoke(param: { groupUuid: string; name: string }): Promise<Member> {
    const { groupUuid, name } = param
    const memberUuid = uuid()
    const rawMember = await this.memberRepository.addMember({
      groupUuid,
      memberUuid,
      name,
    })

    return {
      memberUuid: rawMember.memberUuid,
      memberName: rawMember.memberName,
    }
  }
}
