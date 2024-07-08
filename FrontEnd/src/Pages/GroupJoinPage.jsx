import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import { baseurl } from "../../util";
export const GroupJoinPage = () => {
  const { user } = useUser();
  const [error, seterror] = useState()
  const navigate = useNavigate();


  const { groupid } = useParams();
  const data = {
    groupid, 
    user: {
      userid: user.id,
      username: user.username,
      FullName: user.fullName,
      FirstName: user.firstName,
      PhoneNumber: user.primaryPhoneNumber.phoneNumber,
      email: user.primaryEmailAddress.emailAddress,
    },
  };
  useEffect(() => {
    const joingrpmethod = async () => {

      try {
        const response = await fetch(`${baseurl}/group/addMember`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if(response.ok){
            console.log("Memeber added succesfully")
            navigate("/combined")
        }
      } catch (e) {
seterror(e);
        console.log(e);
      }
    };
    joingrpmethod();
  }, []);

  return   <div className="bg-gradient-to-l from-zinc-900 via-gray-700 to-slate-800 min-h-screen relative">
    <div className="flex flex-col items-center justify-center py-32">
   <AiFillCloseCircle className="text-orange-500 h-40 w-40" />
   <h1 className="text-3xl text-red-500">You have already joined the group or check the link </h1>
   <button className="bg-orange-500 border rounded-sm border-orange-500 p-2 text-white mt-4 hover:bg-orange-900" onClick={()=>{navigate("/combined")}}>
    redirect to main site
   </button>
   </div>
    </div>;
};
