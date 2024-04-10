export type RawMember = {
  member_uuid: string
  member_name: string
}

export interface IGroupMemberRepository {
  fetchGroupMembers(param: {
    groupUuid: string
    limit?: number
    offset?: number
  }): Promise<RawMember[]>

  addGroupMember(param: {
    groupUuid: string
    memberUuid: string
    name: string
  }): Promise<RawMember>

  deleteGroupMember(param: { memberUuid: string }): Promise<void>
}

export class GroupMemberRepository implements IGroupMemberRepository {
  constructor(private readonly db: D1Database) {}

  async fetchGroupMembers(param: {
    groupUuid: string
    limit?: number
    offset?: number
  }): Promise<RawMember[]> {
    const { groupUuid, limit = 10, offset = 0 } = param

    const { results } = await this.db
      .prepare(
        `
SELECT * FROM GroupMembers AS gm
JOIN Groups AS g ON gm.group_id = g.group_id
WHERE g.group_uuid = ?
LIMIT ? OFFSET ?;
`
      )
      .bind(groupUuid, limit, offset)
      .all()
    return results.map((r) => {
      return {
        member_uuid: r.member_uuid as string,
        member_name: r.member_name as string,
      }
    })
  }

  async addGroupMember(param: {
    groupUuid: string
    memberUuid: string
    name: string
  }): Promise<RawMember> {
    const { groupUuid, memberUuid, name } = param

    const result = await this.db
      .prepare(
        `
INSERT INTO GroupMembers (group_id, member_uuid, member_name)
SELECT g.group_id, ?, ? FROM Groups AS g
WHERE g.group_uuid = ?;
`
      )
      .bind(memberUuid, name, groupUuid)
      .run()

    if (!result.success) throw new Error('Failed to add member')

    const createdMember = await this.db
      .prepare(`SELECT * FROM GroupMembers WHERE member_id = ?;`)
      .bind(result.meta.last_row_id)
      .first()

    if (!createdMember) throw new Error('Failed to fetch created member')

    return {
      member_uuid: createdMember.member_uuid as string,
      member_name: createdMember.member_name as string,
    }
  }

  async deleteGroupMember(param: { memberUuid: string }): Promise<void> {
    const { memberUuid } = param

    const result = await this.db
      .prepare(`DELETE FROM GroupMembers WHERE member_uuid = ?;`)
      .bind(memberUuid)
      .run()

    if (!result.success) throw new Error('Failed to delete member')
  }
}
