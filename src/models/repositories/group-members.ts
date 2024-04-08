type Param = {
  groupUuid: string
  limit?: number
  offset?: number
}

export type RawMember = {
  member_id: number
  member_name: string
}

export interface IGroupMembersRepository {
  fetchGroupMembers(param: Param): Promise<RawMember[]>
}

export class GroupMembersRepository implements IGroupMembersRepository {
  constructor(private readonly db: D1Database) {}

  async fetchGroupMembers(param: Param): Promise<RawMember[]> {
    const groupUuid = param.groupUuid
    const limit = param.limit ?? 10
    const offset = param.offset ?? 0

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
        member_id: r.member_id as number,
        member_name: r.member_name as string,
      }
    })
  }
}
