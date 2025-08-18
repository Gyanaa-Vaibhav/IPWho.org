import {ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip} from 'recharts';
import type {TooltipProps} from 'recharts';
import {useEffect, useState} from "react";

export default function Chart({data,xAxis}: {data: any,xAxis:string}) {
    if (!data || data.length === 0) return null;

    const [chartHeight, setChartHeight] = useState(300);

    const formatXAxisLabel = (tick: any) => {
        if (xAxis === "hour") {
            return tick.slice(0, 5);
        } else if (xAxis === "day") {
            const date = new Date(tick);
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        }
        return tick;
    };

    const calculateInterval = () => {
        const totalDataPoints = data.length;
        if (totalDataPoints === 7) {
            if(window.innerWidth < 800) return 1
            return 0
        }
        else if( totalDataPoints === 24) {
            if(window.innerWidth < 800) return 4
            return 1
        }
        else if( totalDataPoints === 31) {
            if(window.innerWidth < 800) return 5
            return 2
        }
    };

    useEffect(() => {
        if (window.innerWidth < 800) {
            setChartHeight(200);
        } else {
            setChartHeight(300);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 800) {
                setChartHeight(200);
            } else {
                setChartHeight(300);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [chartHeight]);

    function sizeDeterminer(){
        return window.innerWidth > 800
    }

    return(
        <>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart width={600} height={300} data={data}>
                    <CartesianGrid vertical={false} />
                    <Line dataKey="uptime_percent" stroke="#003E6B" fill='#003E6B' dot={{ strokeWidth: sizeDeterminer() ? 4 : 1 }} activeDot={{ stroke: '#0A558C', strokeWidth: sizeDeterminer() ? 2 : 1, r: sizeDeterminer() ? 5 : 2 }} strokeWidth={3}/>
                    <XAxis
                        dataKey={xAxis}
                        tickFormatter={formatXAxisLabel}
                        interval={calculateInterval()}
                        tick={{ fontSize: 11, fontFamily: 'Proximanova-Bold, sans-serif', fill: '#333' }}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fontFamily: 'Proximanova-Bold, sans-serif', fill: '#333' }}
                        domain={['dataMin', 'dataMax']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}

// @ts-ignore
const CustomTooltip = ({ payload }: TooltipProps<any, any>) => {
    if (!payload || payload.length === 0) return null;

    const { uptime_percent } = payload[0].payload;

    return (
        <div className="custom-tooltip">
            <p>{`${uptime_percent.toFixed(2)}%`}</p>
        </div>
    );
};