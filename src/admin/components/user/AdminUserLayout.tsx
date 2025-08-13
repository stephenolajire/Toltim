import React from 'react'
import { Outlet } from 'react-router-dom'


const AdminUserLayout:React.FC = () => {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default AdminUserLayout
