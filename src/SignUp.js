import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

const Heading = styled.h1`
margin-top: 50px;
text-align: center;
`
const Form = styled.form`
border: 1px solid grey;
display: grid;
grid-template-columns: 150px 300px;
grid-row-gap: 20px;
padding: 20px;
width: 500px;
margin:100px auto;
`
const Button = styled.button`
grid-area: 4/1/5/3;
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
function SignUp () {
  const isLoggedIn = window.localStorage.getItem('session')
  let active
  if (isLoggedIn) active = true

  const [values, setValues] = useState({
    name: '',
    email: '',
    pswd: ''
  })
  const [submitRes, setSubmitRes] = useState('')
  const [success, setSuccess] = useState('')
  const [isRedirect, setRedirect] = useState(false)

  const handleInput = e => {
    e.persist()
    setSubmitRes('')
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const createAcc = async (url, data) => {
    const response = await window.fetch(url, {
      method: 'Post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.response) {
      setSubmitRes(result)
      setSuccess('')
    }
    if (result.res) {
      setSuccess(result)
      setTimeout(() => setRedirect(true), 1000)
      setSubmitRes('')
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    const obj = {
      username: values.name,
      email: values.email,
      password: values.pswd
    }
    createAcc('http://localhost:3000/createAcc', obj)
    setValues({
      name: '',
      email: '',
      pswd: ''
    })
  }

  return (
    <>
      {active ? <Redirect to='/app' />
        : (
          <main>
            <header>
              <Heading>Sign Up</Heading>
            </header>
            <section>
              <Form onSubmit={handleSubmit}>
                <label htmlFor='name'>UserName :</label>
                <Input
                  type='text'
                  placeholder='Enter your name'
                  name='name' id='name' required
                  value={values.name}
                  onChange={handleInput}
                />
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
                {submitRes &&
                  <Response>{submitRes.response}</Response>}
                {success &&
                  <>
                    <Success>{success.res}</Success>
                    {isRedirect && <Redirect to='/login' />}
                  </>}
              </Form>
            </section>
          </main>)}
    </>
  )
}

export default SignUp
