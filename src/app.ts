import { Hono } from 'hono'
import inventory from './routes/inventory'
import order from './routes/order'
import customer from './routes/customer'

const app = new Hono()

app.route("/inventory", inventory)
app.route("/order", order)
app.route("/customer", customer)

export default app