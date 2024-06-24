import React from "react";
import { useSelector } from "react-redux";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { SettleupExtension } from "./SettleupExtension";

const Settleup = ({ summary, handlemodal, handleextensionmodal,settleupdata }) => {
  const groupMember = useSelector((state) => state.CurrentGroupReducer.ob);

  const handleextension = (index) => {
    handlemodal(false);
    handleextensionmodal(true);
   const key=Object.keys(summary);
   let obj={
    [key[index]]:summary[key[index]]
   }
   settleupdata(obj)

  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
        <div className="relative bg-gray-800 rounded-lg shadow w-full max-w-md mx-4 md:mx-0">
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-600 rounded-t">
            <h3 className="text-lg font-semibold text-white">
              Select a balance to settle up
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-200"
              onClick={() => handlemodal(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-4 md:p-5 text-gray-400 w-full">
            {/* Modal content goes here */}
            <div className="overflow-y-auto p-4">
              {Object.keys(summary).map((key, index) => (
                <div key={index}>
                  <button
                    className="border-orange-500 w-full p-4 rounded-lg shadow-sm border dark:bg-gray-700 hover:dark:bg-gray-900 mt-1 mb-1"
                    onClick={()=>{handleextension(index)}}
                  >
                    {summary[key] < 0 ? (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <h2 className="text-xl font-semibold">You</h2>
                          <FaArrowRightLong className="mx-2 text-red-500" />
                          <h2 className="text-xl font-semibold">{key}</h2>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-red-500">
                            {summary[key] < 0 ? -summary[key] : summary[key]}
                          </h2>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <h2 className="text-xl font-semibold">{key}</h2>
                          <FaArrowRightLong className="mx-2 text-green-500" />
                          <h2 className="text-xl font-semibold">You</h2>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-green-500">
                            {summary[key] < 0 ? -summary[key] : summary[key]}
                          </h2>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
            {/* Form or additional content can be added here */}
          </div>
          <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-600 rounded-b"></div>
        </div>
      </div>
    </>
  );
};

export default Settleup;
