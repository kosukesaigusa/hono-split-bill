type Param = {
  db: D1Database
  groupUuid: string
  limit?: number
  offset?: number
}

export type RawMember = {
  member_id: number
  member_name: string
}

export const queryGroupMembers = async (param: Param): Promise<RawMember[]> => {
  const groupUuid = param.groupUuid
  const limit = param.limit ?? 10
  const offset = param.offset ?? 0

  const { results } = await param.db
    .prepare(
      `
SELECT * FROM GroupMembers AS gm
JOIN Groups AS g ON gm.group_id = g.group_id
WHERE g.group_uuid = ?
`
    )
    .bind(groupUuid)
    .all()
  return results.map((r) => {
    return {
      member_id: r.member_id as number,
      member_name: r.member_name as string,
    }
  })
}
