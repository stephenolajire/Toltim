import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface State {
  state: string;
  bookings: number;
  workers: number;
  penetration: number;
  breakdown: {
    nurses: number;
    chws: number;
  };
}

interface OverviewChartProps {
  states: State[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-100 p-3 border border-gray-300 rounded-lg shadow-lg">
        <h4 className="font-semibold text-gray-800 mb-2">{data.state}</h4>
        <div className="text-sm">
          <div className="text-blue-600 mb-1">Bookings: {data.bookings}</div>
          <div className="text-green-600 mb-1">Workers: {data.workers}</div>
          <div className="text-purple-600">
            Penetration: {data.penetration.toFixed(2)}%
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const OverviewChart: React.FC<OverviewChartProps> = ({ states }) => {
  return (
    <div className="w-full h-auto border-gray-100 shadow-sm rounded-lg">
      <div className="m-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Top Performing States in Nigeria
        </h1>
        <p className="text-gray-500">
          Healthcare service penetration and activity by state
        </p>
      </div>

      <div className="w-full -ml-5 -mb-7" style={{ height: "370px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={states}
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="state"
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickLine={{ stroke: "#e0e0e0" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="bookings"
              fill="#3b82f6"
              radius={[2, 2, 0, 0]}
              name="Bookings"
            />
            <Bar
              dataKey="workers"
              fill="#22c55e"
              radius={[2, 2, 0, 0]}
              name="Workers"
            />
            <Bar
              dataKey="penetration"
              fill="#a855f7"
              radius={[2, 2, 0, 0]}
              name="Penetration"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex py-5 items-center px-5 justify-center space-x-10">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 mr-2 rounded-sm"></div>
          <span className="text-sm text-gray-600">Bookings</span>
        </div>

        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2 rounded-sm"></div>
          <span className="text-sm text-gray-600">Workers</span>
        </div>

        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-500 mr-2 rounded-sm"></div>
          <span className="text-sm text-gray-600">Penetration</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewChart;
