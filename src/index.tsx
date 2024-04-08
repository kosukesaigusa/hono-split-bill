import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { z } from 'zod'

import { diContainer } from './di/di-config'
import { GroupRepository } from './models/repositories/group'
import { GroupExpensesRepository } from './models/repositories/group-expenses'
import { GroupMembersRepository } from './models/repositories/group-members'
import { FetchGroupUseCase } from './models/use-cases/fetch-group'
import { FetchGroupExpensesUseCase } from './models/use-cases/fetch-group-expenses'
import { FetchGroupMembersUseCase } from './models/use-cases/fetch-group-members'

type Bindings = { DB: D1Database }

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', (c, next) => {
  const db = c.env.DB
  diContainer.register('GroupExpensesRepository', GroupExpensesRepository, db)
  diContainer.register('GroupMembersRepository', GroupMembersRepository, db)
  diContainer.register('GroupRepository', GroupRepository, db)

  diContainer.register(
    'FetchGroupExpensesUseCase',
    FetchGroupExpensesUseCase,
    diContainer.get('GroupExpensesRepository')
  )
  diContainer.register(
    'FetchGroupMembersUseCase',
    FetchGroupMembersUseCase,
    diContainer.get('GroupMembersRepository')
  )
  diContainer.register(
    'FetchGroupUseCase',
    FetchGroupUseCase,
    diContainer.get('GroupRepository')
  )
  return next()
})

app.use(prettyJSON())

app.get('/', async (c) => {
  return c.json({ message: 'Hello, World!' })
})

app.get('/api/groups/:groupUuid', async (c) => {
  const groupUuid = c.req.param().groupUuid
  const fetchGroupUseCase = diContainer.get('FetchGroupUseCase')
  const group = await fetchGroupUseCase.invoke(groupUuid)
  if (!group) return c.notFound()

  return c.json(group)
})

app.get(
  '/api/groups/:groupUuid/members',
  zValidator(
    'query',
    z.object({
      page: z.number().min(1).optional(),
      perPage: z.number().min(1).max(30).optional(),
    })
  ),
  async (c) => {
    const groupUuid = c.req.param().groupUuid
    const { page, perPage } = c.req.valid('query')
    const limit = perPage ?? 10
    const offset = (page ?? 1 - 1) * limit

    const fetchGroupMembersUseCase = diContainer.get('FetchGroupMembersUseCase')
    const members = await fetchGroupMembersUseCase.invoke({
      groupUuid,
      limit,
      offset,
    })

    return c.json({ members: members })
  }
)

app.get(
  '/api/groups/:groupUuid/expenses',
  zValidator(
    'query',
    z.object({
      page: z.number().min(1).optional(),
      perPage: z.number().min(1).max(30).optional(),
    })
  ),
  async (c) => {
    const groupUuid = c.req.param().groupUuid
    const { page, perPage } = c.req.valid('query')
    const limit = perPage ?? 10
    const offset = (page ?? 1 - 1) * limit

    const fetchGroupExpensesUseCase = diContainer.get(
      'FetchGroupExpensesUseCase'
    )
    const expenses = await fetchGroupExpensesUseCase.invoke({
      groupUuid,
      limit,
      offset,
    })
    return c.json({
      totalCount: expenses.length,
      expenses: expenses,
    })
  }
)

export default app
