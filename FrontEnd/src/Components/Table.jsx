import { CreateGroupCard } from "./CreateGroupCard";
import { MdOutlineDelete } from "react-icons/md";
import { RiGroupFill } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { GiCrossMark } from "react-icons/gi";
import { add } from "../redux/CurrentGroupReducer";
import { useDispatch } from "react-redux";
import { addGroup } from "../redux/GroupReducers";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import WarningComponent from "./WarningComponent";
import { FaLink } from "react-icons/fa6";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { IoStatsChartSharp } from "react-icons/io5";

import Statistics from "./Statistics";
export const Table = () => {
  const [displayedGroups, setDisplayedGroups] = useState([]);
  const [addCreateCard, setAddCreateCard] = useState(false);
  const [search, setSearch] = useState("");
  const [showcard, setshowcard] = useState(false);
  const [modal, setmodal] = useState(false);
  const [grpid, setgrpid] = useState();
  const [overlay, setoverlay] = useState(false)
  const dispatch = useDispatch();

  const groups = useSelector((state) => state.GroupReducer.groups);
  const currentgroup = useSelector((state) => state.CurrentGroupReducer.ob);
  useEffect(() => {
    if (groups.length === 0) {
      dispatch(add({ Groups: "" }));
    }
  }, [dispatch, groups.length]);

  useEffect(() => {
    if (search === "") {
      setDisplayedGroups(groups);
    } else {
      const filteredGroups = groups.filter((group) =>
        group.GroupName.toLowerCase().includes(search.toLowerCase())
      );
      setDisplayedGroups(filteredGroups);
    }
  }, [search, groups]);

  const clearSearch = () => {
    setSearch("");
  };

  const handleFormData = async (formData) => {
    const groupWithColor = {
      ...formData,
      Color: getRandomColor(),
    };
    console.log(groupWithColor);
    try {
      const response = await fetch("http://localhost:8000/group/createGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupWithColor),
      });
      if (response.ok) {
        console.log("Group Created Successfully");
      }
    } catch (error) {
      console.log(error);
    }
    console.log(groupWithColor);
    const newGroups = [...groups, groupWithColor]; // Define newGroups with the updated array
    dispatch(addGroup(newGroups)); // Dispatch the action with the correct payload
    setDisplayedGroups(newGroups);
    setAddCreateCard(false);
    setshowcard(false);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const handleDelete = async () => {
    try {
      let id = grpid;
      const response = await fetch(`http://localhost:8000/group/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const newGroups = groups.filter((group) => group.GroupId !== id);
        dispatch(addGroup(newGroups));
        setDisplayedGroups(newGroups);
        if (currentgroup.GroupId === id) {
          dispatch(add({ Groups: "" }));
        }
        setmodal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">
      {showcard && (
        <CreateGroupCard setshowcard={setshowcard} onSubmit={handleFormData} />
      )}
      <div
        className={`ml-3 ${
          addCreateCard ? "blur-sm" : ""
        }`}
      >
        <div
          className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden"
          style={{ height: "650px" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    disabled={groups.length === 0}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={clearSearch}
                    >
                      <GiCrossMark />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <button
                type="button"
                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                style={{ background: "rgb(255,134,8,1)" }}
                onClick={() => setshowcard(true)}
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Add group
              </button>
            </div>
          </div>
          <div className="overflow-y-auto p-4 max-h-[500px]">
            {displayedGroups.length > 0 ? (
              <div className="space-y-4">
                {displayedGroups.map((group, index) => (
                  <div
                  key={index}
                  className={`p-4 border border-orange-500 rounded-lg shadow-sm flex justify-between items-center hover:dark:bg-gray-900 ${
                    group.GroupName === currentgroup.GroupName ? 'bg-blue-200 dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                  onClick={() => dispatch(add(group))}
                >
                    <div className="flex items-center space-x-4">
                      <RiGroupFill
                        style={{ color: group.Color, fontSize: "2rem" }}
                      />
                      <div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {group.GroupName}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center">
                          {group.Members.map((member, memberIndex) => (
                            <div
                              key={memberIndex}
                              className="flex items-center mr-2"
                            >
                              <CiUser />
                              <span className="ml-1">{member.username}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setgrpid(group.GroupId);
                        console.log();
                        setmodal(true);
                      }}
                    >
                      <MdOutlineDelete />
                    </button>
                    <button onClick={()=>{setoverlay(true)}}>
                    <IoStatsChartSharp  className="text-orange-500"/>

                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(group.link);
                        toast("Copied successfully !");
                      }}
                    >
                      <FaLink className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-11 mb-11">
                No groups yet. Click on "Add group" button to create a new
                group.
              </div>
            )}
          </div>
        </div>
      </div>
      {overlay&& <Statistics over={setoverlay}/>}
      {modal && (
        <WarningComponent close={setmodal} Sure={handleDelete}>
          Are you sure you want to delete this Group?
        </WarningComponent>
      )}
      <ToastContainer
        containerId="containerA"
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
      />
    </div>
  );
};
