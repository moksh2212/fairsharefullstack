import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiSeahorse } from "react-icons/gi";
import AnimatedSeahorse from "./Animatehorse";
export const ExpenseCardExtension = ({ show, setExpenseData }) => {
  const [unequally, setUnequally] = useState(false);
  const [percentage, setPercentage] = useState(false);
  const [equally, setEqually] = useState(true);
  const [memberAmounts, setMemberAmounts] = useState({});
  const [unequalAmounts, setUnequalAmounts] = useState({});
  const [percentages, setPercentages] = useState({});
  const [error, setError] = useState("");
  const [sum, setSum] = useState(0);
  const [unequalSum, setUnequalSum] = useState(0);
  const groupMember = useSelector((state) => state.CurrentGroupReducer.ob);
  const amount = useSelector((state) => state.AmountReducers.amount);

  useEffect(() => {
    if (groupMember.Members) {
      const amountPerMember = (amount / groupMember.Members.length).toFixed(2);
      const percentagePerMember = (100 / groupMember.Members.length).toFixed(2);
      const newMemberAmounts = groupMember.Members.reduce((acc, member) => {
        acc[member.username] = parseFloat(amountPerMember);
        return acc;
      }, {});
      const newPercentages = groupMember.Members.reduce((acc, member) => {
        acc[member.username] = parseFloat(percentagePerMember);
        return acc;
      }, {});
      setUnequalSum(amountPerMember * groupMember.Members.length);
      setSum(percentagePerMember * groupMember.Members.length);
      setMemberAmounts(newMemberAmounts);
      setUnequalAmounts(newMemberAmounts);
      console.log(newMemberAmounts)
      console.log(newPercentages)
      setPercentages(newPercentages);
    }
  }, [amount, groupMember.Members]);

  const handleUnequalChange = (member, value) => {
    const newUnequalAmounts = {
      ...unequalAmounts,
      [member]: parseFloat(value),
    };
    const newUnequalSum = Object.values(newUnequalAmounts).reduce(
      (acc, val) => acc + (isNaN(val) ? 0 : val),
      0
    );
    if (newUnequalSum > amount) {
      setError("Input amount sum greater than actual amount");
    } else {
      setError("");
    }
    setUnequalSum(newUnequalSum);
    setUnequalAmounts(newUnequalAmounts);
  };

  const handlePercentageChange = (member, value) => {
    const newPercentages = {
      ...percentages,
      [member]: parseFloat(value),
    };
    const newSum = Object.values(newPercentages).reduce(
      (acc, val) => acc + (isNaN(val) ? 0 : val),
      0
    );
    if (newSum > 100) {
      setError("Input amount sum greater than 100%");
    } else {
      setError("");
    }
    setSum(newSum);
    setPercentages(newPercentages);
  };

  const calculateAmountFromPercentage = (percentage) => {
    return ((amount * percentage) / 100).toFixed(2);
  };

  const handleSetClick = () => {
    let ExpenseData;
    if (equally) {
      show("equally");
      ExpenseData = {
        DivisionType: "equally",
        ExpenseDivision: memberAmounts,
      };
    } else if (unequally) {
      const totalUnequalAmount = Object.values(unequalAmounts).reduce(
        (acc, val) => acc + parseFloat(val),
        0
      );
      if (totalUnequalAmount !== parseFloat(amount)) {
        setError(
          `The total amount ${
            totalUnequalAmount > amount ? "exceeds" : "is less than"
          } the available amount.`
        );
        return;
      }
      show("unequally");
      ExpenseData = {
        DivisionType: "unequally",
        ExpenseDivision: unequalAmounts,
      };
    } else if (percentage) {
      const totalPercentage = Object.values(percentages).reduce(
        (acc, val) => acc + parseFloat(val),
        0
      );
      if (totalPercentage !== 100) {
        setError(
          `The total percentage ${
            totalPercentage > 100 ? "exceeds" : "is less than"
          } 100%.`
        );
        return;
      }
      show("percentage wise");
      ExpenseData = {
        DivisionType: "percentage",
        ExpenseDivision: groupMember.Members.reduce((acc, member) => {
          acc[member.username] = calculateAmountFromPercentage(
            percentages[member.username]
          );
          return acc;
        }, {}),
      };
    }
    setExpenseData(ExpenseData);
    console.log(ExpenseData);
  };

  return (
    <div className="relative bg-gray-800 rounded-lg shadow">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="flex-1">
          <a
            href="#"
            className={`inline-block w-full p-4 rounded-t-lg ${
              equally
                ? "text-orange-600 bg-gray-700 dark:bg-gray-800 dark:text-orange-500"
                : "hover:text-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => {
              setEqually(true);
              setUnequally(false);
              setPercentage(false);
              setError("");
            }}
          >
            Equally
          </a>
        </li>
        <li className="flex-1">
          <a
            href="#"
            className={`inline-block w-full p-4 rounded-t-lg ${
              unequally
                ? "text-orange-600 bg-gray-700 dark:bg-gray-800 dark:text-orange-500"
                : "hover:text-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => {
              setUnequally(true);
              setEqually(false);
              setPercentage(false);
              setError("");
            }}
          >
            Unequally
          </a>
        </li>
        <li className="flex-1">
          <a
            href="#"
            className={`inline-block w-full p-4 rounded-t-lg ${
              percentage
                ? "text-orange-600 bg-gray-700 dark:bg-gray-800 dark:text-orange-500"
                : "hover:text-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => {
              setPercentage(true);
              setEqually(false);
              setUnequally(false);
              setError("");
            }}
          >
            Percentage
          </a>
        </li>
      </ul>
      <div className="p-4 text-white">
        {equally && (
          <div className="flex flex-col items-center justify-between gap-8">
            <div className="flex ">
              <AnimatedSeahorse delay={0} />
              <AnimatedSeahorse delay={0.2} />
              <AnimatedSeahorse delay={0.4} />
            </div>
            {groupMember.Members.map((member) => (
              <div key={member.username} className="relative z-0 input-wrapper">
                <input
                  type="text"
                  id="floating_standard"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer input-field empty"
                  placeholder=" "
                  disabled
                  value={memberAmounts[member.username] || ""}
                />
                <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  {member.username}
                </label>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center">
          
            <div className="flex items-center border border-gray-300 rounded-lg p-2 mb-2">
  <div className="flex flex-col items-center justify-center ">
    <h2 className="text-xl font-bold">{amount}</h2>
    <p className="text-gray-500 text-sm">of {amount}</p>
  </div>

</div>

            </div>
          </div>
        )}
        {unequally && (
          <div className="flex flex-col items-center justify-between gap-8">
            <div className="flex ">
              <AnimatedSeahorse delay={0} />
              <AnimatedSeahorse delay={0.2} />
              <AnimatedSeahorse delay={0.4} />
            </div>

            {groupMember.Members.map((member) => (
              <div key={member.username} className="relative z-0 input-wrapper">
                <input
                  type="number"
                  id="floating_standard"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer input-field empty"
                  placeholder=" "
                  value={unequalAmounts[member.username]}
                  onChange={(e) =>
                    handleUnequalChange(member.username, e.target.value)
                  }
                />
                <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  {member.username}
                </label>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg p-4">
                <div className="flex flex-col justify-center items-center mr-4">
                  <h2 className="text-lg font-bold">{unequalSum.toFixed(2)}</h2>
                  <p className="text-gray-500 text-sm">of {amount}</p>
                </div>
                {!error && (
                  <div className="flex flex-col justify-center items-center">
                    <h2 className="text-lg font-bold">
                      {(amount - unequalSum).toFixed(2)}
                    </h2>
                    <p className="text-gray-500 text-sm">left</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {percentage && (
          <div className="flex flex-col items-center justify-between gap-8">
            <div className="flex ">
              <AnimatedSeahorse delay={0} />
              <AnimatedSeahorse delay={0.2} />
              <AnimatedSeahorse delay={0.4} />
            </div>
            {groupMember.Members.map((member) => (
              <div key={member.username} className="relative z-0 input-wrapper">
                <input
                  type="number"
                  id="floating_standard"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer input-field empty"
                  placeholder=" "
                  value={
                    percentages[member.username] !== undefined
                      ? percentages[member.username]
                      : ""
                  }
                  onChange={(e) =>
                    handlePercentageChange(member.username, e.target.value)
                  }
                />
                <label className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  {member.username}
                </label>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center">
              <div className="flex  items-center border border-gray-300 rounded-lg p-2">
                <div className="flex flex-col items-center justify-center mr-2">
                  <h2 className="text-xl font-bold">{sum.toFixed(2)}%</h2>
                  <p className="text-gray-500 text-sm">of 100%</p>
                </div>
                {!error && (
                  <div className="flex flex-col items-center ml-2">
                    <h2 className="text-lg font-bold">
                      {(100 - sum).toFixed(2)}%
                    </h2>
                    <p className="text-gray-500 text-sm">left</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-red-500 p-5">{error}</p>}
        <div className="flex justify-center items-center mt-4">
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            onClick={handleSetClick}
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};
