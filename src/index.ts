import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import inventory from './routes/inventory'
import order from './routes/order'
import customer from './routes/customer'
import recommendation from './routes/recommendation'

const app = new Hono()
const port = Number(process.env.PORT ?? 3000)

app.route("/inventory", inventory)
app.route("/order", order)
app.route("/customer", customer)
app.route("/recommendation", recommendation)

app.get('/', (c) => c.text("Endpoint working"))

serve({
  fetch: app.fetch,
  port
})

console.log(`Server running at http://localhost:${port}`)
