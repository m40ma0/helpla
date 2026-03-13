import { Hono } from "hono";
import { db } from "../firebaseAdmin";
import { isExpired } from "../utils";

const inventory = new Hono()

// Add one food
inventory.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const {name, quantity, supplier, expiry, price} = body

    const docRef = await db.collection('inventory').add({
      name,
      quantity,
      supplier,
      expiry,
      price,
      createdAt: new Date().toISOString(),
    })

    return c.json({id: docRef.id, message: 'Food item added'}, 201)

  } catch {
    return c.json({error: 'Invalid request body'}, 400)
  }
})


// Get ALL documents in the inventory collection
// Get all inventory that is not expired
inventory.get('/', async (c) => {
  const snapshot = await db.collection('inventory').get()
  const data = snapshot.docs
    .filter((doc) => !isExpired(doc.data().expiry))
    .map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

  return c.json(data)
})

// Get ONE document (dont care if expired or not)
inventory.get('/:id', async (c) => {
  const id = c.req.param('id')
  const doc = await db.collection('inventory').doc(id).get()

  if (!doc.exists) {
    return c.json({ error: 'Product not found' }, 404)
  }

  return c.json({
    id: doc.id,
    ...doc.data(),
  })
})

export default inventory
