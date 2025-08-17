import {GetInterface} from './getExports.js'
import {Database} from '../databaseExports.js'
import {QueryResult} from "pg";

class GetToday implements GetInterface {
    private db = Database.getInstance();

    public async query(): Promise<QueryResult> {
        return await this.get()
    }

    private async get():Promise<QueryResult>{
        const query = `
            SELECT
                DATE_TRUNC('hour', log_time) AS hour,
                COUNT(*) AS total_checks,
                SUM(CASE WHEN up THEN 1 ELSE 0 END) AS up_checks,
                ROUND(100.0 * SUM(CASE WHEN up THEN 1 ELSE 0 END) / COUNT(*), 2) AS uptime_percent
            FROM uptime_logs
            WHERE log_time >= DATE_TRUNC('hour', NOW() - INTERVAL '23 hours')
              AND log_time < DATE_TRUNC('hour', NOW()) + INTERVAL '1 hour'
            GROUP BY hour
            ORDER BY hour;
        `
        return this.db.query(query);
    }
}

export const getTodayService = new GetToday();
// const {rows} = await getTodayService.query()
// console.log('getTodayService', rows)
// console.log(rows.length)