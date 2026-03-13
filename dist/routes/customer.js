import { Hono } from "hono";
import bcrypt from 'bcrypt';
import { db } from "../firebaseAdmin.js";
const customer = new Hono();
// Add a customer
customer.post('/', async (c) => {
    let body;
    try {
        body = await c.req.json();
    }
    catch {
        return c.json({ error: 'Body must be valid JSON' }, 400);
    }
    if (!body.name || typeof body.name !== 'string') {
        return c.json({ error: 'Name is required' }, 400);
    }
    if (!body.email || typeof body.email !== 'string') {
        return c.json({ error: 'Email is required' }, 400);
    }
    const password = await bcrypt.hash('foodrescue', 10);
    const docRef = await db.collection('customers').add({
        name: body.name,
        email: body.email ?? null,
        phone: body.phone ?? null,
        password,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
    // if you want to verify the password use the following:
    // const valid = await bcrypt.compare(password, storedHash)
    return c.json({
        message: 'Customer created',
        id: docRef.id,
    }, 201);
});
// Retrieve all customer data
customer.get('/', async (c) => {
    const snapshot = await db.collection('customers').get();
    const data = snapshot.docs.map((doc) => {
        const customer = doc.data();
        const { password, ...rest } = customer;
        return {
            id: doc.id,
            ...rest
        };
    });
    return c.json({ customers: data });
});
// Retrieve single customer data
customer.get('/:id', async (c) => {
    const customerId = c.req.param('id');
    const doc = await db.collection('customers').doc(customerId).get();
    if (!doc.exists) {
        return c.json({ error: 'Customer not found' }, 404);
    }
    const customer = doc.data();
    if (!customer) {
        return c.json({ error: 'Customer data missing' }, 500);
    }
    const { password, ...rest } = customer;
    return c.json({
        id: doc.id,
        ...rest
    });
});
export default customer;
