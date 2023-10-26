import React, { useState, useEffect } from 'react'
import './Navbar.scss'
import { Link } from 'react-router-dom'
import './NavbarMobile.scss'

const Navbar = () => {
  const [adminStatus,setAdminStatus] = useState(false);
  const [isStatus,setIsStatus] = useState(false)

  useEffect(() => {
    const user_status = localStorage.getItem('isStatus');
    if(user_status) {
      setIsStatus(JSON.parse(user_status))
      
      console.log(isStatus + " asd")
    }

  }, []);


  useEffect (() => {
    const admin_status = localStorage.getItem("adminStatus");

    if(admin_status){
      
      setAdminStatus(JSON.parse(admin_status));
      }
    else{
      setAdminStatus(false);
    }
  },[])


  return (
    <div>
      <div className="navbar">

        <ul >
          <Link className='nav-link' to='/'>Главное</Link><br />
          <Link className='nav-link' to={isStatus ? '/searchContacts' : '/signUp'} >Контакты</Link><br />
          <Link className='nav-link' to='/signUp'>Регистрация</Link><br />
          <Link className={adminStatus ? 'nav-link-admin-true': 'nav-link-admin-false'} to='/adminTable'>Админстрация</Link><br />

        </ul>
      </div>
    </div>
  )
}

export default Navbar;
