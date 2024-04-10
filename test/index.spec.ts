import app from '../src'
import { diContainer } from '../src/di/di-config'
import { IGroupRepository, RawGroup } from '../src/models/repositories/group'
import {
  IGroupExpenseRepository,
  RawExpense,
} from '../src/models/repositories/group-expense'
import {
  IGroupMemberRepository,
  RawMember,
} from '../src/models/repositories/group-member'

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
          group_uuid: 'test-group-uuid-1',
          group_name: 'Test Group 1',
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
        group_uuid: 'test-group-uuid-1',
        group_name: 'Test Group 1',
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
          group_uuid: 'test-group-uuid-1',
          group_name: 'Test Group 1',
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
        group_uuid: 'test-group-uuid-1',
        group_name: 'Test Group 1',
      },
    })
  })
})

describe('GET /api/groups/:groupUuid/members', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 200', async () => {
    class MockGroupMembersRepository implements IGroupMemberRepository {
      deleteGroupMember(): Promise<void> {
        throw new Error('Method not implemented.')
      }
      addGroupMember(): Promise<RawMember> {
        throw new Error('Method not implemented.')
      }
      async fetchGroupMembers() {
        return [
          {
            member_uuid: 'test-member-uuid-1',
            member_name: 'Test Member 1',
          },
        ]
      }
    }

    diContainer.override(
      'GroupMemberRepository',
      new MockGroupMembersRepository()
    )

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
          member_uuid: 'test-member-uuid-1',
          member_name: 'Test Member 1',
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
    class MockGroupMembersRepository implements IGroupMemberRepository {
      deleteGroupMember(): Promise<void> {
        throw new Error('Method not implemented.')
      }
      async addGroupMember() {
        return {
          member_uuid: 'test-member-uuid-3',
          member_name: 'Test Member 3',
        }
      }

      async fetchGroupMembers(): Promise<RawMember[]> {
        throw new Error('Method not implemented.')
      }
    }

    diContainer.override(
      'GroupMemberRepository',
      new MockGroupMembersRepository()
    )

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
        member_uuid: 'test-member-uuid-3',
        member_name: 'Test Member 3',
      },
    })
  })
})

describe('DELETE /api/groups/:groupUuid/members/:memberId', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 200', async () => {
    class MockGroupMembersRepository implements IGroupMemberRepository {
      async deleteGroupMember() {
        return
      }
      addGroupMember(): Promise<RawMember> {
        throw new Error('Method not implemented.')
      }
      fetchGroupMembers(): Promise<RawMember[]> {
        throw new Error('Method not implemented.')
      }
    }

    diContainer.override(
      'GroupMemberRepository',
      new MockGroupMembersRepository()
    )

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
    class MockGroupExpensesRepository implements IGroupExpenseRepository {
      addExpense(param: {
        groupUuid: string
        amount: number
        description: string
        paidByMemberId: number
        participantMemberIds: number[]
      }): Promise<RawExpense> {
        throw new Error('Method not implemented.')
      }
      async fetchGroupExpenses() {
        return [
          {
            expense_id: 1,
            amount: 100,
            description: 'Test Expense',
            created_at: '2021-01-01T00:00:00Z',
            paid_by_member_uuid: 'test-member-uuid-1',
            paid_by_member_name: 'Test Member 1',
            participant_member_uuid: 'test-member-uuid-1',
            participant_member_name: 'Test Member 1',
          },
          {
            expense_id: 1,
            amount: 100,
            description: 'Test Expense',
            created_at: '2021-01-01T00:00:00Z',
            paid_by_member_uuid: 'test-member-uuid-1',
            paid_by_member_name: 'Test Member 1',
            participant_member_uuid: 'test-member-uuid-2',
            participant_member_name: 'Test Member 2',
          },
        ]
      }
    }

    diContainer.override(
      'GroupExpenseRepository',
      new MockGroupExpensesRepository()
    )

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
          expense_id: 1,
          amount: 100,
          description: 'Test Expense',
          created_at: '2021-01-01T00:00:00Z',
          paid_by_member: {
            member_uuid: 'test-member-uuid-1',
            member_name: 'Test Member 1',
          },
          participant_members: [
            {
              member_uuid: 'test-member-uuid-1',
              member_name: 'Test Member 1',
            },
            {
              member_uuid: 'test-member-uuid-2',
              member_name: 'Test Member 2',
            },
          ],
        },
      ],
    })
  })
})
