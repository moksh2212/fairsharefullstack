import { useState, useEffect } from "react";
import { FaSadCry } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import Settleup from "./Settleup";
import { SettleupExtension } from "./SettleupExtension";

export const GroupSummary = () => {
  const currentgroup = useSelector((state) => state.CurrentGroupReducer.ob) || {};
  const expense = useSelector((state) => state.ExpenseReducer.Expenses) || [];
  const { user } = useUser();
  const username = user.username || '';
  const [summary, setSummary] = useState({});
  const [modal, setModal] = useState(false);
  const [modalExtension, setModalExtension] = useState(false);
  const [settleUpData, setSettleUpData] = useState({});
  const [filteredExpense, setFilteredExpense] = useState([]);

  useEffect(() => {
    const fetchGroupSummary = async () => {
      const filteredExpenses = expense.filter((exp) => exp.shown);
      setFilteredExpense(filteredExpenses);
      if (!currentgroup.GroupId || !username || filteredExpenses.length === 0) return;
      const data = {
        GroupId: currentgroup.GroupId,
        username: username,
      };
      try {
        const response = await fetch(
          "http://localhost:8000/group/getgroupsBalance",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const res = await response.json();
        if (res && res.data) {
          setSummary(res.data);
        } else {
          setSummary({});
        }
        console.log("summary", res.data);
      } catch (e) {
        console.log(e);
        setSummary({});
      }
    };

    fetchGroupSummary();
  }, [currentgroup, expense, username]);

  let sum = 0;
  if (Object.keys(summary).length !== 0) {
    sum = Object.values(summary).reduce((acc, val) => acc + val, 0);
  }

  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="overflow-y-auto w-full h-32">
        {Object.keys(summary).length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5">
            <FaSadCry className="text-orange-400 h-16 w-16" />
            <h1 className="text-lg text-gray-500 dark:text-gray-400">No Summary yet</h1>
          </div>
        ) : (
          <div>
            <div className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center">
              {sum >= 0 ? (
                <>
                  You are owed  <span className="text-orange-400"> ${sum} </span> overall
                </>
              ) : (
                <>
                  You owe  <span className="text-red-400"> ${-sum} </span> overall
                </>
              )}
            </div>
            {Object.keys(summary).map((key, index) => (
              <div
                key={index}
                className="mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700 flex justify-center items-center border border-orange-400 "
              >
                <span className={`font-medium ${summary[key] < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {summary[key] < 0 ? (
                    <>You owe {key} ${-summary[key]}</>
                  ) : (
                    <>{key} owes you ${summary[key]}</>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <hr className="border-t border-orange-400 my-4" />
      <div className="flex justify-center items-center mt-3">
        <button
          className="bg-green-500 border-2 rounded-lg text-white p-2 border-green-500 hover:bg-green-800 disabled:bg-gray-400 disabled:border-gray-400"
          onClick={() => setModal(true)}
          disabled={filteredExpense.length === 0}
        >
          Settle up
        </button>
      </div>
      {modal && (
        <Settleup
          handlemodal={setModal}
          summary={summary}
          handleextensionmodal={setModalExtension}
          settleupdata={setSettleUpData}
        />
      )}
      {modalExtension && (
        <SettleupExtension
          handlemodal={setModalExtension}
          back={setModal}
          data={settleUpData}
        />
      )}
    </div>
  );
};
