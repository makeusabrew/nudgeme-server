const Mailgun = require("mailgun-js");
const express = require("express");
const bodyParser = require("body-parser");
const chrono = require("chrono-node");

const app = express();

app.use(bodyParser.json());

app.post("/nudge", (req, res) => {
  console.log("Got nudge");

  const when = chrono.parseDate(req.body.when);
  const meta = chrono.parse(req.body.when)[0];

  console.log("Parsed date", when, meta);

  const email = req.body.email;
  const text = req.body.when.substr(meta.index + meta.text.length + 1);

  console.log("Nudge text", text);

  const delay = when.getTime() - Date.now();

  setTimeout(() => {
    console.log("Executing nudge");

    const mailgun = Mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    });

    const data = {
      from: "hello@seethrough.it",
      to: email,
      subject: "Nudge: " + text.substr(0, 80),
      text: text
    };

    mailgun.messages().send(data, (err, body) => {
      console.log(err, body);
    });
  }, delay);

  return res.json({
    success: true,
    now: meta.ref,
    in: delay,
    at: when
  });
});

app.listen(7777);

console.log("Listening");
