import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { z } from 'zod'

import { diContainer } from './di/di-config'
import { GroupRepository } from './models/repositories/group'
import { GroupExpenseRepository } from './models/repositories/group-expense'
import { GroupMemberRepository } from './models/repositories/group-member'
import { AddMemberToGroupUseCase } from './models/use-cases/add-member-to-group'
import { CreateGroupUseCase } from './models/use-cases/create-group'
import { FetchGroupUseCase } from './models/use-cases/fetch-group'
import { FetchGroupExpensesUseCase } from './models/use-cases/fetch-group-expenses'
import { FetchGroupMembersUseCase } from './models/use-cases/fetch-group-members'
import { RemoveMemberFromGroupUseCase } from './models/use-cases/remove-member-from-group'

type Bindings = { DB: D1Database }

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', (c, next) => {
  const db = c.env.DB
  diContainer.registerInstance('db', db)

  diContainer.register('GroupExpenseRepository', GroupExpenseRepository, db)
  diContainer.register('GroupMemberRepository', GroupMemberRepository, db)
  diContainer.register('GroupRepository', GroupRepository, db)

  diContainer.register(
    'AddMemberToGroupUseCase',
    AddMemberToGroupUseCase,
    diContainer.get('GroupMemberRepository')
  )
  diContainer.register(
    'CreateGroupUseCase',
    CreateGroupUseCase,
    diContainer.get('GroupRepository')
  )
  diContainer.register(
    'FetchGroupExpensesUseCase',
    FetchGroupExpensesUseCase,
    diContainer.get('GroupExpenseRepository')
  )
  diContainer.register(
    'FetchGroupMembersUseCase',
    FetchGroupMembersUseCase,
    diContainer.get('GroupMemberRepository')
  )
  diContainer.register(
    'FetchGroupUseCase',
    FetchGroupUseCase,
    diContainer.get('GroupRepository')
  )
  diContainer.register(
    'RemoveMemberFromGroupUseCase',
    RemoveMemberFromGroupUseCase,
    diContainer.get('GroupMemberRepository')
  )

  return next()
})

app.use(prettyJSON())

app.get('/', async (c) => {
  return c.json({ message: 'Hello, World!' })
})

app.get(
  '/api/groups/:groupUuid',
  zValidator(
    'param',
    z.object({
      groupUuid: z.string(),
    })
  ),
  async (c) => {
    const { groupUuid } = c.req.valid('param')
    const fetchGroupUseCase = diContainer.get('FetchGroupUseCase')
    const group = await fetchGroupUseCase.invoke(groupUuid)
    if (!group) return c.notFound()

    return c.json({ group })
  }
)

app.get(
  '/api/groups/:groupUuid/members',
  zValidator(
    'param',
    z.object({
      groupUuid: z.string(),
    })
  ),
  zValidator(
    'query',
    z.object({
      page: z.string().pipe(z.coerce.number().min(1)).optional(),
      perPage: z.string().pipe(z.coerce.number().min(1).max(20)).optional(),
    })
  ),
  async (c) => {
    const { groupUuid } = c.req.valid('param')
    const { page, perPage } = c.req.valid('query')
    const limit = perPage ?? 10
    const offset = (page ?? 1 - 1) * limit

    const fetchGroupMembersUseCase = diContainer.get('FetchGroupMembersUseCase')
    const members = await fetchGroupMembersUseCase.invoke({
      groupUuid,
      limit,
      offset,
    })

    return c.json({ members })
  }
)

app.post(
  '/api/groups/:groupUuid/members',
  zValidator(
    'param',
    z.object({
      groupUuid: z.string(),
    })
  ),
  zValidator(
    'json',
    z.object({
      name: z.string().min(1).max(255),
    })
  ),
  async (c) => {
    const { groupUuid } = c.req.valid('param')
    const { name } = c.req.valid('json')
    const addMemberToGroupUseCase = diContainer.get('AddMemberToGroupUseCase')
    const member = await addMemberToGroupUseCase.invoke({ groupUuid, name })

    return c.json({ member })
  }
)

app.delete(
  '/api/groups/:groupUuid/members/:memberId',
  zValidator(
    'param',
    z.object({
      groupUuid: z.string(),
      memberId: z.string().pipe(z.coerce.number()),
    })
  ),
  async (c) => {
    const { groupUuid, memberId } = c.req.valid('param')
    const removeMemberFromGroupUseCase = diContainer.get(
      'RemoveMemberFromGroupUseCase'
    )
    await removeMemberFromGroupUseCase.invoke({ groupUuid, memberId })

    return c.json({})
  }
)

app.post(
  '/api/groups',
  zValidator(
    'json',
    z.object({
      name: z.string().min(1).max(255),
    })
  ),
  async (c) => {
    const { name } = c.req.valid('json')
    const createGroupUseCase = diContainer.get('CreateGroupUseCase')
    const group = await createGroupUseCase.invoke(name)
    return c.json({ group })
  }
)

app.get(
  '/api/groups/:groupUuid/expenses',
  zValidator(
    'param',
    z.object({
      groupUuid: z.string(),
    })
  ),
  zValidator(
    'query',
    z.object({
      page: z.string().pipe(z.coerce.number().min(1)).optional(),
      perPage: z.string().pipe(z.coerce.number().min(1).max(20)).optional(),
    })
  ),
  async (c) => {
    const { groupUuid } = c.req.valid('param')
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
