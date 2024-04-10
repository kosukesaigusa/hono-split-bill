export type Group = {
  groupUuid: string
  groupName: string
}

export type Expense = {
  expenseUuid: string
  amount: number
  description: string
  createdAt: string
  paidByMember: Member
  participantMembers: Member[]
}

export type CreatedExpense = {
  expenseUuid: string
  amount: number
  description: string
  createdAt: string
  paidByMemberUuid: string
}

export type Member = {
  memberUuid: string
  memberName: string
}
