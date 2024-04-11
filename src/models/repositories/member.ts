import { IDbClient } from '../db-client'

export type RawMember = {
  memberUuid: string
  memberName: string
}

export interface IMemberRepository {
  fetchMembers(param: {
    groupUuid: string
    limit?: number
    offset?: number
  }): Promise<RawMember[]>

  addMember(param: {
    groupUuid: string
    memberUuid: string
    name: string
  }): Promise<RawMember>

  deleteMember(param: { memberUuid: string }): Promise<void>
}

export class MemberRepository implements IMemberRepository {
  constructor(private readonly dbClient: IDbClient) {}

  async fetchMembers(param: {
    groupUuid: string
    limit?: number
    offset?: number
  }): Promise<RawMember[]> {
    const { groupUuid, limit = 10, offset = 0 } = param

    const { results } = await this.dbClient
      .prepare(
        `
SELECT m.member_uuid, m.member_name
FROM Members AS m
JOIN Groups AS g ON m.group_uuid = g.group_uuid
WHERE g.group_uuid = ?
LIMIT ? OFFSET ?;
`
      )
      .bind(groupUuid, limit, offset)
      .all()
    return results.map((r) => {
      return {
        memberUuid: r.member_uuid as string,
        memberName: r.member_name as string,
      }
    })
  }

  async addMember(param: {
    groupUuid: string
    memberUuid: string
    name: string
  }): Promise<RawMember> {
    const { groupUuid, memberUuid, name } = param

    await this.dbClient
      .prepare(
        `
INSERT INTO Members (group_uuid, member_uuid, member_name)
VALUES (?, ?, ?);
`
      )
      .bind(groupUuid, memberUuid, name)
      .run()

    const createdMember = await this.dbClient
      .prepare(`SELECT * FROM Members WHERE member_uuid = ?;`)
      .bind(memberUuid)
      .first()

    if (!createdMember) throw new Error('Failed to fetch created member')

    return {
      memberUuid: createdMember.member_uuid as string,
      memberName: createdMember.member_name as string,
    }
  }

  async deleteMember(param: { memberUuid: string }): Promise<void> {
    const { memberUuid } = param

    const result = await this.dbClient
      .prepare(`DELETE FROM Members WHERE member_uuid = ?;`)
      .bind(memberUuid)
      .run()

    if (!result.success) throw new Error('Failed to delete member')
  }
}
