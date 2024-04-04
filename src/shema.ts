interface Group {
  group_id: number
  name: string
  members: Member[]
}

interface Expense {
  expense_id: number
  group_id: number
  description: string
  paid_by_member: Member
  participant_members: Member[]
  amount: number
  date: string
}

interface Member {
  member_id: number
  member_name: string
}
