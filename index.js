require('dotenv').config()
const uuid = require('uuid')
const app = require('express')()
const bodyParser = require('body-parser')
const nedb = require('nedb-promises')
const Nexmo = require('nexmo')
const nunjucks = require('nunjucks')
const port = process.env.PORT || 80

const organizerNumbers = process.env.NUMBERS.split(',') // replace with array of strings

const nexmo = new Nexmo({ 
  apiKey: process.env.NEXMO_KEY, 
  apiSecret: process.env.NEXMO_SECRET,
  applicationId: process.env.NEXMO_APPLICATION_ID,
  signatureSecret: process.env.NEXMO_SIGNATURE_SECRET,
  signatureMethod: process.env.NEXMO_SIGNATURE_METHOD,
  privateKey: Buffer.from(process.env.NEXMO_PRIVATE_KEY_64, 'base64')
}, {debug: true})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
nunjucks.configure('views', { express: app })

const recordingsDb = nedb.create({ filename: 'data/recordings.db', autoload: true })
const messagesDb = nedb.create({ filename: 'data/messages.db', autoload: true })

app.get('/answer', async (req, res) => {
  const conferenceId = uuid.v4()

  for(let organizerNumber of organizerNumbers) {
    nexmo.calls.create({
      to: [{ type: 'phone', number: organizerNumber }],
      from: { type: 'phone', number: process.env.NEXMO_NUMBER },
      ncco: [
        { action: 'conversation', name: conferenceId, machine_detection: 'hangup' }
      ]
    })
  }

  res.json([
    { action: 'talk', voiceName: 'Amy', text: 'Thank you for calling the incident response line. We\'re connecting you to an organizer now.' },
    { action: 'conversation', name: conferenceId, record: true }
  ])
})

app.post('/event', async (req, res) => { 
  if(req.body.recording_url) {
    await recordingsDb.insert(req.body)
  }
  res.status(200).end()
})

app.post('/sms', async (req, res) => {
  await messagesDb.insert(req.body)

  for(let organizerNumber of organizerNumbers) {
    nexmo.channel.send(
      { type: 'sms', number: organizerNumber },
      { type: 'sms', number: process.env.NEXMO_NUMBER },
      { content: { type: 'text', text: `From ${req.body.msisdn}\n\n${req.body.text}` } }
    )
  }

  nexmo.channel.send(
    { type: 'sms', number: req.body.msisdn },
    { type: 'sms', number: process.env.NEXMO_NUMBER },
    { content: { type: 'text', text: 'Thank you for sending us a message. Organizers have been made aware and may be in touch for more information.' } }
  )

  res.status(200).end()
})

app.listen(port, "0.0.0.0")
