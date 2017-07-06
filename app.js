const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const application = express();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Todo = require('./models/todos');



application.use('/static', express.static('static'));
application.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/TodosApplication')


application.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
})

// put routes here

application.get('/api/todos', async (request, response) => {
    var todos = await Todo.find().sort({'order');
    response.json(todos);
});

application.get('/api/todos/:id', async (request, response) => {
    var id = request.params.id;
    var todo = await Todo.find( { _id: id } )
    
    if (!todo) {
        response.status(404);
        return response.end()
    }
    
    response.json(todo);
});

application.post('/api/todos', async (request, response) => {
    let newTodo = new Todo({
        title: request.body.title,
        order: request.body.order,
        completed: request.body.completed
    })
    await newTodo.save();

});

application.put('/api/todos/:id', async (request, response) => {
    let id = request.params.id;
    await Todo.findOneAndUpdate(
        { _id: id },
        { $set: {
            title: request.body.title,
            order: request.body.order,
            completed: request.body.completed
        }});
    let todos = await Todo.find();
    response.json(todos)
});

application.delete('/api/todos/:id', async (request, response) => {
    let id = request.params.id;
    await Todo.findOneAndRemove({ _id: id });
    let todos = await Todo.find();
    response.json(todos)
});

application.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
