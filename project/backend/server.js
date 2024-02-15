"use strict";

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());
app.options("*", cors());

const PORT = 8080;
const HOST = "0.0.0.0";

const mysql = require("mysql");
var connection = mysql.createConnection({
  host: "mysql1",
  user: "root",
  password: "admin",
});

connection.connect();

app.post("/createdb", (req, res) => {
  console.log("createdb");

  connection.query(
    `CREATE DATABASE IF NOT EXISTS postsdb`,
    function (error, results) {
      if (error) {
        console.error("creating postsdb Error", error);
        return res.status(500).send("creating postsdb Error");
      }

      connection.query(`USE postsdb`, function (error, results) {
        if (error) {
          console.error("using postsdb Error:", error);
          return res.status(500).send("using postsdb Error");
        }

        connection.query(
          `CREATE TABLE IF NOT EXISTS users (
            id int unsigned NOT NULL auto_increment,
            name varchar(100) NOT NULL,
            password varchar(100) NOT NULL,
            username varchar(100) NOT NULL,
            PRIMARY KEY (id)
          )`,
          function (error, results) {
            if (error) {
              console.error("creating postsdb error:", error);
              return res.status(500).send("creating users Error");
            }
          }
        );

        connection.query(
          `CREATE TABLE IF NOT EXISTS channels (
            id int unsigned NOT NULL auto_increment,
            name varchar(100) NOT NULL,
            num_posts int unsigned DEFAULT 0,
            num_replies int unsigned DEFAULT 0, 
            PRIMARY KEY (id)
          )`,
          function (error, results) {
            if (error) {
              console.error("Error creating channels:", error);
              return res.status(500).send("creating channels Error");
            }
          }
        );

        connection.query(
          `CREATE TABLE IF NOT EXISTS posts (
            id int unsigned NOT NULL auto_increment,
            channel_id int unsigned NOT NULL,
            topic varchar(100) NOT NULL,
            data varchar(500) NOT NULL,
            time varchar(500) NOT NULL,
            user varchar(100) NOT NULL DEFAULT 0,
            PRIMARY KEY (id),
            FOREIGN KEY(channel_id) REFERENCES channels (id) ON DELETE CASCADE
            )`,
          function (error, results) {
            if (error) {
              console.error("Error creating posts:", error);
              return res.status(500).send("creating posts Error");
            }
          }
        );

        connection.query(
          `CREATE TABLE IF NOT EXISTS replies (
            id int unsigned NOT NULL auto_increment,
            user varchar(100) NOT NULL DEFAULT 0,
            post_id int unsigned NOT NULL,
            reply_id int unsigned NOT NULL DEFAULT 0,
            data varchar(500) NOT NULL,
            time varchar(500) NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY(post_id) REFERENCES posts (id) ON DELETE CASCADE
          )`,
          function (error, results) {
            if (error) {
              console.error("Error creating replies:", error);
              return res.status(500).send("creating replies Error");
            }
          }
        );
        res.status(200).send("Database and tables created successfully.");
      });
    }
  );
});

app.post("/addUser", (req, res) => {
  var name = req.body.name;
  var password = req.body.password;
  var username = req.body.username;

  if (name.trim() != "" && password.trim() != "" && username.trim() != "") {
    var query = `INSERT INTO users (name, password, username) VALUES ('${name}', '${password}', '${username}')`;

    connection.query(query, function (error, result) {
      if (error) {
        console.log(error);
        res.status(400).send("Error authenticating user");
      } else {
        res.send("ok");
      }
    });
  } else {
    res.status(400).send("Invalid name or username or password");
  }
});

app.get("/getUsers", (req, res) => {
  connection.query(`SELECT * FROM users`, function (error, results) {
    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).send("Error fetching users");
    }
    res.json(results);
  });
});

app.get("/getUsers/:username", (req, res) => {
  var username = req.params.username;
  connection.query(
    `SELECT * FROM users WHERE username = '${username}'`,
    function (error, results) {
      if (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Error fetching users" });
      }
      res.json(results);
    }
  );
});

app.post("/authenticateUser", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  var query = `SELECT * FROM users WHERE password = '${password}' AND username = '${username}'`;

  connection.query(query, function (error, results) {
    if (error) {
      console.error("Error authenticating user:", error);
      return res.status(500).send("Error authenticating user");
    }

    if (results.length > 0) {
      res.status(200).send("User authenticated successfully");
    } else {
      res.status(401).send("Invalid username or password");
    }
  });
});

app.post("/createChannel", (req, res) => {
  var topic = req.body.topic;

  if (topic.trim() === "") {
    return res.status(400).send("Channel name cannot be empty");
  }

  if (topic.trim() !== "") {
    var query = `INSERT INTO channels (name) VALUES ('${topic}')`;

    connection.query(query, function (error, result) {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Error creating channel" });
      } else {
        res.status(200).json({ message: "Channel created successfully" });
      }
    });
  } else {
    res.status(400).json({ error: "Invalid channel name" });
  }
});

