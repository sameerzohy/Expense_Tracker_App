
const ExpenseSchema = require('../models/expenseModel');
// const authMiddleware = require('../controllers/auth');


exports.addExpense = async (req, res) => {
    const {title, amount, category, description, date} = req.body;
    const Expense = ExpenseSchema({
        title,
        amount,
        category,
        description,
        date,
        user:req.user.id
    })
    console.log(ExpenseSchema);
    try{
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required'});
        }
        if( !amount === 'number' || amount <= 0){
            return res.status(400).json({message:'Enter a valid Amount'});
        }
        await Expense.save();
        res.status(200).json({message:'Expense Added'});
    }catch(error){
        res.status(500).json({message:'Server Error'});
    }
}

exports.getExpense = async(req, res) => {
    console.log('hello');
    try{
        const Expenses = await ExpenseSchema.find({ user: req.user.id }).sort({createdAt: -1});
        res.status(200).json(Expenses);
    }catch(error){
        res.status(500).json({message:'Server Error'});

    }
}

exports.deleteExpense = async(req, res) => {
    const id = req.params.id;
    ExpenseSchema.findOneAndDelete({ _id: id, user: req.user.id })
    .then((expense) => {
        res.status(200).json({message:'Expense Deleted.'});
    })
    .catch((err) => {
        res.status(500).json({message:'Cannot Delete Expense'});
    })
    // ExpenseSchema.findByIdAndDelete(id)

}