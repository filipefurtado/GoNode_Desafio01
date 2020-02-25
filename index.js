const express = require("express");

const server = express();

server.use(express.json());

var projects = [];
var qtyRequests = 0;

server.use((req, res, next) => {
  qtyRequests += 1;
  console.log(`Number of requisitions: ${qtyRequests}`);

  return next();
});

function checkIDExists(req, res, next) {
  const { id } = req.params;
  var ExistsID = false;

  projects.forEach(project => {
    if (project.id === id) {
      ExistsID = true;
    }
  });

  if (ExistsID) {
    return next();
  } else {
    return res.status(400).json({ error: "Inform a valid ID!" });
  }
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  var project = {};
  var tasks = [];

  project = { id: id, title: title, tasks: tasks };
  projects.push(project);

  return res.json(project);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIDExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.forEach(project => {
    if (project.id === id) {
      project.title = title;
    }
  });

  return res.json(projects);
});

server.delete("/projects/:id", checkIDExists, (req, res) => {
  const { id } = req.params;

  projects.forEach((project, index) => {
    if (project.id === id) {
      projects.splice(index, 1);
    }
  });

  return res.send();
});

server.post("/projects/:id/tasks", checkIDExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.forEach(project => {
    if (project.id === id) {
      project.tasks.push(title);

      return res.json(project);
    }
  });
});

server.listen(3000);
