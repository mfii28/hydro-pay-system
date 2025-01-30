import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'sql311.infinityfree.com',
  user: 'if0_37949864',
  password: 'hIsnJ2gaejsia0',
  database: 'if0_37949864_waterbill',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;