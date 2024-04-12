import { Member } from '../../schema'
import { uuid } from '../../utils/uuid'
import { DbClientError } from '../db-client/db-client'
import { IMemberRepository } from '../repositories/member'
import { UseCaseResult } from './use-case-result'

export interface IAddMemberToGroupUseCase {
  invoke(param: {
    groupUuid: string
    name: string
  }): Promise<UseCaseResult<Member>>
}

export class AddMemberToGroupUseCase implements IAddMemberToGroupUseCase {
  constructor(private readonly memberRepository: IMemberRepository) {}

  async invoke(param: {
    groupUuid: string
    name: string
  }): Promise<UseCaseResult<Member>> {
    const { groupUuid, name } = param
    const memberUuid = uuid()

    try {
      const rawMember = await this.memberRepository.addMember({
        groupUuid,
        memberUuid,
        name,
      })
      return {
        data: {
          memberUuid: rawMember.memberUuid,
          memberName: rawMember.memberName,
        },
      }
    } catch (e: unknown) {
      if (e instanceof DbClientError) {
        if (e.errorType === 'UNIQUE_CONSTRAINT') {
          return {
            error: {
              message: 'The same name member already exists in the group.',
            },
          }
        }
      }
      return {
        error: {
          message: 'Failed to add member to group',
        },
      }
    }
  }
}
