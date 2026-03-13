import { Hono } from 'hono'
import inventory from './routes/inventory'

const app = new Hono()

app.route("/inventory", inventory)

export default app