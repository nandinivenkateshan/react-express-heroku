import React from 'react'
import './addTable.css'

function AddTable (props) {
  const { details, onDelete, onEdit } = props

  const handleDelete = id => onDelete(id)
  const handleEdit = (id, data) => onEdit(id, data)
  return (
    <table border='1'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Salary</th>
        </tr>
      </thead>
      <tbody>
        {details.map(item => {
          return (
            <tr key={item.id}>
              <td title='double Click to edit name' onDoubleClick={() => handleEdit(item.id, 'name')}>{item.name}</td>
              <td title='double Click to edit age' onDoubleClick={() => handleEdit(item.id, 'age')}>{item.age}</td>
              <td title='double Click to edit salary' onDoubleClick={() => handleEdit(item.id, 'salary')}>{item.salary}</td>
              <td className='delete-btn'>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>)
        })}
      </tbody>
    </table>

  )
}
export default AddTable
