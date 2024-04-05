import { Group } from '../../schema'
import { queryGroup } from '../repositories/group'

type Param = {
  db: D1Database
  groupUuid: string
}

export const fetchGroup = async (param: Param): Promise<Group | undefined> => {
  const group = await queryGroup({
    db: param.db,
    groupUuid: param.groupUuid,
  })

  if (!group) return undefined

  return {
    group_id: group.group_id,
    group_uuid: group.group_uuid,
    group_name: group.group_name,
  }
}
