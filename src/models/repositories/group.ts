type Param = {
  db: D1Database
  groupUuid: string
}

export type RawGroup = {
  group_id: number
  group_uuid: string
  group_name: string
}

export const queryGroup = async (
  param: Param
): Promise<RawGroup | undefined> => {
  const groupUuid = param.groupUuid

  const result = await param.db
    .prepare('SELECT * FROM Groups WHERE group_uuid = ?')
    .bind(groupUuid)
    .first()

  if (!result) return undefined

  return {
    group_id: result.group_id as number,
    group_uuid: result.group_uuid as string,
    group_name: result.group_name as string,
  }
}
