import pg from 'pg';
import fs from 'fs';

const rawData = fs.readFileSync('confidential.json');
const data = JSON.parse(rawData);

export const db = new pg.Client({
    user: data.user,
    host: data.host,
    database: 'blog', 
    password: data.password,
    port: 5432,
  });

db.connect();