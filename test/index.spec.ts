import app from '../src'
import { diContainer } from '../src/di/di-config'
import { IGroupRepository } from '../src/models/repositories/group'
import { IGroupExpensesRepository } from '../src/models/repositories/group-expenses'
import { IGroupMembersRepository } from '../src/models/repositories/group-members'

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
      async fetchGroup() {
        return undefined
      }
    }

    diContainer.override('GroupRepository', new MockUndefinedGroupRepository())

    const res = await app.request(
      '/api/groups/123e4567-e89b-12d3-a456-426614174000',
      {},
      MOCK_ENV
    )
    expect(res.status).toBe(404)
  })

  test('should return status 200', async () => {
    class MockGroupRepository implements IGroupRepository {
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
      {},
      MOCK_ENV
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      group_id: 1,
      group_uuid: '123e4567-e89b-12d3-a456-426614174000',
      group_name: 'Test Group',
    })
  })
})

describe('GET /api/groups/:groupUuid/members', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 200', async () => {
    class MockGroupMembersRepository implements IGroupMembersRepository {
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
      'GroupMembersRepository',
      new MockGroupMembersRepository()
    )

    const res = await app.request(
      '/api/groups/123e4567-e89b-12d3-a456-426614174000/members',
      {},
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

describe('GET /api/groups/:groupUuid/expenses', () => {
  afterEach(() => {
    diContainer.clearOverrides()
  })

  test('should return status 200', async () => {
    class MockGroupExpensesRepository implements IGroupExpensesRepository {
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
      'GroupExpensesRepository',
      new MockGroupExpensesRepository()
    )

    const res = await app.request(
      '/api/groups/123e4567-e89b-12d3-a456-426614174000/expenses',
      {},
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
