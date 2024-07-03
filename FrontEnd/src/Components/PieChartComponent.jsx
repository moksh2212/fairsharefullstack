import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { baseurl } from "../../util";

const PieChartComponent = () => {
  const [data, setData] = useState([]);
  const currentgroup = useSelector((state) => state.CurrentGroupReducer.ob) || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseurl}/expenses/PieExpenses/${currentgroup.GroupId}`, {
          method: "GET",
        });

        if (response.ok) {
          let fetchedData = await response.json();
          setData(fetchedData);
          console.log(fetchedData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentgroup.GroupId) {
      fetchData();
    }
  }, [currentgroup.GroupId]);

  // Define custom colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart width={700} height={700}>
        <Pie
          dataKey="amount"
          isAnimationActive={true}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend 
          layout="vertical"
          align="middle"
          verticalAlign="low"
          payload={
            data.map((entry, index) => ({
              id: entry.name,
              type: 'square',
              value: `${entry.name} (${entry.amount})`,
              color: COLORS[index % COLORS.length]
            }))
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
