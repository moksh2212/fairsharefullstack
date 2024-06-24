import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GiCrossMark } from "react-icons/gi";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid";
import { FaCopy } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import { useMemo } from "react";
export const CreateGroupCard = ({ onSubmit, setshowcard }) => {
  const { user } = useUser();

  const uniqueId = useMemo(() => uuidv4(), []);
  const link = `http://localhost:5173/group-join/${uniqueId}`;


  const [members, setMembers] = useState([user.username]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitForm = (data) => {
    const Settledup={
      [user.username]:0,
    }
    const formData = { ...data,link:link,GroupId:uniqueId,Settledup:Settledup,Members:[{
      userid: user.id,
      username: user.username,
      FullName: user.fullName,
      FirstName: user.firstName,
      PhoneNumber: user.primaryPhoneNumber.phoneNumber,
      email: user.primaryEmailAddress.emailAddress,
    }]
    
};

    onSubmit(formData);
    setshowcard(false);
  };


  const handleRemoveMember = (memberToRemove) => {
    setMembers(members.filter((member) => member !== memberToRemove));
  };

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Group
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => {
                setshowcard(false);
              }}
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
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form className="p-4" onSubmit={handleSubmit(onSubmitForm)}>
            <div className="grid gap-4 mb-4">
              <div className="col-span-2">
                <label
                  htmlFor="GroupName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Group Name
                </label>
                <input
                  type="text"
                  name="GroupName"
                  id="GroupName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter the Group Name"
                  {...register("GroupName", {
                    required: {
                      value: true,
                      message: "Group name is required",
                    },
                    minLength: { value: 3, message: "Min length is 3" },
                    maxLength: { value: 8, message: "Max length is 8" },
                  })}
                />
                {errors.GroupName && (
                  <span className="text-red-600 text-sm mt-1">
                    {errors.GroupName.message}
                  </span>
                )}
              </div>
              <div className="col-span-2">
                <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <div className="flex justify-center items-center">
                    <h2 className="text-white">{link}</h2>
                    <FaCopy
                      className="text-white text-5xl p-2 cursor-pointer bg-transparent hover:bg-blue-500 rounded transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                        toast("Copied successfully !");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800"
            >
              Create Group
            </button>
            <ToastContainer
            containerId="containerB"
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
          </form>
        </div>
      </div>
    </div>
  );
};
