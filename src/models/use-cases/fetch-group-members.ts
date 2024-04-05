import { Member } from '../../schema'
import { queryGroupMembers } from '../repositories/group-members'

type Param = {
  db: D1Database
  groupUuid: string
}

export const fetchGroupMembers = async (param: Param): Promise<Member[]> => {
  const rawMembers = await queryGroupMembers({
    db: param.db,
    groupUuid: param.groupUuid,
  })

  return rawMembers.map((r) => {
    return {
      member_id: r.member_id,
      member_name: r.member_name,
    }
  })
}
