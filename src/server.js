var express = require("express");
var expressWs = require("express-ws");
var expressWs = expressWs(express());
var app = expressWs.app;
const cron = require("node-cron");
var bodyParser = require("body-parser");

const port = process.env.PORT || 8080;

var aWss = expressWs.getWss("");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const sendTime = (ws) => {
  let time = new Date();
  ws.send(JSON.stringify({ data: time.toDateString(), type: "time" }));
};

app.post("/login", urlencodedParser, function (req, res) {
  const user_name = req.body.username;
  res.send("welcome, " + user_name);
  aWss.clients.forEach(function (client) {
    client.send(JSON.stringify(user_name));
  });
});

app.get("/", urlencodedParser, function (req, res) {
  res.send("welcome, to esp world " + port);
});

app.post("/handle_pub_sub", urlencodedParser, (req, res) => {
  //   message decode
  var message = req.body.message;
  var data = atob(message.data);
  console.log("LOGS data : ", data);

  aWss.clients.forEach(function (client) {
    client.send(JSON.stringify({ data: JSON.parse(data), type: "gmail" }));
  });

  res.send(200);
});

app.ws("", (ws) => {
  ws.on("message", (message) => {
    console.log(message);
  });

  cron.schedule("* * * * *", () => {
    sendTime(ws);
  });
});

app.listen(port, () => {
  console.log("server has started");
});
