const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _USERS = require("./users.json");

const app = express();
const port = 8001;

const connection = new Sequelize("db", "user", "pass", {
  host: "localhost",
  dialect: "sqlite",
  storage: "testdb.sqlite",
  operatorsAliases: false,
  define: {
    freezeTableName: true,
  },
});

const User = connection.define("User", {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
});

app.put("/update", (req, res) => {
  User.update(
    {
      name: "michael keaton",
      password: "password",
    },
    { where: { id: 1 } }
  )
    .then((rows) => {
      res.json(rows);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

app.get("/findall", (req, res) => {
  User.findAll({
    where: {
      name: {
        [Op.like]: "M%",
      },
    },
  })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

app.post("/post", (req, res) => {
  const newUser = req.body.user;
  User.create(newUser)
    .then((user) => {
      res.JSON(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

connection
  .sync({
    // logging: console.log,
  })
  //   .then(() => {
  //     User.bulkCreate(_USERS)
  //       .then((users) => {
  //         console.log("Success adding users");
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   })
  .then(() => {
    console.log("Connection to database established successfully");
  })
  .catch((err) => {
    console.error("unable to connect to the database:", err);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
