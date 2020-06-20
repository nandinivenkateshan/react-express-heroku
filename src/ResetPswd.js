import React, { useState } from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'

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

function ResetPswd () {
  const [values, setValues] = useState({
    email: '',
    pswd: '',
    cpswd: ''
  })
  const [isErr, setErr] = useState('')
  const [success, setSuccess] = useState('')
  const [isRedirect, setRedirect] = useState(false)

  const handleInput = e => {
    e.persist()
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    resetPswd('http://localhost:3000/resetPswd', values)
    setValues({
      email: '',
      pswd: '',
      cpswd: ''
    })
  }

  const resetPswd = async (url, data) => {
    const response = await window.fetch(url, {
      body: JSON.stringify(data),
      method: 'Put',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.err) {
      setErr(result.err)
    }
    if (result.msg) {
      setSuccess(result.msg)
      setTimeout(() => setRedirect(true), 1000)
      setErr('')
    }
  }

  return (
    <main>
      <header>
        <Heading>Reset Password</Heading>
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
          <label htmlFor='pswd'>Enter Password :</label>
          <Input
            type='password'
            placeholder='Enter password'
            name='pswd' id='pswd'
            required
            value={values.pswd}
            onChange={handleInput}
          />
          <label htmlFor='cpswd'>Confirm Password :</label>
          <Input
            type='password'
            placeholder='Confirm Password'
            name='cpswd' id='cpswd'
            required
            value={values.cpswd}
            onChange={handleInput}
          />
          <Button>Reset</Button>
          {isErr &&
            <Response>{isErr}</Response>}
          {success &&
            <>
              <Success>{success}</Success>
              {isRedirect && <Redirect to='/login' />}

            </>}
        </Form>
      </section>
    </main>
  )
}

export default ResetPswd
