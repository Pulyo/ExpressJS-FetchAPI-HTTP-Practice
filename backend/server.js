import express from "express";
import fs from "fs/promises";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(
  "/edit/users",
  express.static(path.join(__dirname, "..", "frontend/home"))
);

app.get("/api/users", async (req, res) => {
  try {
    const rawData = await fs.readFile("./data.json", "utf8");
    const data = JSON.parse(rawData);
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/users", async (req, res) => {
  console.log(req.body.name);
  try {
    const rawData = await fs.readFile("./data.json", "utf8");
    const data = JSON.parse(rawData);
    const userIds = data.map((user) => user.id);
    let maxId = 0;
    if (userIds.length === 0) {
      maxId = 0;
    } else {
      maxId = Math.max(...userIds);
    }
    const newUser = {
      id: maxId + 1,
      name: req.body.name,
      age: req.body.age,
    };
    data.push(newUser);
    await fs.writeFile("./data.json", JSON.stringify(data), "utf8");
    res.redirect("/edit/users");
  } catch (error) {
    console.log(error);
  }
});

app.patch("/api/users/:id", (req, res) => {

});

app.put("/api/users/:id", async (req, res) => {
  try {
    const rawData = await fs.readFile("./data.json", "utf8");
    const data = JSON.parse(rawData);
    const user = data.reduce((good, all) => {
      return good.id === +req.body.id ? good : all
    })
    user.name = req.body.name;
    user.age = req.body.age;
    await fs.writeFile("./data.json", JSON.stringify(data), "utf8");
    res.sendStatus(200)
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const rawData = await fs.readFile("./data.json", "utf8");
  const data = JSON.parse(rawData);
  const newData = data.filter((user) => {
    return user.id !== +req.params.id;
  });
  await fs.writeFile("./data.json", JSON.stringify(newData), "utf8");
  res.sendStatus(200);
});


app.listen(3000, () => {
  console.log("listen on: http://localhost:3000/edit/users");
});
