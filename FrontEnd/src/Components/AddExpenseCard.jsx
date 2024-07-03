import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ExpenseCardExtension } from "./ExpenseCardExtension";
import { changeAmount } from "../redux/AmountReduces";
import { addExpense } from "../redux/ExpensesReducers";
import { useUser } from "@clerk/clerk-react";
import { addNewExpense } from "../redux/NewExpenseReducer";
import { PaidByExtension } from "./PaidByExtension";
import { baseurl } from "../../util";
import { changeLoader } from "../redux/LoadingReducer";

export const AddExpenseCard = ({ setShowExpenseCard }) => {
  const { user } = useUser();
  const [extension, setExtension] = useState(false);
  const [type, setType] = useState("equally");
  const [expenseData, setExpenseData] = useState({});
  const [PaidExtension, setPaidExtension] = useState(false);
  const [Pay, setPay] = useState(user.username);
  const [loading, setloading] = useState(false);

  const groupMember = useSelector((state) => state.CurrentGroupReducer.ob);
  const amount = useSelector((state) => state.AmountReducers.amount);
  const dispatch = useDispatch();

  const handleExtensionCard = (data) => {
    setType(data);
    setExtension(false);
  };
  const handlePayextension = (data) => {
    setPaidExtension(false);
    setPay(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const prepareExpenseData = () => {
    console.log("Group Member:", groupMember);

    const amountPerMember = (amount / groupMember.Members.length).toFixed(2);
    const newMemberAmounts = groupMember.Members.reduce((acc, member) => {
      acc[member.username] = parseFloat(amountPerMember);
      return acc;
    }, {});
    console.log("New Member Amounts:", newMemberAmounts);

    return {
      DivisionType: "equally",
      ExpenseDivision: newMemberAmounts,
    };
  };
useEffect(() => {
  dispatch(changeLoader(loading))
}, [loading])

  const submitFormHandler = async (data) => {
    setloading(true);
    let finalExpenseData = expenseData;

    if (Object.keys(finalExpenseData).length === 0) {
      finalExpenseData = prepareExpenseData();
      setExpenseData(finalExpenseData);
    }

    const expense = {
      ...data,
      GroupId: groupMember.GroupId,
      DivisionType: finalExpenseData.DivisionType,
      ExpenseDivision: finalExpenseData.ExpenseDivision,
      CreatedBy: user.username,
      PaidBy: Pay,
      shown: true,
    };
    console.log("Expense Data:", expense);
    const formData = new FormData();
    formData.append("expense", JSON.stringify(expense));
    if (data.receipt && data.receipt[0]) {
      formData.append("receipt", data.receipt[0]);
    }
    try {
      const response = await fetch(`${baseurl}/expenses/addexpense`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const exp = await response.json();
        console.log(exp);
        dispatch(addExpense(exp));
        dispatch(addNewExpense(exp));
        dispatch(changeLoader(false))

        console.log("Expense Data sent successfully");
      }
    } catch (error) {
      console.log(error);
    }

    setShowExpenseCard(false);
  };

  return (
    <>
      {loading ? (
        <div>
          
        </div>
      ) : (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <div
            className={`relative p-4 w-full ${
              extension ? "max-w-2xl" : "max-w-md"
            } flex space-x-4`}
          >
            <div
              className="relative bg-white rounded-lg shadow w-full"
              style={{ background: "rgb(31 41 55)" }}
            >
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Expense
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setShowExpenseCard(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form
                className="p-4 md:p-5"
                onSubmit={handleSubmit(submitFormHandler)}
              >
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter the Expense Name"
                      {...register("ExpenseName", {
                        required: {
                          value: true,
                          message: "Expense name is required",
                        },
                        minLength: { value: 3, message: "Min length is 3" },
                        maxLength: { value: 20, message: "Max length is 20" },
                      })}
                    />
                    {errors.ExpenseName && (
                      <span className="text-red-600 text-sm mt-1">
                        {errors.ExpenseName.message}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 mt-4">
                    <input
                      type="number"
                      name="Amount"
                      id="Amount"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Amount"
                      {...register("Amount", {
                        required: {
                          value: true,
                          message: "Amount is required",
                        },
                        min: {
                          value: 1,
                          message: "Amount must be greater than 0",
                        },
                      })}
                      onChange={(e) => dispatch(changeAmount(e.target.value))}
                    />

                    <div className="mt-5">
                      <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="file_input"
                        type="file"
                        {...register("receipt")}
                      />
                    </div>
                    {errors.Amount && (
                      <span className="text-red-600 text-sm mt-1">
                        {errors.Amount.message}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 flex justify-center items-center mt-4">
                    <h2 className="text-white text-lg font-semibold">
                      Paid by
                      <span
                        onClick={() => setPaidExtension(true)}
                        className="border border-orange-400 rounded px-1 py-1 ml-2 mr-2 bg-gray-800 text-white dark:hover:bg-orange-500 cursor-pointer"
                      >
                        {user.username === Pay ? "you" : Pay}
                      </span>
                      share
                      <span
                        className="border border-orange-400 rounded px-2 py-1 ml-2 bg-gray-800 text-white dark:hover:bg-orange-500 cursor-pointer"
                        onClick={() => setExtension(true)}
                      >
                        {type}
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-blue-800 mt-4"
                  >
                    <svg
                      className="mr-1 ml-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add new Expense
                  </button>
                </div>
              </form>
            </div>
            {extension && (
              <div className="relative rounded-lg shadow p-3 w-full max-w-md">
                <ExpenseCardExtension
                  show={handleExtensionCard}
                  setExpenseData={setExpenseData}
                />
              </div>
            )}
          </div>
          {PaidExtension && (
            <div className="relative rounded-lg shadow p-3 w-1/4 max-w-md">
              <PaidByExtension setPayer={handlePayextension} />
            </div>
          )}
        </div>
      )}
    </>
  );
};
