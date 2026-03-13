import { Hono } from 'hono';
import inventory from './routes/inventory.js';
import order from './routes/order.js';
import customer from './routes/customer.js';
const app = new Hono();
app.route("/inventory", inventory);
app.route("/order", order);
app.route("/customer", customer);
export default app;
