import app from '../src'
import { diContainer } from '../src/di/di-config'
import {
  IExpenseRepository,
  RawExpense,
} from '../src/models/repositories/expense'
import { IGroupRepository, RawGroup } from '../src/models/repositories/group'
import { IMemberRepository, RawMember } from '../src/models/repositories/member'

const MOCK_ENV = {
  DB: {
    prepare: () => {
      /* mocked D1 */
    },
  },
}

describe('GET /', () => {
  test('should return status 200', async () => {
    const res = await app.request('/', {}, MOCK_ENV)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ message: 'Hello, World!' })
  })
})

describe('GET /api/groups/:groupUuid', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 404 if group query result is undefined', async () => {
    class MockUndefinedGroupRepository implements IGroupRepository {
      createGroup(): Promise<RawGroup> {
        throw new Error('Method not implemented.')
      }
      async fetchGroup() {
        return undefined
      }
    }

    diContainer.override('GroupRepository', new MockUndefinedGroupRepository())

    const res = await app.request(
      '/api/groups/test-group-uuid-1',
      {
        headers: { 'Content-Type': 'application/json' },
      },
      MOCK_ENV
    )
    expect(res.status).toBe(404)
  })

  test('should return status 200', async () => {
    class MockGroupRepository implements IGroupRepository {
      createGroup(): Promise<RawGroup> {
        throw new Error('Method not implemented.')
      }
      async fetchGroup() {
        return {
          groupUuid: 'test-group-uuid-1',
          groupName: 'Test Group 1',
        }
      }
    }

    diContainer.override('GroupRepository', new MockGroupRepository())

    const res = await app.request(
      '/api/groups/test-group-uuid-1',
      {
        headers: { 'Content-Type': 'application/json' },
      },
      MOCK_ENV
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      group: {
        groupUuid: 'test-group-uuid-1',
        groupName: 'Test Group 1',
      },
    })
  })
})

describe('POST /api/groups', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 400 if name is not set', async () => {
    const res = await app.request(
      '/api/groups',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if name is empty', async () => {
    const res = await app.request(
      '/api/groups',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '' }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if name is too long', async () => {
    const res = await app.request(
      '/api/groups',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'a'.repeat(256) }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 200', async () => {
    class MockGroupRepository implements IGroupRepository {
      async createGroup() {
        return {
          groupUuid: 'test-group-uuid-1',
          groupName: 'Test Group 1',
        }
      }
      async fetchGroup(): Promise<RawGroup> {
        throw new Error('Method not implemented.')
      }
    }

    diContainer.override('GroupRepository', new MockGroupRepository())

    const res = await app.request(
      '/api/groups',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Group 2' }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      group: {
        groupUuid: 'test-group-uuid-1',
        groupName: 'Test Group 1',
      },
    })
  })
})

describe('GET /api/groups/:groupUuid/members', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 200', async () => {
    class MockMembersRepository implements IMemberRepository {
      deleteMember(): Promise<void> {
        throw new Error('Method not implemented.')
      }
      addMember(): Promise<RawMember> {
        throw new Error('Method not implemented.')
      }
      async fetchMembers() {
        return [
          {
            memberUuid: 'test-member-uuid-1',
            memberName: 'Test Member 1',
          },
        ]
      }
    }

    diContainer.override('MemberRepository', new MockMembersRepository())

    const res = await app.request(
      '/api/groups/123e4567-e89b-12d3-a456-426614174000/members',
      {
        headers: { 'Content-Type': 'application/json' },
      },
      MOCK_ENV
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      members: [
        {
          memberUuid: 'test-member-uuid-1',
          memberName: 'Test Member 1',
        },
      ],
    })
  })
})

describe('POST /api/groups/:groupUuid/members', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 400 if name is not set', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/members',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if name is empty', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/members',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '' }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if name is too long', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/members',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'a'.repeat(256) }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 200', async () => {
    class MockMembersRepository implements IMemberRepository {
      deleteMember(): Promise<void> {
        throw new Error('Method not implemented.')
      }
      async addMember() {
        return {
          memberUuid: 'test-member-uuid-3',
          memberName: 'Test Member 3',
        }
      }

      async fetchMembers(): Promise<RawMember[]> {
        throw new Error('Method not implemented.')
      }
    }

    diContainer.override('MemberRepository', new MockMembersRepository())

    const res = await app.request(
      '/api/groups/test-group-uuid-1/members',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Member 3' }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      member: {
        memberUuid: 'test-member-uuid-3',
        memberName: 'Test Member 3',
      },
    })
  })
})

describe('DELETE /api/groups/:groupUuid/members/:memberId', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 200', async () => {
    class MockMembersRepository implements IMemberRepository {
      async deleteMember() {
        return
      }
      addMember(): Promise<RawMember> {
        throw new Error('Method not implemented.')
      }
      fetchMembers(): Promise<RawMember[]> {
        throw new Error('Method not implemented.')
      }
    }

    diContainer.override('MemberRepository', new MockMembersRepository())

    const res = await app.request(
      '/api/groups/test-group-uuid-1/members/1',
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
      MOCK_ENV
    )
    expect(res.status).toBe(200)
  })
})

