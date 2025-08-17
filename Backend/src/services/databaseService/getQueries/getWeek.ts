import {GetInterface} from './getExports.js'
import {Database} from '../databaseExports.js'
import {QueryResult} from "pg";

class GetWeek implements GetInterface {
    private db = Database.getInstance();

    public async query(): Promise<QueryResult> {
        return await this.get()
    }

    private async get():Promise<QueryResult>{
        const query = `
            SELECT
                DATE_TRUNC('week', log_time) AS week_start,
                DATE(log_time) AS day,
                ROUND(100.0 * SUM(CASE WHEN up THEN 1 ELSE 0 END) / COUNT(*), 2) AS uptime_percent
            FROM uptime_logs
            WHERE log_time >= DATE_TRUNC('week', CURRENT_DATE)
            GROUP BY week_start, day
            ORDER BY week_start, day;
        `
        return this.db.query(query);
    }
}

export const getWeekService = new GetWeek();
// const {rows} = await getWeekService.query()
// console.log('getWeekService', rows)