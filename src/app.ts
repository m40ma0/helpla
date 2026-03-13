import { Hono } from 'hono'
import inventory from './routes/inventory'
import order from './routes/order'

const app = new Hono()

app.route("/inventory", inventory)
app.route("/order", order)

export default app