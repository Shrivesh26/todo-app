const Todo = require('../models/todo');

const createTodo = async (req, res)=>{
  try {
    const newTodo = await Todo.create({
      title: req.body.title,
      completed: req.body.completed,
      user: req.user._id
    });

    res.status(201).json({message: "Todo created successfully", todo: newTodo});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message});
  }
}

const getTodo = async (req, res)=>{
    try {
        const todos = await Todo.find({user: req.user._id});
        res.status(201).json({message:"Fetched data...", todos});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
}

const updateTodo = async (req,res)=>{
    try {
        const updatedField = await Todo.findByIdAndUpdate(req.params.id, {title: req.body.title ,completed: req.body.completed}, {new: true});
        // const updatedField = await Todo.findByIdAndUpdate(req.params.id, {completed: req.body.completed}, {new: true}); //for the patch req
        res.status(201).json({message:"Todo Updated...", updatedField});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
}

const deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if(!deletedTodo){
            return res.status(404).json({message: "Todo not found"});
        }
        res.status(201).json({message: "Todo Deleted...", deletedTodo});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
}

module.exports = { createTodo, getTodo, updateTodo, deleteTodo };