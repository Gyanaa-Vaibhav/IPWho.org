import {Pool} from 'pg';
import dotenv from 'dotenv';
import {logError} from "../logger/loggerExport.js";
dotenv.config()

/**
 * Core Database holder class following the Singleton pattern.
 *
 * - Stores a single database instance, agnostic to the DB engine (PostgreSQL, MongoDB, etc.)
 * - Enforces one-time initialization using `initialiseDB()`
 * - Use `getInstance()` to access the stored DB instance
 *
 * Designed to be extended or wrapped by DB-specific service classes (e.g., PostgresDB, MongoDB).
 */
class Database{
    private static database:unknown;

    /**
     * Returns the initialized database instance.
     * Throws an error if called before initialization.
     */
    public static getInstance() {
        if (!Database.database) {
            logError("Database not initialised please initialise using Database.initialiseDB() method")
            throw new Error("Database not initialised please initialise using Database.initialiseDB() method");
        }
        return Database.database;
    }

    /**
     * Initializes the database instance once.
     * Subsequent calls with a connection will throw an error.
     *
     * @param DBConnection - The DB connection object to store (e.g., Pool, MongoClient)
     */
    public static initialiseDB(DBConnection:unknown){
        if (Database.database && DBConnection) {
            logError("Database already initialised")
            throw new Error("Database already initialised");
        }
        if (!Database.database && DBConnection) {
            Database.database = DBConnection;
            if(DBConnection instanceof Pool)
            DBConnection.query("SELECT NOW()")
                .catch((err: unknown) => {
                    if (err instanceof Error) {
                        logError(`Database connection failed: ${err.message}`);
                    } else {
                        logError("Database connection failed with unknown error type.");
                    }

                    throw new Error("Database Connection Failed");
                });
        }
    }
}

/**
 * PostgreSQL-specific database accessor.
 *
 * - Wraps the core `Database` singleton.
 * - Casts the instance to `pg.Pool` for type-safe PostgreSQL usage.
 *
 * Extend this pattern to support other databases:
 * e.g., MongoDB class wrapping `MongoClient`, reusing the same `Database` core.
 */
export class PostgresDB{
    /**
     * Returns the database instance as a PostgreSQL Pool.
     */
    public static getInstance(){
        return Database.getInstance() as Pool;
    }
}

const host = process.env.DB_HOSTNAME
const password = process.env.DB_PASSWORD
const user = process.env.DB_USER;
const port = Number(process.env.DB_PORT)
const database = process.env.DB_NAME;

if(!database || !host || !password || !user || !port ){
    logError("env not configured, make sure you have .env available")
}

const pool = new Pool({
    host: host,
    password: password,
    user: user,
    port: port,
    database: database,
})

Database.initialiseDB(pool)

// const db = Database.getInstance();
// const {rows} = await db.query(`INSERT INTO uptime_logs (log_date, log_time, up)
// SELECT
//     gs::date,
//     gs,
//     (RANDOM() < 0.98)
// FROM generate_series(NOW() - INTERVAL '30 days', NOW(), INTERVAL '10 seconds') gs;`)
// console.log(rows);