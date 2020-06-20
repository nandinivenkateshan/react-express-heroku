import React, { useState } from 'react'
import styled from 'styled-components'
import { Redirect, Link } from 'react-router-dom'

const Heading = styled.h1`
margin-top: 50px;
text-align: center;
`
const Form = styled.form`
border: 1px solid grey;
display: grid;
grid-template-columns: 150px 300px;
grid-row-gap: 20px;
padding: 40px 20px 20px 20px;
width: 500px;
margin:100px auto;
`
const Button = styled.button`
grid-area: 3/1/4/3;
width: 100px;
margin:auto;
color: #388f38;
border: none;
padding: 10px;
border-radius: 30px;
font-weight: bold;
background-color: #ddcfcf;
box-shadow: 3px 2px grey;
`
const Input = styled.input`
padding: 10px;
border-radius: 50px; 
border: 1px solid grey;
`
const Response = styled.p`
color: red;
grid-area: 5/1/6/3;
margin: auto;
`
const Success = styled(Response)`
color: green;
`
const ResetPswd = styled(Link)`
grid-area: 4/1/5/3;
margin: auto;
`

function Login () {
  const isLoggedIn = window.localStorage.getItem('session')
  let active
  const [values, setValues] = useState({
    email: '',
    pswd: ''
  })

  const [successMsg, setSuccessMsg] = useState('')
  const [resMsg, setResMsg] = useState('')
  const [isRedirect, setRedirect] = useState(false)
  if (isLoggedIn) {
    active = true
  }

  const handleInput = e => {
    e.persist()
    setValues({ ...values, [e.target.name]: e.target.value })
    setResMsg('')
  }

  const handleSubmit = e => {
    e.preventDefault()
    const obj = {
      email: values.email,
      pswd: values.pswd
    }
    login('https://parle-g.herokuapp.com/login', obj)
    setValues({
      email: '',
      pswd: ''
    })
  }

  const login = async (url, data) => {
    const response = await window.fetch(url, {
      method: 'Post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    console.log('result from login', result)
    if (result.msg) {
      setResMsg(result)
    }
    if (result.success) {
      setSuccessMsg(result.success)
      console.log('session', result.sessionObj)
      window.localStorage.setItem('session', JSON.stringify(result.sessionObj))
      setTimeout(() => setRedirect(true), 1000)
      setResMsg('')
    }
  }

  return (
    <>
      {active && <Redirect to='/app' />}
      {!active &&
        <main>
          <header>
            <Heading>Login</Heading>
          </header>
          <section>
            <Form onSubmit={handleSubmit}>
              <label htmlFor='email'>Email :</label>
              <Input
                type='email'
                placeholder='Enter your email'
                name='email' id='email'
                required
                value={values.email}
                onChange={handleInput}
              />
              <label htmlFor='pswd'>Password :</label>
              <Input
                type='password'
                placeholder='Enter Password'
                name='pswd' id='pswd'
                required
                value={values.pswd}
                onChange={handleInput}
              />
              <Button>Submit</Button>
              <ResetPswd to='pswdSet'>Forgot Password</ResetPswd>
              {resMsg &&
                <Response>{resMsg.msg}</Response>}
              {successMsg &&
                <>
                  <Success>{successMsg}</Success>
                  {isRedirect && <Redirect to='/app' />}
                </>}

            </Form>
          </section>
        </main>}

    </>
  )
}
export default Login
