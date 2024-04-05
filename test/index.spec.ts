import app from '../src'

const MOCK_ENV = {
  DB: {
    prepare: () => {
      /* mocked D1 */
    },
  },
}

describe('GET /', () => {
  test('should return status 200', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ message: 'Hello, World!' })
  })
})

describe('GET /api/groups/:groupUuid', () => {
  test('should return status 200', async () => {
    vi.mock('../src/models/use-cases/fetch-group', () => ({
      fetchGroup: vi.fn().mockResolvedValue({
        group_id: 1,
        group_uuid: '123e4567-e89b-12d3-a456-426614174000',
        group_name: 'Test Group',
      }),
    }))

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
  test('should return status 200', async () => {
    vi.mock('../src/models/use-cases/fetch-group-members', () => ({
      fetchGroupMembers: vi.fn().mockResolvedValue([
        {
          member_id: 1,
          member_name: 'Test User',
        },
      ]),
    }))

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
  test('should return status 200', async () => {
    vi.mock('../src/models/use-cases/fetch-group-expenses', () => ({
      fetchGroupExpenses: vi.fn().mockResolvedValue([
        {
          expense_id: 1,
          amount: 100,
          description: 'Test Expense',
          created_at: '2021-01-01T00:00:00Z',
          paid_by_member: {
            member_id: 1,
            member_name: 'Test User',
          },
          participant_members: [
            {
              member_id: 1,
              member_name: 'Test User',
            },
          ],
        },
      ]),
    }))

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
            member_name: 'Test User',
          },
          participant_members: [
            {
              member_id: 1,
              member_name: 'Test User',
            },
          ],
        },
      ],
    })
  })
})
