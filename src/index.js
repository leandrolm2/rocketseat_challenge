const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  
}

app.post('/users', (request, response) => {
  
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  
});

module.exports = app;