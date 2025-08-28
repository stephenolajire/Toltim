import React from 'react'
import { Outlet } from 'react-router-dom'

const HistoryLayout :React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default HistoryLayout

