import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { baseurl } from "../../util";
import ReactLoading from "react-loading";

export const RecentActivities = () => {
  const currentgroup = useSelector((state) => state.CurrentGroupReducer.ob) || {};
  const expense = useSelector((state) => state.ExpenseReducer.Expenses) || [];
  const [recentActivities, setRecentActivities] = useState([]);
  const user = useUser().user;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      setError(null);

      if (!currentgroup.GroupId) {
        setError("GroupId is undefined");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseurl}/group/RecentActivities/${currentgroup.GroupId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const recent = await response.json();
          setRecentActivities(recent.recent);
        } else {
          setError("Failed to fetch recent activities");
        }
      } catch (error) {
        setError("An error occurred while fetching recent activities");
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [currentgroup, expense]);

  const replaceUsername = (activityString) => {
    const words = activityString.split(' ');

    const replacedWords = words.map((word) => {
      if (word === user.username) {
        return 'you';
      }
      return word;
    });

    return replacedWords.join(' ');
  };

  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
     <div className="p-1 bg-gray-50 dark:bg-gray-700 border border-orange-500 rounded-lg shadow-sm flex justify-center items-center w-3/4 ml-6 hover:bg-gray-800">
      <h2 className="text-2xl font-bold  text-gray-900 dark:text-white">
        Recent Activities
      </h2>
      </div> 
      <hr className="border-t border-orange-400 my-4 mx-0" />
      <div className="h-56 overflow-y-auto">
        {loading ? (
          <div className=" flex items-center justify-center">
          <ReactLoading type="spin" color="#fff" />
          </div>
        ) : error ? (
          <div className="text-sxl text-gray-500">Nothing Recent</div>
        ) : recentActivities.length > 0 ? (
          recentActivities.map((activity, index) => (
            <div key={index}>
              <div className="border-orange-500 w-full p-4 rounded-lg shadow-sm border dark:bg-gray-700 hover:dark:bg-gray-900 text-white mt-2 mb-2 mr-1">
                {replaceUsername(activity)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-orange-400">No recent activities available.</div>
        )}
      </div>
      <hr className="border-t border-orange-400 my-4 ml-10 mr-10 mt-4" />
      
    </div>
  );
};
