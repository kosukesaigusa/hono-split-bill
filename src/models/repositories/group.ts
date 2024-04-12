import { IDbClient } from '../db-client/db-client'

export type RawGroup = {
  groupUuid: string
  groupName: string
}

export interface IGroupRepository {
  fetchGroup(groupUuid: string): Promise<RawGroup | undefined>

  createGroup(param: { groupUuid: string; name: string }): Promise<RawGroup>
}

export class GroupRepository implements IGroupRepository {
  constructor(private readonly dbClient: IDbClient) {}

  async fetchGroup(groupUuid: string): Promise<RawGroup | undefined> {
    const result = await this.dbClient
      .prepare('SELECT * FROM Groups WHERE group_uuid = ?')
      .bind(groupUuid)
      .first()

    if (!result) return undefined

    return {
      groupUuid: result.group_uuid as string,
      groupName: result.group_name as string,
    }
  }

  async createGroup(param: {
    groupUuid: string
    name: string
  }): Promise<RawGroup> {
    const { groupUuid, name } = param

    await this.dbClient
      .prepare('INSERT INTO Groups (group_uuid, group_name) VALUES (?, ?)')
      .bind(groupUuid, name)
      .run()

    const createdGroup = await this.dbClient
      .prepare('SELECT * FROM Groups WHERE group_uuid = ?')
      .bind(groupUuid)
      .first()

    if (!createdGroup) throw new Error('Failed to fetch created group')

    return {
      groupUuid: createdGroup.group_uuid as string,
      groupName: createdGroup.group_name as string,
    }
  }
}
