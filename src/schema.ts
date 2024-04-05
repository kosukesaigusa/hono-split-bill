export type Group = {
  group_id: number
  group_uuid: string
  group_name: string
}

export type Expense = {
  expense_id: number
  amount: number
  description: string
  created_at: string
  paid_by_member: Member
  participant_members: Member[]
}

export type Member = {
  member_id: number
  member_name: string
}
