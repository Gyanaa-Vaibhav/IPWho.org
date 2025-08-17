import {GetInterface} from './getExports.js'
import {Database} from '../databaseExports.js'
import {QueryResult} from "pg";

class GetMonth implements GetInterface {
    private db = Database.getInstance();

    public async query(): Promise<QueryResult> {
        return await this.get()
    }

    private async get():Promise<QueryResult>{
        const query = `
            SELECT
                DATE_TRUNC('month', log_time) AS month_start,
                DATE(log_time) AS day,
--                 COUNT(*) AS total_checks,
--                 SUM(CASE WHEN up THEN 1 ELSE 0 END) AS up_checks,
                ROUND(100.0 * SUM(CASE WHEN up THEN 1 ELSE 0 END) / COUNT(*), 2) AS uptime_percent
            FROM uptime_logs
            WHERE log_time >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY month_start, day
            ORDER BY month_start, day;
        `
        // const query2 = `
        //     SELECT
        //         DATE(log_time) AS day,
        //         COUNT(*) FILTER (WHERE up) AS up_checks,
        //         COUNT(*) AS total_checks
        //     FROM uptime_logs
        //     WHERE log_time >= CURRENT_DATE - INTERVAL '30 days'
        //     GROUP BY day
        //     ORDER BY day;
        // `
        // const {rows} = await this.db.query(query2)
        // console.log(rows)
        return this.db.query(query);
    }
}

export const getMonthService = new GetMonth();
// const {rows} = await getMonthService.query()
// console.log(rows)
