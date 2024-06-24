
import { Expense } from "../models/expenses.js";
import { Groups } from "../models/groups.js";
import cloudinary from "../middleware/cloudinary.js";
import fs from 'fs';
import { promisify } from 'util';
import { error } from "console";
const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];
const unlinkAsync = promisify(fs.unlink);

export const addExpense = async (req, res) => {
  try {
    const { expense } = req.body;

    const parsedExpense = JSON.parse(expense);
    const { GroupId, ExpenseName, Amount, DivisionType, CreatedBy, ExpenseDivision, PaidBy, shown } = parsedExpense;

    if (!GroupId || !ExpenseName || !Amount || !DivisionType || !CreatedBy || !ExpenseDivision || !PaidBy || shown === undefined) {
      console.log("hello")
      return res.status(400).json({ message: "All fields are required" });
    }

    let receiptUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      receiptUrl = result.secure_url;
      await unlinkAsync(req.file.path);
    }

    const expenseData = {
      GroupId,
      ExpenseName,
      Amount,
      DivisionType,
      CreatedBy,
      ExpenseDivision,
      PaidBy,
      shown,
      url: receiptUrl,
    };

    const savedExpense = await Expense.create(expenseData);
    const group = await Groups.findOne({ GroupId });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (savedExpense.shown) {
      group.RecentActivities.unshift(`New Expense added worth ${savedExpense.Amount} added by ${savedExpense.CreatedBy}`);
    } else {
      group.RecentActivities.unshift(`Expense ${savedExpense.ExpenseName} has been recorded by ${savedExpense.CreatedBy}`);
    }

    await group.save();

    console.log(savedExpense);
    return res.status(200).json(savedExpense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while adding the expense" });
  }
};


export const getExpense=async(req,res)=>{
    const groupid=req.params.groupId;
    console.log("exppense needed for group"+groupid)
    try {
        const expenses=await Expense.find({GroupId:groupid})
        console.log("expenses for group="+expenses)
        res.status(200).json(expenses)
        
    } catch (error) {
        console.log(error)
    }
}
export const deleteexpense = async (req, res) => {
  try {
    const id = req.params._id;
    const user = req.params.username;

    // Find the expense to get the GroupId
    const expense = await Expense.findOne({ _id: id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Delete the expense
    const result = await Expense.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Update the group's recent activities if the expense was shown
    if (expense.shown) {
      const GroupId = expense.GroupId;
      const group = await Groups.findOne({ GroupId });
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      group.RecentActivities.unshift(`Expense ${expense.ExpenseName} of ${expense.Amount} deleted by ${user}`);
      await group.save();
    }

    // Respond with success message
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const bargraphtotalexpenses = async (req, res) => {
  try {
    const grpid = req.params.grpid;
    console.log("hello")
 
    
    const expenses = await Expense.find({ GroupId: grpid });
    const monthlyExpenses = {};

    expenses.forEach(exp => {
      let Monthstring = exp.createdAt.toISOString();
      const date = new Date(Monthstring);
      let monthNumber = date.getMonth();  
      let monthName = months[monthNumber];
      
      if (!monthlyExpenses[monthName]) {
        monthlyExpenses[monthName] = 0;
      }
      
      monthlyExpenses[monthName] += exp.Amount;  
    });

    const data = Object.keys(monthlyExpenses).map(month => {
      return { Month: month, TotalExpenses: monthlyExpenses[month] };
    });

    res.json(data);  

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

   
export const PieChartExpense=async(req,res) => {

  try {
    const grpid=req.params.grpid;
    const expenses=await Expense.find({GroupId:grpid,shown:true})
    const group=await Groups.findOne({GroupId:grpid})
    let members = group.Members.reduce((acc, mem) => {
      acc.push({ name: mem.username, amount: 0 });
      return acc;
    }, []);
    let memberTotals = {};


expenses.forEach(expense => {

  let paidBy = expense.PaidBy;
  let amount = expense.Amount;

 
  if (paidBy in memberTotals) {
    memberTotals[paidBy] += amount;
  } else {
    memberTotals[paidBy] = amount;
  }
});


members.forEach(member => {
  member.amount = memberTotals[member.name] || 0;
});
res.status(200).json(members)

  } catch (e) {
console.log(e)    
  }
  
}
