import { IGroupMemberRepository } from '../repositories/group-member'

export interface IRemoveMemberFromGroupUseCase {
  invoke(param: { groupUuid: string; memberId: number }): Promise<void>
}

export class RemoveMemberFromGroupUseCase
  implements IRemoveMemberFromGroupUseCase
{
  constructor(private readonly groupMemberRepository: IGroupMemberRepository) {}

  async invoke(param: { groupUuid: string; memberId: number }): Promise<void> {
    return this.groupMemberRepository.deleteGroupMember({
      groupUuid: param.groupUuid,
      memberId: param.memberId,
    })
  }
}
