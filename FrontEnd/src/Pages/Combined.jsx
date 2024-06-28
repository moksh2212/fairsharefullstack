import React, { useState, useEffect, useMemo } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Table } from "../Components/Table";
import { ExpenseTable } from "../Components/ExpenseTable";
import { AddExpenseCard } from "../Components/AddExpenseCard";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addGroup } from "../redux/GroupReducers";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { GroupSummary } from "../Components/GroupSummary";
import { RecentActivities } from "../Components/RecentActivities";
import "react-toastify/dist/ReactToastify.css";

export const Combined = () => {
  const dispatch = useDispatch();
  const socket = useMemo(
    () =>
      io("localhost:8000", {
        withCredentials: true,
      }),
    []
  );
  const currentgroup = useSelector((state) => state.CurrentGroupReducer.ob);
  const NewExpense = useSelector(
    (state) => state.NewExpenseReducer.NewExpenses
  );
  const { user } = useUser();
  const [showExpenseCard, setShowExpenseCard] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("newly-connected", user);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (message) => {
      if (message && message.Expense && message.Expense.CreatedBy) {
        toast(
          <div className="text-lg font-bold text-orange-300">
            💼 Heads up! A new expense just arrived in{" "}
            <span className="text-blue-500">{message.room}</span> by{" "}
            <span className="text-yellow-500">{message.Expense.CreatedBy}</span>
            ! 💸
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            className: "bg-gray-800",
          }
        );
      }
      console.log("new notification", message);
    });

    socket.on("notifications", (messages) => {
      console.log("lately received", messages);
      messages.forEach((message) => {
        toast(
          <div className="text-lg font-bold text-orange-300">
            💼 Heads up! A new expense just arrived in{" "}
            <span className="text-blue-500">{message.room}</span> by{" "}
            <span className="text-yellow-500">{message.Expense.CreatedBy}</span>
            ! 💸
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            className: "bg-gray-800",
          }
        );
      });
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("receive-message");
      socket.off("notifications");
    };
  }, [socket, user]);

  useEffect(() => {
    if (currentgroup.GroupName !== "") {
      socket.emit("join-room", currentgroup.GroupName, user.username);
    }
  }, [currentgroup, socket, user.username]);

  useEffect(() => {
    if (currentgroup.GroupName !== "" && NewExpense.length !== 0) {
      socket.emit("message", {
        message: NewExpense[NewExpense.length - 1],
        room: currentgroup.GroupName,
      });
    }
  }, [NewExpense, socket, currentgroup.GroupName]);

  useEffect(() => {
    const sendUserData = async () => {
      const data = {
        userid: user.id,
        username: user.username,
        FullName: user.fullName,
        FirstName: user.firstName,
        PhoneNumber: user.primaryPhoneNumber.phoneNumber,
        email: user.primaryEmailAddress.emailAddress,
      };
      console.log(data);
      try {
        const response = await fetch("http://localhost:8000/user/createUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          console.log("User Data sent successfully");
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const response = await fetch(
          `http://localhost:8000/group/getgroups/${user.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const groups = await response.json();
          dispatch(addGroup(groups));
          console.log("Group data fetched successfully");
        } else {
          console.error("Failed to fetch group data");
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (user) {
      sendUserData();
    }
  }, [user, dispatch]);

  return (
    <div className="bg-gradient-to-l from-zinc-900 via-gray-700 to-slate-800 min-h-screen relative">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>

      {showExpenseCard && (
        <AddExpenseCard setShowExpenseCard={setShowExpenseCard} />
      )}

      <div className="flex flex-col items-center">
        <img
          src="logo.png"
          alt="Logo"
          className="mb-8 mt-1"
          style={{ height: "6rem" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-0 p-0">
          <div className="w-full">
            <Table />
          </div>
          <div className="w-full">
            <ExpenseTable setShowExpenseCard={setShowExpenseCard} />
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-5 ml-4">
          <RecentActivities />
          <GroupSummary />
        </div>
      </div>
    </div>
  );
};
