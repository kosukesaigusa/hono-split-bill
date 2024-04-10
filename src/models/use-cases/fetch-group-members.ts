import { Member } from '../../schema'
import { IMemberRepository } from '../repositories/member'

export interface IFetchGroupMembersUseCase {
  invoke(param: {
    groupUuid: string
    limit: number
    offset: number
  }): Promise<Member[] | undefined>
}

export class FetchGroupMembersUseCase implements IFetchGroupMembersUseCase {
  constructor(private readonly memberRepository: IMemberRepository) {}

  async invoke(param: {
    groupUuid: string
    limit: number
    offset: number
  }): Promise<Member[] | undefined> {
    const rawMembers = await this.memberRepository.fetchMembers(param)

    return rawMembers.map((r) => {
      return {
        memberUuid: r.memberUuid,
        memberName: r.memberName,
      }
    })
  }
}
