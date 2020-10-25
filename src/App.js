import React from 'react'
import { HomePage } from './HomePage'

export const App = () => {
  return (
    <div className='d-flex flex-row vh-100'>
      <div role='main' id='content' className='d-flex flex-column flex-grow-1 overflow-auto'>
        <HomePage />
      </div>
    </div>
  )
}
