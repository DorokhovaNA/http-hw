const port = 5000;
const express = require('express');
const app = express();

const fs = require("fs");

const user = {
	id: 123,
	username: 'testuser',
	password: 'qwerty'
};

app.use("/auth", (req, res) => {
  if (req.method === "POST") {
    if ("testuser" === user.username && "qwerty" === user.password) {
      res.cookie("UserID", `${user.id}`, {
        maxAge: 3600 * 48,
        path: "/",
        domain: "localhost",
      });
      res.cookie("Authorized", "true", {
        maxAge: 3600 * 48,
        path: "/",
        domain: "localhost",
      });
      res.status(200).send("Вы успешно авторизованы!");
    } else {
      res.status(400).send("Неверный логин или пароль");
    }
  } else {
    res.status(405).send("HTTP method not allowed");
  }
});

app.use("/post", (req, res) => {
  if (req.method === "POST") {
    if (
      req.cookies["UserID"] === `${user.id}` &&
      req.cookies["Authorized"] === "true"
    ) {
      try {
        let content = req.body.content;
        let filename = req.body.filename;
        fs.writeFileSync(`./files/${filename}`, `${content}`, {
          encoding: "utf-8",
          flag: "a",
        });
      } catch (err) {
        res.status(500).send("Internal server error");
      }
      res.status(200).send("Файл успешно записан!");
    } else {
      res.status(200).send("Авторизуйтесь для записи файла");
    }
  } else {
    res.status(405).send("HTTP method not allowed");
  }
});

app.use("/delete", (req, res) => {
  if (req.method === "DELETE") {
    if (
      req.cookies["UserID"] === `${user.id}` &&
      req.cookies["Authorized"] === "true"
    ) {
      try {
        let filename = req.body.filename;
        if (fs.existsSync(`./files/${filename}`)) {
          fs.unlinkSync(`./files/${filename}`);
        }
      } catch (err) {
        res.status(500).send("Internal server error");
      }
      res.status(200).send("Файл успешно удален!");
    } else {
      res.status(200).send("Авторизуйтесь для удаления файла");
    }
  } else {
    res.status(405).send("HTTP method not allowed");
  }
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
