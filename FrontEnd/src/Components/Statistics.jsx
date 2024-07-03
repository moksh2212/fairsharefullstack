import React, { useEffect, useState } from "react";
import PieChartComponent from "./PieChartComponent";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { ImStatsDots } from "react-icons/im";
import { GiCrossMark } from "react-icons/gi";
import { baseurl } from "../../util";

const Statistics = ({ over }) => {
  const currentgroup = useSelector((state) => state.CurrentGroupReducer.ob) || {};
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("monthly");

  useEffect(() => {
    const fetchGroupExpense = async () => {
      try {
        const response = await fetch(
          `${baseurl}/expenses/MonthlyExpenses/${currentgroup.GroupId}`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const fetchedData = await response.json();
          fetchedData.push({ Month: "October", TotalExpenses: 400 });
          setData(fetchedData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroupExpense();
  }, [currentgroup.GroupId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div
        id="static-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:bg-gray-800 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                <ImStatsDots />
              </h3>

              <GiCrossMark className="text-white" onClick={() => over(false)} />
            </div>
            <div className="p-4 md:p-5 dark:bg-gray-800">
              <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                  <button
                    onClick={() => handleTabClick("monthly")}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === "monthly"
                        ? "border-orange-600 text-orange-500"
                        : "border-transparent text-white hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    }`}
                  >
                    Total Expense Monthly view
                  </button>
                </li>
                <li className="me-2">
                  <button
                    onClick={() => handleTabClick("contribution")}
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                      activeTab === "contribution"
                        ? "border-orange-600 text-orange-500"
                        : "border-transparent text-white hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    }`}
                  >
                    Member wise contribution
                  </button>
                </li>
              </ul>
              {activeTab === "monthly" && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="Month"
                      tick={{ fill: "white" }}
                      axisLine={{ stroke: "white" }}
                      position="right"
                    />
                    <YAxis
                      dataKey="TotalExpenses"
                      tick={{ fill: "white" }}
                      axisLine={{ stroke: "white" }}
                      position="top"
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="TotalExpenses" fill="#F28C28" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {activeTab === "contribution" && (
                <div className="mt-4">
                  <PieChartComponent />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
