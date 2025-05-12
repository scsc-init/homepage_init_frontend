import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';

// DB 경로 정의
const DB_PATH = './db/mydb.sqlite';

async function init() {
  // db 폴더 없으면 생성
  if (!fs.existsSync('./db')) {
    fs.mkdirSync('./db');
  }

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  // 외래 키 활성화
  await db.exec(`PRAGMA foreign_keys = ON;`);

  // major 테이블 생성
  await db.exec(`
    CREATE TABLE IF NOT EXISTS major (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      college TEXT NOT NULL,
      major_name TEXT NOT NULL,
      UNIQUE (college, major_name)
    );
  `);

  // user 테이블 생성
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      student_id TEXT NOT NULL UNIQUE,
      role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'executive', 'president')),
      status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('active', 'pending', 'banned')),
      last_login DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      major_id INTEGER NOT NULL,
      FOREIGN KEY (major_id) REFERENCES major(id) ON DELETE RESTRICT
    );
  `);

  // user 테이블 업데이트 트리거 생성
  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_user_updated_at
    AFTER UPDATE ON user
    FOR EACH ROW
    WHEN 
      OLD.email != NEW.email OR
      OLD.name != NEW.name OR
      OLD.phone != NEW.phone OR
      OLD.student_id != NEW.student_id OR
      OLD.role != NEW.role OR
      OLD.status != NEW.status OR
      OLD.major_id != NEW.major_id
    BEGIN
      UPDATE user
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = OLD.id;
    END;
  `);

  console.log('SQLite 초기화 완료');
  await db.close();
}

init().catch((err) => {
  console.error('DB 초기화 중 오류:', err);
});
