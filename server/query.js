const pool = require('./config')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

// User Details

const createAcc = async (req, res) => {
  console.log('createAcc')
  const { username, email, password } = req.body
  const hashedPswd = await bcrypt.hash(password, 10)
  if (!username || !email || !password) {
    res.send({ response: 'Please Enter the details' })
  }
  if (!/^[a-z0-9A-Z ]+$/.test(username)) {
    res.send({ response: 'User Name is Invalid' })
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    res.send({ response: 'Email address is invalid' })
  }
  try {
    await pool.query('INSERT INTO signup (username, email, password) VALUES ($1,$2,$3)', [username, email, hashedPswd])
    res.send({
      res: 'Added user details successfully'
    })
  } catch {
    res.send({ response: 'Email already exist' })
  }
}

const getUser = async (req, res) => {
  console.log('getuser funcion')
  try {
    const response = await pool.query('SELECT * FROM signup')
    res.status(200).json(response.rows)
  } catch {
    res.send('Error in fetching user')
  }
}

const login = async (req, res) => {
  console.log('login')
  let result
  const { email, pswd } = req.body
  if (!email || !pswd) {
    res.send({ msg: 'Please Enter the details' })
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    res.send({ msg: 'Email address is invalid' })
  }
  try {
    result = await pool.query('SELECT * FROM signup WHERE email=$1', [email])
  } catch {
    res.send({ msg: 'Unable to fetch user details' })
  }
  if (result.rows.length === 0) {
    res.send({ msg: 'No User with this Email' })
  }
  if (!(await bcrypt.compare(pswd, result.rows[0].password))) {
    res.send({ msg: 'Password is incorrect' })
  }

  const sessionObj = {
    active: true,
    sid: email + Math.random()
  }
  try {
    await pool.query('INSERT INTO session (email,active,sid) VALUES ($1,$2,$3)',
      [email, sessionObj.active, sessionObj.sid])
    res.send({
      success: 'Login Successfull',
      sessionObj
    })
  } catch {
    res.send({ msg: 'Unable to add session id' })
  }
}

const forgotPswd = async (req, res) => {
  const { email } = req.body
  let result
  if (!email) {
    res.send({ err: 'Please Enter the details' })
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    res.send({ err: 'Email address is invalid' })
  }

  try {
    result = await pool.query('SELECT * FROM signup WHERE email=$1', [email])
  } catch {
    res.send({ err: 'unable to fetch user details' })
  }
  if (result.rows.length === 0) {
    res.send({ err: 'No User with this Email' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })

  const mailOptions = {
    from: '',
    to: email,
    subject: 'Link to reset password',
    text:
    `please click the link below to reset your password.
     If this was not you, it is safe to ignore this email.
     http://localhost:3001/resetPswd
    `
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log('result', result)
    res.send({ msg: 'Email sent' })
  } catch (e) {
    console.log('error', e)
    res.send({ err: 'Error while sending email' })
  }
}

const resetPswd = async (req, res) => {
  const { email, pswd, cpswd } = req.body
  const hashedPswd = await bcrypt.hash(pswd, 10)
  let result
  try {
    result = await pool.query('SELECT * FROM signup WHERE email=$1', [email])
    console.log('result from resetPswd', result)
  } catch {
    res.send({ err: 'unable to fetch user details' })
  }
  if (result.rows.length === 0) {
    res.send({ err: 'No User with this Email' })
  }
  if (pswd !== cpswd) {
    res.send({ err: 'Passwords are not matching ' })
  }
  try {
    const response = await pool.query('UPDATE signup SET password=$2 WHERE email=$1', [email, hashedPswd])
    res.send({ msg: 'Password updated successfully' })
  } catch {
    res.send({ err: 'Error in updating password' })
  }
}

// CRUD Operation
const getData = async (req, res) => {
  console.log('getdata function is calling')
  let email
  try {
    console.log('getdata function is calling')
    const response = await pool.query('SELECT email from session WHERE sid=$1', [req.query.sid])
    email = response.rows[0].email
    console.log('eamil', email)
  } catch {
    res.send({ err: 'Error in fecth particular data for user' })
  }
  try {
    const response = await pool.query('SELECT * FROM bankdetails WHERE email = $1', [email])
    res.status(200).send(response.rows)
  } catch {
    res.send('Error in fetching bank details')
  }
}

const insertData = async (req, res) => {
  console.log('insertFatJJK')
  const { id, name, age, salary, sid } = req.body
  console.log('sid',sid)
  let email
  try {
    const response = await pool.query('SELECT email from session WHERE sid=$1', [sid])
    console.log('response', response.rows)
    email = response.rows[0].email
  } catch {
    res.send({ err: 'Error in fecth particular data for user' })
  }

  try {
    const response = pool.query('INSERT INTO bankdetails (id,name,age,salary,email) VALUES ($1,$2,$3,$4, $5)', [id, name, age, salary, email])
    const result = await response
    res.send('Added data successfully')
    console.log('result', result)
  } catch {
    res.send('Error while inserting details')
  }
}

const editDetail = async (req, res) => {
  console.log('editVal')
  const { id, value, data } = req.body
  try {
    const response = await pool.query(`UPDATE bankdetails SET ${data}=$1 WHERE id=$2`, [value, id])
    res.send(`updated ${response.rowCount} successfully`)
  } catch {
    res.send('Error in updating name')
  }
}

const deleteRow = async (req, res) => {
  console.log('deleteRow')
  const { id } = req.body
  try {
    const response = await pool.query('DELETE FROM bankdetails WHERE id=$1', [id])
    res.send(`Deleted  ${response.rowCount} row successfully`)
  } catch {
    res.send('Error while deleting row')
  }
}

module.exports = {
  getData,
  insertData,
  editDetail,
  deleteRow,
  getUser,
  createAcc,
  login,
  forgotPswd,
  resetPswd
}
