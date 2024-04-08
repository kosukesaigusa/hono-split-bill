import { Member } from '../../schema'
import { IGroupMembersRepository } from '../repositories/group-members'

type Param = {
  groupUuid: string
  limit: number
  offset: number
}

export interface IFetchGroupMembersUseCase {
  invoke(param: Param): Promise<Member[] | undefined>
}

export class FetchGroupMembersUseCase implements IFetchGroupMembersUseCase {
  constructor(
    private readonly groupMemberRepository: IGroupMembersRepository
  ) {}

  async invoke(param: Param): Promise<Member[] | undefined> {
    const rawMembers = await this.groupMemberRepository.fetchGroupMembers(param)

    return rawMembers.map((r) => {
      return {
        member_id: r.member_id,
        member_name: r.member_name,
      }
    })
  }
}
