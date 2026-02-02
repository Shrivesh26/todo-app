const express = require('express');
const app = express.Router();
const {createTodo, getTodo, updateTodo, deleteTodo} = require('../controllers/todoController');
const { authenticate } = require('../middleware/authorize');

app.get("/fetch", authenticate, getTodo);
app.post('/create', authenticate, createTodo);
app.put("/update/:id", authenticate, updateTodo);
// app.patch("/update/:id", updateTodo);
app.delete("/delete/:id", authenticate, deleteTodo);

module.exports = { todoRoutes: app };