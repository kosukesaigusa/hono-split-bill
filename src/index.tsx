import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(prettyJSON())

app.get('api/groups/:groupUuid', async (c) => {
  const groupUuid = c.req.param().groupUuid
  const group = await c.env.DB.prepare(
    'SELECT * FROM Groups WHERE group_uuid = ?'
  )
    .bind(groupUuid)
    .first()
  if (!group) return c.notFound()

  return c.json(group)
})

app.get('api/groups/:groupUuid/members', async (c) => {
  const groupUuid = c.req.param().groupUuid
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM GroupMembers AS gm
JOIN Groups AS g ON gm.group_id = g.group_id
WHERE g.group_uuid = ?
`
  )
    .bind(groupUuid)
    .all()
  return c.json({ members: results })
})

app.get('api/groups/:groupUuid/expenses', async (c) => {
  const groupUuid = c.req.param().groupUuid
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM Expenses AS e
JOIN Groups AS g ON e.group_id = g.group_id
WHERE g.group_uuid = ?
`
  )
    .bind(groupUuid)
    .all()
  return c.json({ expenses: results })
})

export default app
