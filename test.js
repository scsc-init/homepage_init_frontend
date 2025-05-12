import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const FRONTEND_SECRET = 'some-secret-code';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    frontend_secret,
    email,
    name,
    phone,
    student_id,
    major_id,
  } = req.body;

  // 인증 확인
  if (frontend_secret !== FRONTEND_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 필수값 검사
  if (!email || !name || !phone || !student_id || !major_id) {
    return res.status(422).json({ error: 'Missing required fields' });
  }

  try {
    const db = await open({
      filename: './db/mydb.sqlite',
      driver: sqlite3.Database,
    });

    const now = new Date().toISOString();

    const result = await db.run(
      `
      INSERT INTO user (
        email, name, phone, student_id,
        role, status, last_login, created_at, updated_at, major_id
      ) VALUES (?, ?, ?, ?, 'user', 'pending', ?, ?, ?, ?)
      `,
      [email, name, phone, student_id, now, now, now, major_id]
    );

    const createdUser = await db.get('SELECT * FROM user WHERE id = ?', [result.lastID]);

    res.status(201).json(createdUser);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Duplicate email, phone, or student_id' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}