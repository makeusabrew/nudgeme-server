# nudgeme [server]

Backend service for [nudgeme-client](https://github.com/makeusabrew/nudgeme-client). Currently deployed using [now](https://zeit.co/now).

## Hosting your own instance

Download, `npm install`, `npm start`.

## Pointing a client at your instance

The CLI client reads config data from `~/.nudgeme.json`. Add a custom `host` key to override the default:

```
{
  "email": "your@email.com",
  "host": "https://your-instance.com:1234"
}
```

You'll also need to set the `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` environment variables as [mailgun](https://mailgun.com) is used to actually send emails.
