const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  req.user = user;

  return next();
}

app.post("/users", (req, res) => {
  const { name, username } = req.body;

  const useralreadyExist = users.find((user) => user.username === username);

  if (useralreadyExist) {
    return res.status(400).json({ error: "user already exist" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return res.status(201).send();
});

app.get("/todos", checksExistsUserAccount, (req, res) => {
  const { user } = req;

  return res.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (req, res) => {
  const { user } = req;

  const { title, deadline } = req.body;

  const todosDetails = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todosDetails);

  return res.status(201).json(todosDetails);
});

/**
 * os "params" são os parâmetros da rota, ou seja, aquilo que é passado pelo link
 */
app.put("/todos/:id", checksExistsUserAccount, (req, res) => {
  const { user } = req;
  const { title, deadline } = req.body;
  const { id } = req.params;

  /**
   * usando esse metodo somento o "todos" já existente será atualizado
   */
  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "todos not found" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return res.status(201).send();
});

app.patch("/todos/:id/done", checksExistsUserAccount, (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "todos not found" });
  }

  todo.done = true;

  return res.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndex) {
    return res.status(404).json({ error: "todos not found" });
  }

  user.todos.splice(todoIndex, 1)

  return res.status(204).send()
});

module.exports = app;
