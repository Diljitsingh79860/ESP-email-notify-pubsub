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
  ws.send(JSON.stringify({ data: time.toDateString() }));
};

const sendPubSubData = (ws, data) => {
  ws.send(data);
};

app.post("/login", urlencodedParser, function (req, res) {
  res.send("welcome, " + req.body.username);
});

app.get("/", urlencodedParser, function (req, res) {
  res.send("welcome, to esp world");
});

app.post("/handle_pub_sub", urlencodedParser, (req, res) => {
  console.log("hello", req.body);

  //   message decode
  var message = JSON.parse(e.postData.getDataAsString()).message;
  var data = atob(message.data);

  //   var ss = SpreadsheetApp.openById(
  //     "1locXz7GUHhwMnECP_rB4YqvsjyvWNVFZqH_AIi6fxqQ"
  //   ).getSheets()[0];
  //   ss.appendRow([new Date(), message.message_id, data, message]);

  aWss.clients.forEach(function (client) {
    client.send(JSON.stringify({ ...data, notification_type: "gmail" }));
  });

  res.send(200);
});

app.ws("", (ws) => {
  ws.on("message", (message) => {
    console.log(message);
    ws.send(JSON.stringify({ data: name }));
  });

  // ws.send("ok");
  console.log("ok");

  //   cron.schedule("* * * * * *", () => {
  //     sendTime(ws);
  //   });
});

app.listen(port, () => {
  console.log("server has started");
});
