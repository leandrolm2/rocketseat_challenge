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

  return res.status(201).send();
});

app.put("/todos/:id", checksExistsUserAccount, (req, res) => {});

app.patch("/todos/:id/done", checksExistsUserAccount, (req, res) => {});

app.delete("/todos/:id", checksExistsUserAccount, (req, res) => {});

module.exports = app;
