export type RawGroup = {
  group_id: number
  group_uuid: string
  group_name: string
}

type CreateGroupParam = {
  name: string
  uuid: string
}

export interface IGroupRepository {
  fetchGroup(groupUuid: string): Promise<RawGroup | undefined>

  createGroup(param: CreateGroupParam): Promise<RawGroup>
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

  async createGroup(param: CreateGroupParam): Promise<RawGroup> {
    const result = await this.db
      .prepare('INSERT INTO Groups (group_uuid, group_name) VALUES (?, ?)')
      .bind(param.uuid, param.name)
      .run()

    if (!result.success) {
      throw new Error('Failed to create group')
    }

    const createdGroup = await this.db
      .prepare('SELECT * FROM Groups WHERE group_id = ?')
      .bind(result.meta.last_row_id)
      .first()

    if (!createdGroup) {
      throw new Error('Failed to fetch created group')
    }

    return {
      group_id: createdGroup.group_id as number,
      group_uuid: createdGroup.group_uuid as string,
      group_name: createdGroup.group_name as string,
    }
  }
}
