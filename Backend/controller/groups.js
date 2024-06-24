import { Groups } from "../models/groups.js";
import { Expense } from "../models/expenses.js";
export const createGroup = async (req, res) => {
  try {
    const group = req.body;
    console.log("recieved group=" + group);

    const sentgroup = await Groups.create(group);
    console.log("created group" + sentgroup);

    res.status(200).json(sentgroup);
  } catch (e) {
    console.log(e);
  }
};

export const addMember = async (req, res) => {
    try {
      const { groupid, user } = req.body;
  
      const group = await Groups.findOne({ GroupId: groupid });
      if (!group) {
        return res.status(404).json({ error: "Group Not Found" });
      }
  
   
      const isUserPresent = group.Members.some((member) => member.username === user.username);
      
      if (!isUserPresent) {
       
        group.Members.push(user);
        group.Settledup.set(user.username, 0);
        await group.save();
        return res.status(200).json({ message: "User added to group", group });
      } else {
        return res.status(400).json({ error: "User already present in the group" });
      }
    } catch (error) {
      console.error('Error adding member to group:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  export const getgroups=async(req,res) => {
    try {
        const username = req.params.username;
    
        const groups = await Groups.find({ 'Members.username': username });
    
        res.status(200).json(groups);
      } catch (error) {
        console.error('Error retrieving groups:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    
  }
  export const getgroupBalance = async (req, res) => {
    try {
      const { GroupId, username } = req.body;
      console.log(username)
    const shownExpense=await Expense.find({GroupId: GroupId,shown:true});
    if(shownExpense.length===0){
      const del=await Expense.deleteMany({GroupId: GroupId})
    }
      const GroupNetBalance = {};
  
      const PaidByyouExpenses = await Expense.find({ GroupId: GroupId, PaidBy: username });
      const NotPaidByyouExpenses = await Expense.find({ GroupId: GroupId, PaidBy: {$ne:username} });
     
      for (let expense of PaidByyouExpenses) {
        let expenseDivision = Object.fromEntries(expense.ExpenseDivision);
        
        for (let member in expenseDivision) {
          if (member !== username) {
            GroupNetBalance[member] = (expenseDivision[member] || 0) + (GroupNetBalance[member] || 0);
       
          }
        }
      }
      for (let expense of NotPaidByyouExpenses) { 
        let expenseDivision = Object.fromEntries(expense.ExpenseDivision);
        
        let paidby=expense.PaidBy;
        for (let member in expenseDivision) {
          if (member === username) {
            GroupNetBalance[paidby] = (-expenseDivision[member] || 0) + (GroupNetBalance[paidby] || 0);
          
            break;
          }
        
        }
      }
          
          
    
  
      res.status(200).json({ success: true, data: GroupNetBalance });
    } catch (error) {
      console.error("Error in getgroupBalance:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };
  
export const deletegroup=async(req,res)=>{
  try {
    const id=req.params.GroupId;
    const result =await Groups.deleteOne({GroupId:id})
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}
export const getRecentActivities = async (req, res) => {
  try {
    console.log("hello world")
    const id = req.params.grpid;

    const group = await Groups.findOne({ GroupId: id });

    if (group) {
      const recent = group.RecentActivities;
      res.status(200).json({ recent });
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
