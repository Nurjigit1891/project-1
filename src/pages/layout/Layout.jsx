import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../home/Home'
import AllContacts from '../contacts/allContacts/AllContacts'
import SignUp from '../sign/signUp/SignUp'
import SearchContacts from '../contacts/searchContacts/SearchContacts'
import SignIn from '../../pages/sign/signIn/SignIn'
import SingleContact from '../singeContact/SingleContact'
import AdminTable from '../admin/AdminTable'


const Layout = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/searchContacts' element={<SearchContacts />} />
            <Route path='/allContacts' element={<AllContacts />} />
            <Route path='/signUp' element={<SignUp />} />
            <Route path='/signIn' element={<SignIn />} />
            <Route path='/singleContact/:id' element={<SingleContact />} />
            <Route path='/adminTable' element={<AdminTable />} />
        </Routes>
    </div>
  )
}

export default Layout