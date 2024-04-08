import { Member } from '../../schema'
import { IGroupMemberRepository } from '../repositories/group-member'

export interface IFetchGroupMembersUseCase {
  invoke(param: {
    groupUuid: string
    limit: number
    offset: number
  }): Promise<Member[] | undefined>
}

export class FetchGroupMembersUseCase implements IFetchGroupMembersUseCase {
  constructor(private readonly groupMemberRepository: IGroupMemberRepository) {}

  async invoke(param: {
    groupUuid: string
    limit: number
    offset: number
  }): Promise<Member[] | undefined> {
    const rawMembers = await this.groupMemberRepository.fetchGroupMembers(param)

    return rawMembers.map((r) => {
      return {
        member_id: r.member_id,
        member_name: r.member_name,
      }
    })
  }
}
