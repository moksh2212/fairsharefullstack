import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { useUser } from "@clerk/clerk-react";
import { useSelector} from "react-redux";
import { useDispatch } from "react-redux";
import { addExpense } from "../redux/ExpensesReducers";
import { baseurl } from "../../util";

export const SettleupExtension = ({ back, handlemodal, data }) => {
  const groupMember = useSelector((state) => state.CurrentGroupReducer.ob);
  const Expenses = useSelector((state) => state.ExpenseReducer.Expenses);
  const user = useUser().user;
  const [amount, setAmount] = useState(() => {
    const initialValue = Object.values(data)[0];
    if (typeof initialValue === 'number' && !isNaN(initialValue)) {
      return Math.abs(parseFloat(initialValue).toFixed(2)); // Ensure toFixed(2) for 2 decimal places
    }
    return '';
  });
  
const dispatch=useDispatch();

const handleAmount = (event) => {
  let value = event.target.value;

  // Remove non-numeric and non-decimal characters except leading minus sign
  value = value.replace(/[^0-9.]/g, '');

  // Ensure there's only one decimal point
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  // Update state with the cleaned value
  setAmount(value);
};

  const handleRecord = async () => {
    let paidby = Object.values(data)[0] > 0 ? Object.keys(data)[0] : user.username;
    let obj = Object.values(data)[0] > 0 
      ? { [user.username]: amount, [Object.keys(data)[0]]: 0 } 
      : { [user.username]: 0, [Object.keys(data)[0]]: amount };
       
    const expense = {
      GroupId: groupMember.GroupId,
      DivisionType: "Record",
      CreatedBy: user.username,
      PaidBy: paidby,
      ExpenseDivision: obj,
      shown: false,
      ExpenseName: "Settlement",
      Amount:amount,
    };

    const formData = new FormData();
    formData.append("expense", JSON.stringify(expense));
    try {
      const response = await fetch(`${baseurl}/expenses/addexpense`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {

        handlemodal(false); 
        dispatch(addExpense(expense))
      } else {
        console.error("Failed to record the payment");
      }
    } catch (error) {
      console.error("Error recording the payment:", error);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
        <div className="relative bg-gray-800 rounded-lg shadow w-full max-w-md mx-4 md:mx-0">
          <div className="flex items-center gap-3 p-4 md:p-5 border-b border-gray-600 rounded-t">
            <FaArrowLeft
              className="text-white hover:border rounded-full hover:bg-black"
              onClick={() => {
                back(true);
                handlemodal(false);
              }}
            />
            <h3 className="text-lg font-semibold text-white">Record payment</h3>
          </div>
          <div className="p-4 md:p-5 text-gray-400 w-full">
            <div className="p-4">
              <div className="flex justify-center items-center gap-16">
                <div className="flex flex-col items-center justify-center gap-5">
                  <BsPersonCircle className="h-20 w-20" />
                  {Object.values(data)[0] > 0 ? (
                    <div>You</div>
                  ) : (
                    <div>{Object.keys(data)[0]}</div>
                  )}
                </div>
                <div>
                  <MdOutlinePayments className="text-green-500 h-10 w-10 mb-5" />
                </div>
                <div className="flex flex-col items-center justify-center gap-5">
                  <BsPersonCircle className="h-20 w-20" />
                  {Object.values(data)[0] < 0 ? (
                    <div>You</div>
                  ) : (
                    <div>{Object.keys(data)[0]}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center text-white rounded-lg font-bold p-4">
                {Object.values(data)[0] < 0 ? (
               <div className="flex items-center justify-center gap-2 text-xs">
               <div className="flex items-center justify-center">You are making a payment of</div> 
               <input
                 type="text"
                 className="bg-gray-600 text-white w-20 text-center border rounded-md border-orange-600 hover:bg-gray-700 focus:outline-none"
                 value={amount}
                 onChange={handleAmount}
               />
               <div className="flex items-center justify-center">to {Object.keys(data)}</div>
             </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-xs" >
                    {Object.keys(data)} paid
                    <span className="text-green-500">
                      <input
                        type="text"
                        className="bg-gray-600 text-green w-20 text-center border rounded-md border-orange-600 hover:bg-gray-700 focus:outline-none"
                        value={amount}
                        onChange={handleAmount}
                      />
                    </span>
                    to you
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center mt-4">
                <button
                  className="focus:outline-none text-white bg-orange-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-orange-500 dark:hover:bg-green-400 dark:focus:ring-orange-400"
                  onClick={handleRecord}
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
