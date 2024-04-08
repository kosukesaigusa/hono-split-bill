import app from '../src'
import { diContainer } from '../src/di/di-config'
import { IGroupRepository, RawGroup } from '../src/models/repositories/group'
import { IGroupExpenseRepository } from '../src/models/repositories/group-expense'
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
      createGroup(param: { name: string; uuid: string }): Promise<RawGroup> {
        throw new Error('Method not implemented.')
      }
      async fetchGroup() {
        return undefined
      }
    }

    diContainer.override('GroupRepository', new MockUndefinedGroupRepository())

    const res = await app.request(
      '/api/groups/123e4567-e89b-12d3-a456-426614174000',
      {
        headers: { 'Content-Type': 'application/json' },
      },
      MOCK_ENV
    )
    expect(res.status).toBe(404)
  })

  test('should return status 200', async () => {
    class MockGroupRepository implements IGroupRepository {
      createGroup(param: { name: string; uuid: string }): Promise<RawGroup> {
        throw new Error('Method not implemented.')
      }
      async fetchGroup() {
        return {
          group_id: 1,
          group_uuid: '123e4567-e89b-12d3-a456-426614174000',
          group_name: 'Test Group',
        }
      }
    }

    diContainer.override('GroupRepository', new MockGroupRepository())

    const res = await app.request(
      '/api/groups/123e4567-e89b-12d3-a456-426614174000',
      {
        headers: { 'Content-Type': 'application/json' },
      },
      MOCK_ENV
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      group: {
        group_id: 1,
        group_uuid: '123e4567-e89b-12d3-a456-426614174000',
        group_name: 'Test Group',
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
          group_id: 2,
          group_uuid: '123e4567-e89b-12d3-a456-426614174000',
          group_name: 'Test Group 2',
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
        group_id: 2,
        group_uuid: '123e4567-e89b-12d3-a456-426614174000',
        group_name: 'Test Group 2',
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
      addGroupMember(): Promise<RawMember> {
        throw new Error('Method not implemented.')
      }
      async fetchGroupMembers() {
        return [
          {
            member_id: 1,
            member_name: 'Test User',
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
          member_id: 1,
          member_name: 'Test User',
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
      '/api/groups/123e4567-e89b-12d3-a456-426614174000/members',
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
      '/api/groups/123e4567-e89b-12d3-a456-426614174000/members',
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
      '/api/groups/123e4567-e89b-12d3-a456-426614174000/members',
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
      async addGroupMember() {
        return {
          member_id: 1,
          member_name: 'Test User',
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
      '/api/groups/123e4567-e89b-12d3-a456-426614174000/members',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User' }),
      },
      MOCK_ENV
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      member: {
        member_id: 1,
        member_name: 'Test User',
      },
    })
  })
})

describe('GET /api/groups/:groupUuid/expenses', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 200', async () => {
    class MockGroupExpensesRepository implements IGroupExpenseRepository {
      async fetchGroupExpenses() {
        return [
          {
            expense_id: 1,
            amount: 100,
            description: 'Test Expense',
            created_at: '2021-01-01T00:00:00Z',
            paid_by_member_id: 1,
            paid_by_member_name: 'Test User 1',
            participant_member_id: 1,
            participant_member_name: 'Test User 1',
          },
          {
            expense_id: 1,
            amount: 100,
            description: 'Test Expense',
            created_at: '2021-01-01T00:00:00Z',
            paid_by_member_id: 2,
            paid_by_member_name: 'Test User 1',
            participant_member_id: 2,
            participant_member_name: 'Test User 2',
          },
        ]
      }
    }

    diContainer.override(
      'GroupExpenseRepository',
      new MockGroupExpensesRepository()
    )

    const res = await app.request(
      '/api/groups/123e4567-e89b-12d3-a456-426614174000/expenses',
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
            member_id: 1,
            member_name: 'Test User 1',
          },
          participant_members: [
            {
              member_id: 1,
              member_name: 'Test User 1',
            },
            {
              member_id: 2,
              member_name: 'Test User 2',
            },
          ],
        },
      ],
    })
  })
})
