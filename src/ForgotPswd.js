import React, { useState } from 'react'
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
padding: 40px 20px 20px 20px;
width: 500px;
margin:100px auto;
`
const Input = styled.input`
padding: 10px;
border-radius: 50px; 
border: 1px solid grey;
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
const Response = styled.p`
color: red;
grid-area: 4/1/5/3;
margin: auto;
`
const Success = styled(Response)`
color: green;
`

function ForgotPswd () {
  const [email, setEmail] = useState('')
  const [isErr, setErr] = useState('')
  const [success, setSuccess] = useState('')

  const handleEmail = e => {
    setEmail(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    resetPswd('http://localhost:3000/forgotPswd', { email })
  }

  const resetPswd = async (url, email) => {
    const response = await window.fetch(url, {
      method: 'Post',
      body: JSON.stringify(email),
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
            value={email}
            onChange={handleEmail}
          />
          <Button>Reset</Button>
          {isErr &&
            <Response>{isErr}</Response>}
          {success &&
            <Success>{success}</Success>}

        </Form>
      </section>

    </main>
  )
}

export default ForgotPswd
