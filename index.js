const connectToMongo=require('./db');

const express = require('express')

const app = express()
const port = 4000


//express cors middleware for connection to backend by local host
var cors = require('cors')
app.use(cors())

app.use(express.json())

//available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.get('/', (req, res) => {
  res.send('Hello shehal!')
})

app.listen(port, () => {
  console.log(`Duly Noted backend listening on port ${port}`)
  connectToMongo();
})