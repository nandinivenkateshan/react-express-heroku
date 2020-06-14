import React from 'react'
import './form.css'
function App (props) {
  const { obj: { name, age, salary }, onInput, onSubmit } = props

  const handleInput = e => onInput(e)

  const handleSubmit = e => onSubmit(e)


  return (
    <main>
      <header>
        <h1 className='heading'>Bank Details</h1>
      </header>
      <form className='form' onSubmit={handleSubmit}>
        <p>
          <label htmlFor='name'>Name:</label>
          <input
            type='text'
            placeholder='Enter  Name'
            className='name'
            name='name'
            id='name'
            value={name}
            onChange={handleInput}
            required
          />
        </p>
        <p>
          <label htmlFor='age'>Age:</label>
          <input
            type='number'
            placeholder='Enter Age'
            className='age'
            name='age'
            id='age'
            value={age}
            required
            onChange={handleInput}
          />
        </p>
        <p>
          <label htmlFor='salary'>Salary:</label>
          <input
            type='number'
            placeholder='Enter Salary'
            className='salary'
            name='salary'
            id='salary'
            value={salary}
            onChange={handleInput}
            required
          />
        </p>
        <button className='submit-btn'>Submit</button>
      </form>
    </main>
  )
}

export default App
