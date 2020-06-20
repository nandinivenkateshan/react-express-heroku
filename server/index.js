const express = require('express')
const db = require('./query')
const app = express()
const path = require('path')
const cors = require('cors')
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, '../build')))

// User Details
app.post('/createAcc', db.createAcc)
app.get('/getUser', db.getUser)
app.post('/login', db.login)
app.post('/forgotPswd', db.forgotPswd)
app.put('/resetPswd', db.resetPswd)

// CRUD operation
app.get('/getData', db.getData)
app.post('/insertData', db.insertData)
app.put('/editDetail', db.editDetail)
app.delete('/deleteRow', db.deleteRow)


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
})

app.listen(port, () => console.log(`App running on the port ${port}`))