describe('GET /api/groups/:groupUuid/expenses', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 200', async () => {
    class MockExpensesRepository implements IExpenseRepository {
      async fetchExpenses() {
        return [
          {
            expenseUuid: 'test-expense-uuid-1',
            amount: 100,
            description: 'Test Expense',
            createdAt: '2021-01-01T00:00:00Z',
            paidByMemberUuid: 'test-member-uuid-1',
            paidByMemberName: 'Test Member 1',
            participantMemberUuid: 'test-member-uuid-1',
            participantMemberName: 'Test Member 1',
          },
          {
            expenseUuid: 'test-expense-uuid-1',
            amount: 100,
            description: 'Test Expense',
            createdAt: '2021-01-01T00:00:00Z',
            paidByMemberUuid: 'test-member-uuid-1',
            paidByMemberName: 'Test Member 1',
            participantMemberUuid: 'test-member-uuid-2',
            participantMemberName: 'Test Member 2',
          },
        ]
      }

      addExpenseToGroup(): Promise<RawExpense> {
        throw new Error('Method not implemented.')
      }
    }

    diContainer.override('ExpenseRepository', new MockExpensesRepository())

    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        headers: { 'Content-Type': 'application/json' },
      },
      MOCK_ENV
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      totalCount: 1,
      expenses: [
        {
          expenseUuid: 'test-expense-uuid-1',
          amount: 100,
          description: 'Test Expense',
          createdAt: '2021-01-01T00:00:00Z',
          paidByMember: {
            memberUuid: 'test-member-uuid-1',
            memberName: 'Test Member 1',
          },
          participantMembers: [
            {
              memberUuid: 'test-member-uuid-1',
              memberName: 'Test Member 1',
            },
            {
              memberUuid: 'test-member-uuid-2',
              memberName: 'Test Member 2',
            },
          ],
        },
      ],
    })
  })
})

describe('POST /api/groups/:groupUuid/expenses', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 400 if paidByMemberUuid is not set', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantMemberUuids: ['test-member-uuid-1', 'test-member-uuid-2'],
          amount: 100,
          description: 'Test Expense',
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if paidByMemberUuid is empty', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: '',
          participantMemberUuids: ['test-member-uuid-1', 'test-member-uuid-2'],
          amount: 100,
          description: 'Test Expense',
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if participantMemberUuids is not set', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: 'test-member-uuid-1',
          amount: 100,
          description: 'Test Expense',
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if participantMemberUuids is empty', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: 'test-member-uuid-1',
          participantMemberUuids: [],
          amount: 100,
          description: 'Test Expense',
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if participantMemberUuids is equal to [paidByMemberUuid]', async () => {
    class MockExpensesRepository implements IExpenseRepository {
      async addExpenseToGroup(): Promise<RawExpense> {
        throw new Error('Method not implemented.')
      }

      fetchExpenses(): Promise<RawExpense[]> {
        throw new Error('Method not implemented.')
      }
    }

    diContainer.override('ExpenseRepository', new MockExpensesRepository())

    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: 'test-member-uuid-1',
          participantMemberUuids: ['test-member-uuid-1'],
          amount: 100,
          description: 'Test Expense',
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({
      message:
        'Expenses with no participants other than the payer cannot be recorded.',
    })
  })

  test('should return 400 if amount is not set', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: 'test-member-uuid-1',
          participantMemberUuids: ['test-member-uuid-1', 'test-member-uuid-2'],
          description: 'Test Expense',
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return 400 if amount is less than 1', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: 'test-member-uuid-1',
          participantMemberUuids: ['test-member-uuid-1', 'test-member-uuid-2'],
          amount: 0,
          description: 'Test Expense',
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return 400 if amount is greater than 1000000', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: 'test-member-uuid-1',
          participantMemberUuids: ['test-member-uuid-1', 'test-member-uuid-2'],
          amount: 1000001,
          description: 'Test Expense',
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if description is not set', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: 'test-member-uuid-1',
          participantMemberUuids: ['test-member-uuid-1', 'test-member-uuid-2'],
          amount: 100,
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if description is empty', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: 'test-member-uuid-1',
          participantMemberUuids: ['test-member-uuid-1', 'test-member-uuid-2'],
          amount: 100,
          description: '',
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 400 if description is too long', async () => {
    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: 'test-member-uuid-1',
          participantMemberUuids: ['test-member-uuid-1', 'test-member-uuid-2'],
          amount: 100,
          description: 'a'.repeat(256),
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(400)
  })

  test('should return status 200', async () => {
    class MockExpensesRepository implements IExpenseRepository {
      async addExpenseToGroup() {
        return {
          expenseUuid: 'test-expense-uuid-1',
          amount: 100,
          description: 'Test Expense',
          createdAt: '2021-01-01T00:00:00Z',
          paidByMemberUuid: 'test-member-uuid-1',
          paidByMemberName: 'Test Member 1',
          participantMemberUuid: 'test-member-uuid-1',
          participantMemberName: 'Test Member 1',
        }
      }

      fetchExpenses(): Promise<RawExpense[]> {
        throw new Error('Method not implemented.')
      }
    }

    diContainer.override('ExpenseRepository', new MockExpensesRepository())

    const res = await app.request(
      '/api/groups/test-group-uuid-1/expenses',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidByMemberUuid: 'test-member-uuid-1',
          participantMemberUuids: ['test-member-uuid-1', 'test-member-uuid-2'],
          amount: 100,
          description: 'Test Expense',
        }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      expense: {
        expenseUuid: 'test-expense-uuid-1',
        amount: 100,
        description: 'Test Expense',
        createdAt: '2021-01-01T00:00:00Z',
        paidByMemberUuid: 'test-member-uuid-1',
      },
    })
  })
})
