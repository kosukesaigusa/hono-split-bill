export type RawMember = {
  member_id: number
  member_name: string
}

export interface IGroupMemberRepository {
  fetchGroupMembers(param: {
    groupUuid: string
    limit?: number
    offset?: number
  }): Promise<RawMember[]>

  addGroupMember(param: { groupUuid: string; name: string }): Promise<RawMember>

  deleteGroupMember(param: {
    groupUuid: string
    memberId: number
  }): Promise<void>
}

export class GroupMemberRepository implements IGroupMemberRepository {
  constructor(private readonly db: D1Database) {}

  async fetchGroupMembers(param: {
    groupUuid: string
    limit?: number
    offset?: number
  }): Promise<RawMember[]> {
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

  async addGroupMember(param: {
    groupUuid: string
    name: string
  }): Promise<RawMember> {
    const groupUuid = param.groupUuid
    const name = param.name

    const result = await this.db
      .prepare(
        `
INSERT INTO GroupMembers (group_id, member_name)
SELECT g.group_id, ? FROM Groups AS g
WHERE g.group_uuid = ?
  AND NOT EXISTS (
    SELECT 1
    FROM GroupMembers AS gm
    WHERE gm.group_id = g.group_id
    AND gm.member_name = ?
  );
`
      )
      .bind(name, groupUuid, name)
      .run()

    if (!result.success) {
      throw new Error('Failed to add member')
    }

    if (!result.meta.changed_db) {
      throw new Error('Failed to add member')
    }

    const createdMember = await this.db
      .prepare(`SELECT * FROM GroupMembers WHERE member_id = ?;`)
      .bind(result.meta.last_row_id)
      .first()

    if (!createdMember) {
      throw new Error('Failed to fetch created member')
    }

    return {
      member_id: createdMember.member_id as number,
      member_name: createdMember.member_name as string,
    }
  }

  async deleteGroupMember(param: {
    groupUuid: string
    memberId: number
  }): Promise<void> {
    const groupUuid = param.groupUuid
    const memberId = param.memberId

    const result = await this.db
      .prepare(
        `
DELETE FROM GroupMembers
WHERE member_id = ?
AND group_id = (
  SELECT g.group_id FROM Groups AS g
  WHERE g.group_uuid = ?
);
`
      )
      .bind(memberId, groupUuid)
      .run()

    if (!result.success) {
      throw new Error('Failed to delete member')
    }

    if (!result.meta.changed_db) {
      throw new Error('Failed to delete member')
    }
  }
}
