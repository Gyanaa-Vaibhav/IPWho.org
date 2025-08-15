import {Pool} from "pg";
import dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || "localhost";
const host = process.env.DB_HOSTNAME
const password = process.env.DB_PASSWORD
const user = process.env.DB_USER;
//const port = Number(process.env.DB_PORT)
const port = 5432
const database = process.env.DB_NAME;

const pool = new Pool({
    host: host,
    password: password,
    user: user,
    port: port,
    database: database,
})

setInterval(() => {
  (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 3 seconds

    try {
      const response = await fetch(`http://${SERVICE_NAME}:${PORT}/up-time`, {
        signal: controller.signal
      });

      clearTimeout(timeout);

      const data = await response.json();

      const insertQuery = `
        INSERT INTO uptime_logs (up) VALUES (${data.success ? 'TRUE' : 'FALSE'});
      `;
      const insertResult = await pool.query(insertQuery);
      console.log('Logged result:', insertResult.rowCount, data);
    } catch (err) {
      clearTimeout(timeout);

      if (err.name === 'AbortError') {
        console.warn('Fetch timed out');
      } else {
        console.error('Fetch error:', err.message);
      }

      const failQuery = `INSERT INTO uptime_logs (up) VALUES (FALSE);`;
      await pool.query(failQuery);
    }
  })();
}, 10000)

