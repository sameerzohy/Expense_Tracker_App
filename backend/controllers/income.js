
const IncomeSchema = require('../models/incomeModel');
const {db} = require('../db/db');

exports.addIncome = async (req, res) => {
    db();
    const {title, amount, category, description, date} = req.body;
    console.log('Add Income Controller');
    const income = IncomeSchema({
        title,
        amount,
        category,
        description,
        date,
        user:req.user.id
    })
    console.log(IncomeSchema);
    try{
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required'});
        }
        if( !amount === 'number' || amount <= 0){
            return res.status(400).json({message:'Enter a valid Amount'});
        }
        await income.save();
        console.log('Income Added');
        res.status(200).json({message:'Income Added'});
    }catch(error){
        res.status(500).json({message:'Server Error'});
    }
}

exports.getIncomes = async(req, res) => {
    db();
    console.log('hello');
    try{
        const incomes = await IncomeSchema.find({ user: req.user.id }).sort({createdAt: -1});
        res.status(200).json(incomes);
    }catch(error){
        res.status(500).json({message:'Server Error'});

    }
}

exports.deleteIncome = async(req, res) => {
    db();
    const id = req.params.id;
    IncomeSchema.findOneAndDelete({ _id: id, user: req.user.id })
    .then((income) => {
        res.status(200).json({message:'Income Deleted.'});
    })
    .catch((err) => {
        res.status(500).json({message:'Cannot Delete Income'});
    })
}