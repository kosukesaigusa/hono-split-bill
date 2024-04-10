import { IGroupMemberRepository } from '../repositories/group-member'

export interface IRemoveMemberFromGroupUseCase {
  invoke(param: { memberUuid: string }): Promise<void>
}

export class RemoveMemberFromGroupUseCase
  implements IRemoveMemberFromGroupUseCase
{
  constructor(private readonly groupMemberRepository: IGroupMemberRepository) {}

  async invoke(param: { memberUuid: string }): Promise<void> {
    return this.groupMemberRepository.deleteGroupMember(param)
  }
}
