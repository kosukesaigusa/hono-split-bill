export type RawGroup = {
  group_id: number
  group_uuid: string
  group_name: string
}

export interface IGroupRepository {
  fetchGroup(groupUuid: string): Promise<RawGroup | undefined>
}

export class GroupRepository implements IGroupRepository {
  constructor(private readonly db: D1Database) {}

  async fetchGroup(groupUuid: string): Promise<RawGroup | undefined> {
    const result = await this.db
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
}
