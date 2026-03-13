import { Hono } from 'hono';
import { db } from '../firebaseAdmin.js';
const order = new Hono();
order.post('/', async (c) => {
    let body;
    try {
        body = await c.req.json();
    }
    catch {
        return c.json({ error: 'Body must be valid JSON' }, 400);
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
        return c.json({ error: 'items must be a non-empty array' }, 400);
    }
    const issues = [];
    const finalItems = [];
    let totalPrice = 0;
    for (const item of body.items) {
        if (!item.id || typeof item.quantity !== 'number' || item.quantity <= 0) {
            return c.json({ error: 'Each item must have id and a positive quantity' }, 400);
        }
        const doc = await db.collection('inventory').doc(item.id).get();
        if (!doc.exists) {
            issues.push(`Item not found: ${item.id}`);
            continue;
        }
        const data = doc.data();
        if (typeof data.price !== 'number' || typeof data.quantity !== 'number') {
            issues.push(`Invalid inventory data for item: ${item.id}`);
            continue;
        }
        if (data.quantity < item.quantity) {
            issues.push(`Insufficient stock for ${data.name}. Required: ${item.quantity}, Available: ${data.quantity}`);
            continue;
        }
        const lineTotal = data.price * item.quantity;
        totalPrice += lineTotal;
        finalItems.push({
            id: item.id,
            name: data.name,
            quantity: item.quantity,
            unitPrice: data.price,
            lineTotal
        });
    }
    if (issues.length > 0) {
        return c.json({
            error: 'Inventory check failed',
            issues
        }, 400);
    }
    const docRef = await db.collection('orders').add({
        customerId: body.customerId ?? null,
        items: finalItems,
        totalPrice,
        createdAt: Date.now(),
    });
    return c.json({
        message: 'Order created',
        orderId: docRef.id,
        totalPrice,
        items: finalItems
    }, 201);
});
// Retrieve all orders from this customer
order.get("/customer/:id", async (c) => {
    const customerId = c.req.param('id');
    if (!customerId) {
        return c.json({ error: 'Customer ID required' }, 400);
    }
    const snapshot = await db.collection('orders').where('customerId', '==', customerId).get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return c.json(orders);
});
export default order;
