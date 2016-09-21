const Mailgun = require("mailgun-js");
const express = require("express");
const bodyParser = require("body-parser");
const chrono = require("chrono-node");

const app = express();

app.use(bodyParser.json());

app.post("/nudge", (req, res) => {
  console.log("Got nudge");

  const email = req.body.email;
  const when = chrono.parseDate(req.body.when);

  if (!when) {
    return res.json({
      success: false,
      message: `Could not parse '${req.body.when}' as a date`
    });
  }

  if (!email) {
    return res.json({
      success: false,
      message: `No email address supplied`
    });
  }

  const meta = chrono.parse(req.body.when)[0];
  const text = req.body.when.substr(meta.index + meta.text.length + 1) || "Nudge!";

  console.log("Parsed date", when, meta);
  console.log("Nudge text", text);

  const delay = when.getTime() - Date.now();

  setTimeout(() => {
    console.log("Executing nudge");

    const mailgun = Mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    });

    const data = {
      from: `hello@${process.env.MAILGUN_DOMAIN}`,
      to: email,
      subject: "Nudge: " + text.substr(0, 80),
      text: text
    };

    mailgun.messages().send(data, (err, body) => {
      if (err) {
        console.log("Error queueing mail", err);
      } else {
        console.log("Mail queued ok", body.id);
      }
    });
  }, delay);

  return res.json({
    success: true,
    now: meta.ref,
    in: delay,
    at: when
  });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  return res.status(500).json({
    success: false,
    message: "Something went wrong"
  });
});

app.listen(7777);

console.log("Listening");
