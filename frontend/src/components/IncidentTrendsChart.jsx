import React from 'react';
import { useSelector } from 'react-redux';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const IncidentTrendsChart = () => {
    const { incidentTrends } = useSelector((state) => state.dashboard);
    return (
        <div className="incident-trends">
            <h3>Incident Trends (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={incidentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="high" stroke="#FF0000" strokeWidth={2} />
                    <Line type="monotone" dataKey="medium" stroke="#FFA500" strokeWidth={2} />
                    <Line type="monotone" dataKey="low" stroke="#008000" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
export default IncidentTrendsChart;
