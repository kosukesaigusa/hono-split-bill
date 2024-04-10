export type RawGroup = {
  group_uuid: string
  group_name: string
}

export interface IGroupRepository {
  fetchGroup(groupUuid: string): Promise<RawGroup | undefined>

  createGroup(param: { groupUuid: string; name: string }): Promise<RawGroup>
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
      group_uuid: result.group_uuid as string,
      group_name: result.group_name as string,
    }
  }

  async createGroup(param: {
    groupUuid: string
    name: string
  }): Promise<RawGroup> {
    const { groupUuid, name } = param

    const result = await this.db
      .prepare('INSERT INTO Groups (group_uuid, group_name) VALUES (?, ?)')
      .bind(groupUuid, name)
      .run()

    if (!result.success) throw new Error('Failed to create group')

    const createdGroup = await this.db
      .prepare('SELECT * FROM Groups WHERE group_id = ?')
      .bind(result.meta.last_row_id)
      .first()

    if (!createdGroup) throw new Error('Failed to fetch created group')

    return {
      group_uuid: createdGroup.group_uuid as string,
      group_name: createdGroup.group_name as string,
    }
  }
}
