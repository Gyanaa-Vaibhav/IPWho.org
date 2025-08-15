import {Pool} from "pg";
const host = process.env.DB_HOSTNAME
const password = process.env.DB_PASSWORD
const user = process.env.DB_USER;
const port = Number(process.env.DB_PORT)
const database = process.env.DB_NAME;

const pool = new Pool({
    host: host,
    password: password,
    user: user,
    port: port,
    database: database,
})

const InitQuery = `
    CREATE TABLE IF NOT EXISTS uptime_logs(
        ID SERIAL PRIMARY KEY,
        log_date DATE DEFAULT CURRENT_DATE,
        log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        up BOOLEAN DEFAULT FALSE
    );
`
const initQurryResult = await pool.query(InitQuery)
console.log(initQurryResult)