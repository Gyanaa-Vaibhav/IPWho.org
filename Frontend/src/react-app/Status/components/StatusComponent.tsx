import {useEffect, useState} from "react";
import '../styles/Status.css';
import Chart from './Chart.tsx'
const url = import.meta.env.VITE_SERVER ? `${import.meta.env.VITE_SERVER}` : "/";

export default function StatusComponent() {
    const [todayData,setTodayData] = useState<{hour:string,uptime_percent:number}[]>([]);
    const [weekData,setWeekData] = useState<{day:string,uptime_percent:number}[]>([]);
    const [monthData,setMonthData] = useState<{day:string,uptime_percent:number}[]>([]);

    useEffect(() => {
        fetch(`${url}status/today`).then(res => res.json()).then((data) => {
            if(data.success){
                const formattedData = data.data.map((item: { uptime_percent: string; hour: string | number | Date; }) => ({
                    ...item,
                    uptime_percent: parseFloat(item.uptime_percent),
                    hour: new Date(item.hour).toLocaleTimeString()
                }));
                setTodayData(formattedData);
            }
        });

        fetch(`${url}status/week`).then(res => res.json()).then((data) => {
            if(data.success){
                const formattedData = data.data.map((item: { uptime_percent: string; day: string | number | Date; }) => ({
                    ...item,
                    uptime_percent: parseFloat(item.uptime_percent),
                    day: new Date(item.day).toISOString().slice(0, 10)
                }));
                setWeekData(formattedData);
            }
        });

        fetch(`${url}status/month`).then(res => res.json()).then((data) => {
            if(data.success){
                const formattedData = data.data.map((item: { uptime_percent: string; day: string | number | Date; }) => ({
                    ...item,
                    uptime_percent: parseFloat(item.uptime_percent),
                    day: new Date(item.day).toISOString().slice(0, 10)
                }));
                setMonthData(formattedData);
            }
        });

    }, []);

    if (todayData.length === 0 || weekData.length === 0 || monthData.length === 0) return null;

    return (
        <>
            {todayData &&
                <>
                    <h2>Up Time 24 hrs</h2>
                    <Chart data={todayData} xAxis="hour" />
                </>
            }
            {weekData &&
                <>
                    <h2>Up Time 1 Week</h2>
                    <Chart data={weekData} xAxis="day" />
                </>
            }
            {monthData &&
                <>
                    <h2>Up Time 1 Month</h2>
                    <Chart data={monthData} xAxis="day" />
                </>
            }
        </>
    );
}
