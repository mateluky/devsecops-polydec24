// This file contains intentional security vulnerabilities for testing purposes
// DO NOT use this code in production

import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await client.connect();
  
  const userId = parseInt(req.query.id, 10);

  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  const query = 'SELECT * FROM users WHERE id = $1';

  try {
    const result = await client.query(query, [userId]);
    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    await client.end();
  }
}