app.get("/getChannels", (req, res) => {
  connection.query(`SELECT * FROM channels`, function (error, results) {
    if (error) {
      throw error;
    } else {
      res.json(results);
    }
  });
});

app.get("/getChannel/:channelId", (req, res) => {
  const channelId = req.params.channelId;

  connection.query(
    `SELECT name FROM channels WHERE id = ?`,
    [channelId],
    function (error, results) {
      if (error) {
        throw error;
      } else {
        if (results.length > 0) {
          res.json({ channelName: results[0].name });
        } else {
          res.status(404).json({ error: "Channel not found" });
        }
      }
    }
  );
});

app.post("/addPost/:channelId", (req, res) => {
  const channel_id = req.params.channelId;
  const topic = req.body.topic;
  const data = req.body.data;
  const date = new Date();
  const username = req.body.username;

  const timeStamp = date.toLocaleString("en-US", {
    timeZone: "America/Regina",
  });
  const time = timeStamp + "";

  const query = `INSERT INTO posts (channel_id, topic, data, time, user) VALUES (?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [channel_id, topic, data, time, username],
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json("Error adding post");
      } else {
        res.json({ message: "Post request sent" });
      }
    }
  );
});

app.post("/updateNumPosts/:channelId", (req, res) => {
  const channelId = req.params.channelId;

  const query = `UPDATE channels SET num_posts = num_posts + 1 WHERE id = ?`;

  connection.query(query, [channelId], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json("Error updating num_posts");
    } else {
      res.json({ message: "Num_posts updated successfully" });
    }
  });
});

app.get("/getPosts/:channelId", (req, res) => {
  const channelId = req.params.channelId;

  connection.query(
    `SELECT * FROM posts WHERE channel_id = ?`,
    [channelId],
    function (error, results) {
      if (error) {
        console.log("Error fetching posts:", error);
        return res.status(500).send("Error fetching posts");
      }
      res.json(results);
    }
  );
});

app.get("/getPost/:postId", (req, res) => {
  const postId = req.params.postId;

  connection.query(
    `SELECT * FROM posts WHERE id = ?`,
    [postId],
    function (error, results) {
      if (error) {
        console.error("Error fetching post:", error);
        return res.status(500).send("Error fetching post");
      }

      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    }
  );
});

app.post("/addReply/:postId", (req, res) => {
  const postId = req.params.postId;
  const data = req.body.data;
  const date = new Date();
  const username = req.body.username;

  const timeStamp = date.toLocaleString("en-US", {
    timeZone: "America/Regina",
  });
  const time = timeStamp + "";

  const query = `INSERT INTO replies (user, post_id, data, time) VALUES (?, ?, ?, ?)`;

  connection.query(query, [username, postId, data, time], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error adding reply");
    } else {
      res.json({ message: "Reply request sent" });
    }
  });
});

app.post("updateNumReplies/:channelId", (req, res) => {
  const channelId = req.params.channelId;
  const query = `UPDATE channels SET num_replies = num_replies + 1 WHERE id = ?`;

  connection.query(query, [channelId], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json("Error updating num_replies");
    } else {
      res.json({ message: "Num_replies updated successfully" });
    }
  });
});

app.get("/getReplies/:postId", (req, res) => {
  const postId = req.params.postId;

  connection.query(
    `SELECT * FROM replies WHERE post_id = ?`,
    [postId],
    function (error, results) {
      if (error) {
        console.error("Error fetching replies:", error);
        return res.status(500).send("Error fetching replies");
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: "Replies not found" });
      }
    }
  );
});

app.post("/addReply/:postId/:replyId", (req, res) => {
  const postId = req.params.postId;
  const replyId = req.params.replyId;
  const data = req.body.data;
  const date = new Date();
  const username = req.body.username;

  const timeStamp = date.toLocaleString("en-US", {
    timeZone: "America/Regina",
  });
  const time = timeStamp + "";

  const query = `INSERT INTO replies (user, post_id, reply_id, data, time) VALUES (?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [username, postId, replyId, data, time],
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error adding reply");
      } else {
        res.json({ message: "Reply request sent" });
      }
    }
  );
});

function search(table, col, target, order, callback) {
  let query = `SELECT * FROM ${table} WHERE ${col} LIKE '%${target}%' ORDER BY ${col} ${order}`;
  connection.query(query, (err, result) => {
    if (err) {
      console.log(`Error in searching for ${target}: ${err}`);
      callback(err, null);
    } else {
      console.log(`Success in searching ${target}`);
      callback(null, result);
    }
  });
}

app.get("/search/:table", (req, res) => {
  search(
    req.params.table,
    req.query.column,
    req.query.target,
    req.query.order,
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.use("/", express.static("."));
app.listen(PORT, HOST);
console.log("up and running");
