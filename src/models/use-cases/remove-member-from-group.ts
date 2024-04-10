import { IMemberRepository } from '../repositories/member'

export interface IRemoveMemberFromGroupUseCase {
  invoke(param: { memberUuid: string }): Promise<void>
}

export class RemoveMemberFromGroupUseCase
  implements IRemoveMemberFromGroupUseCase
{
  constructor(private readonly memberRepository: IMemberRepository) {}

  async invoke(param: { memberUuid: string }): Promise<void> {
    return this.memberRepository.deleteMember(param)
  }
}
