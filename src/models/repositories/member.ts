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
  constructor(private readonly db: D1Database) {}

  async fetchMembers(param: {
    groupUuid: string
    limit?: number
    offset?: number
  }): Promise<RawMember[]> {
    const { groupUuid, limit = 10, offset = 0 } = param

    const { results } = await this.db
      .prepare(
        `
SELECT * FROM Members AS m
JOIN Groups AS g ON m.group_id = g.group_id
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

    const result = await this.db
      .prepare(
        `
INSERT INTO Members (group_id, member_uuid, member_name)
SELECT g.group_id, ?, ? FROM Groups AS g
WHERE g.group_uuid = ?;
`
      )
      .bind(memberUuid, name, groupUuid)
      .run()

    if (!result.success) throw new Error('Failed to add member')

    const createdMember = await this.db
      .prepare(`SELECT * FROM Members WHERE member_id = ?;`)
      .bind(result.meta.last_row_id)
      .first()

    if (!createdMember) throw new Error('Failed to fetch created member')

    return {
      memberUuid: createdMember.member_uuid as string,
      memberName: createdMember.member_name as string,
    }
  }

  async deleteMember(param: { memberUuid: string }): Promise<void> {
    const { memberUuid } = param

    const result = await this.db
      .prepare(`DELETE FROM Members WHERE member_uuid = ?;`)
      .bind(memberUuid)
      .run()

    if (!result.success) throw new Error('Failed to delete member')
  }
}
