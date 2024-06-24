import React from "react";
import { MdSpeakerNotesOff } from "react-icons/md";
import { useSelector } from "react-redux";
import { CiUser } from "react-icons/ci";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { useEffect } from "react";
import { InitializeExpense } from "../redux/ExpensesReducers";
import { useDispatch } from "react-redux";
import { MdOutlineDelete } from "react-icons/md";
import WarningComponent from "./WarningComponent";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { GoFileMedia } from "react-icons/go";
import { GiCrossMark } from "react-icons/gi";
export const ExpenseTable = ({ setShowExpenseCard }) => {
  const dispatch = useDispatch();
  const user = useUser().user;
  const [deleteModal, setdeleteModal] = useState(false);
  const [expenseid, setexpenseid] = useState();
  const [filter, setfilter] = useState("");

  const currentgroup = useSelector((state) => state.CurrentGroupReducer.ob);

  const expense = useSelector((state) => state.ExpenseReducer.Expenses) || [];
  const [searchfilterExpense, setsearchfilterExpense] = useState([]);
  useEffect(() => {
    setsearchfilterExpense(expense);
  }, [expense]);
  useEffect(() => {
    const fetchexpenses = async () => {
      try {
        console.log(currentgroup.GroupId);
        const repsonse = await fetch(
          `http://localhost:8000/expenses/getexpense/${currentgroup.GroupId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (repsonse.ok) {
          const fetchedExpenses = await repsonse.json();
          console.log(fetchedExpenses);
          dispatch(InitializeExpense(fetchedExpenses));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchexpenses();
  }, [currentgroup]);
  const Expenses = useSelector((state) => state.ExpenseReducer.Expenses);
  console.log(Expenses);
  const handleDelete = async () => {
    try {
      const id = expenseid;
      const repsonse = await fetch(
        `http://localhost:8000/expenses/Deleteexpense/${id}/${user.username}`,
        {
          method: "DELETE",
        }
      );
      if (repsonse.ok) {
        const Expense = Expenses.filter((expense) => expense._id !== id);
        dispatch(InitializeExpense(Expense));

        setdeleteModal(false);
        console.log("deleteDone");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let timout;
  
    if (filter === "") {
      setsearchfilterExpense(expense);
    } else {
      timout = setTimeout(() => {
        const newExpense = expense.filter((exp) =>
          exp.ExpenseName.toLowerCase().includes(filter.toLowerCase())
        );
        setsearchfilterExpense(newExpense);
      }, 300);
    }
  
    return () => {
      clearTimeout(timout);
    };
  }, [filter]);

  const handlefilter = (e) => {
    setfilter(e.target.value);
  };

  const filteredExpenses = searchfilterExpense.filter(
    (searchfilterExpense) => searchfilterExpense.shown
  );

  return (
    <>
      {filteredExpenses.length === 0 ? (
        <div className="relative">
          <div className="ml-4">
            <div
              className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden"
              style={{ height: "650px" }}
            >
              <div className="my-4">
                <div className="my-4 flex justify-center">
                  <h1 className="text-2xl font-bold text-center text-gray-500 dark:text-orange-400 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
                    <div className="flex justify-center items-center gap-2">
                      {currentgroup.Groups === "" ? (
                        <MdSpeakerNotesOff />
                      ) : (
                        currentgroup.GroupName
                      )}
                    </div>
                  </h1>
                </div>
                <hr className="border-t border-orange-400 my-4 ml-10 mr-10" />
              </div>
             
              <div
                className="flex flex-col justify-center items-center"
                style={{ height: "calc(100% - 150px)" }}
              >
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <input
                      type="text"
                      id="simple-search"
                      className="w-full bg-gray-50 border border-orange-600 text-gray-900 text-sm rounded-lg pl-10 pr-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search"
                      value={filter}
                      onChange={handlefilter}
                      disabled={currentgroup.Groups === ""}
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      <GiCrossMark className="w-5 h-5" onClick={()=>setfilter("")} />
                    </button>
                  </div>
                <img
                  src="/pirate.svg"
                  alt="Pirate"
                  className="h-50 w-50 mb-14"
                />
                <h1 className="text-gray-500">Select a group Please!!!</h1>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <hr className="border-t border-orange-400 my-4 ml-10 mr-10" />
                <button
                  type="button"
                  className="focus:outline-none text-white bg-orange-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-orange-500 dark:hover:bg-orange-400 dark:focus:ring-orange-400"
                  onClick={() => {
                    setShowExpenseCard(true);
                  }}
                  disabled={
                    currentgroup.Groups === "" ||
                    currentgroup.Members.length === 1
                  }
                >
                  ADD EXPENSE
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="ml-4">
            <div
              className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden"
              style={{ height: "650px" }}
            >
              <div className="my-4">
                <div className="flex items-center justify-center">
                  <div className="p-1 bg-gray-50 dark:bg-gray-700 border border-orange-500 rounded-lg shadow-sm flex justify-center items-center w-3/4  hover:bg-gray-800 ">
                    <h1 className="text-2xl font-bold  text-gray-900 dark:text-white">
                      {currentgroup.GroupName}
                    </h1>
                  </div>
                </div>
                <hr className="border-t border-orange-400 my-4 ml-10 mr-10" />
              </div>
              <div className="max-h-[490px] overflow-y-auto">
                <div className="flex flex-col space-y-4 p-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <input
                      type="text"
                      id="simple-search"
                      className="w-full bg-gray-50 border border-orange-600 text-gray-900 text-sm rounded-lg pl-10 pr-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search"
                      value={filter}
                      onChange={handlefilter}
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      <GiCrossMark className="w-5 h-5" onClick={()=>setfilter("")} />
                    </button>
                  </div>
                  {filteredExpenses.map((expense, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-700 border border-orange-500 rounded-lg shadow-md hover:translate-y-[-4px] hover:shadow-lg transition-all duration-200"
                      style={{ height: "auto" }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <FaMoneyBill1Wave />
                          {expense.ExpenseName}
                        </h3>
                        <div className="text-xs font-bold text-gray-600 dark:text-gray-400">
                          Paid By :{" "}
                          <span className="text-orange-400">
                            {expense.PaidBy}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-center items-center ">
                        <ul className="ml-4 flex items-center justify-center gap-2 flex-wrap">
                          {Object.entries(expense.ExpenseDivision).map(
                            ([key, value]) => (
                              <li
                                key={key}
                                className="flex items-center hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                              >
                                <CiUser />
                                <span className="ml-1">
                                  {key}:{" "}
                                  <span className="text-green-500">
                                    ${value}
                                  </span>
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="flex justify-between">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setdeleteModal(true);
                            setexpenseid(expense._id);
                            console.log(expense._id);
                          }}
                        >
                          <MdOutlineDelete />
                        </button>{" "}
                        <div>
                          {expense?.url=== ""?"":<GoFileMedia
                            onClick={() => {
                              window.open(expense?.url, "_blank");
                            }}
                            className="text-orange-400"
                          />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-4 mb-4">
                <button
                  type="button"
                  className="focus:outline-none text-white bg-orange-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-orange-500 dark:hover:bg-orange-400 dark:focus:ring-orange-400"
                  onClick={() => {
                    setShowExpenseCard(true);
                  }}
                  disabled={currentgroup.Groups === ""}
                >
                  ADD EXPENSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        {deleteModal && (
          <WarningComponent close={setdeleteModal} Sure={handleDelete}>
            Are you sure you want to delete this Expense?
          </WarningComponent>
        )}
      </div>
    </>
  );
};
