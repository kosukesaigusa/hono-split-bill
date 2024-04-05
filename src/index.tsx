import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { fetchGroup } from './models/use-cases/fetch-group'
import { fetchGroupExpenses } from './models/use-cases/fetch-group-expenses'
import { fetchGroupMembers } from './models/use-cases/fetch-group-members'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(prettyJSON())

app.get('api/groups/:groupUuid', async (c) => {
  const groupUuid = c.req.param().groupUuid
  const group = await fetchGroup({ db: c.env.DB, groupUuid })
  if (!group) return c.notFound()

  return c.json(group)
})

app.get('api/groups/:groupUuid/members', async (c) => {
  const groupUuid = c.req.param().groupUuid
  const members = await fetchGroupMembers({ db: c.env.DB, groupUuid })
  return c.json({ members: members })
})

app.get('api/groups/:groupUuid/expenses', async (c) => {
  const groupUuid = c.req.param().groupUuid
  const { page, perPage } = c.req.query()
  const limit = parseQueryParameterToInt(perPage) ?? 10
  const offset = (parseQueryParameterToInt(page) ?? 1 - 1) * limit

  const expenses = await fetchGroupExpenses({
    db: c.env.DB,
    groupUuid,
    limit,
    offset,
  })
  return c.json({
    totalCount: expenses.length,
    expenses: expenses,
  })
})

export default app
