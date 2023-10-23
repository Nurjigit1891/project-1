import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/navbar/Navbar'
import './SignIn.scss' ;
import './SignInMobile.scss' ;
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../server/firebase/firebase-config';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility'; // открытый глаз иконка 
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; // закрытый глаз иконка



const SignIn = () => {

  const [visiblyPass, setVisiblyPass] = useState(false); // для того чтобы видеть пароль и скрыть
  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db , "users")  // для получение АПИ ключей из FireBase 
  const [login,setLogin] = useState("")
  const [isLogin,setIsLogin] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {

    const getUsers = async() => {
      // Использование try Catch чтобы весь код не сломался
      try {
        const data = await getDocs(userCollectionRef);
        
        // setUsers для хранения данных которые пришли в data
        setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))

      } catch (error) { //выполняются при ошибке кода
        console.log(error)
      }

    }
    getUsers()
  },[])



  function checkValues (e) {
    e.preventDefault()

    const login = e.target.login.value;
    const password = e.target.password.value

    if (login.trim().length > 0 && password.trim().length > 0) {
      const foundUser = users.find((user) => user.email === login && user.password === password)
      console.log(foundUser)
      if (foundUser) {

        const status = true // статус может быть false or true. true будет если юзер зашел на сайт
        localStorage.setItem('isStatus', status) // 
        setLogin("Вы зашли в систему")
        setIsLogin(true)

        navigate('/searchContacts')

        // Вход админа
        if(foundUser.email === "admin@gmail.com" && foundUser.password === "12344" && foundUser.isAdmin === true) {
          const statusAdmin = "true";
          localStorage.setItem('adminStatus', statusAdmin)
          console.log(statusAdmin)
        }else {
          const statusAdmin = false;
          localStorage.setItem('adminStatus', statusAdmin)
        }


        

        // отправляем в локальное хранилище статус  чтобы доставать откуда угодно
      }else {
        setLogin("Неверный логин или пароль!");
        setIsLogin(false);

      }
    }else {
      setLogin("Данные заполнены не корректно!");
      setIsLogin(false)


    }
  }

  return (
    <div>
        <div className="signIn">
            <Navbar />
            <form onSubmit={checkValues}>
              <h2 className='signIn-text-1'>Войти</h2>
              { visiblyPass ? 
                <VisibilityOffIcon 
                    className="passwordEyeSignIn" 
                    onClick={() => setVisiblyPass(!visiblyPass)} 
                />
                :
                <VisibilityIcon 
                    className="passwordEyeSignIn" 
                    onClick={() => setVisiblyPass(!visiblyPass)} 
                />
            }
              <input 
              name='login' 
              placeholder='Логин (электронная почта)' 
              className='signIn-input' 
              type="text" /><br />
              <input 
              name='password' 
              placeholder='Пароль...' 
              className='signIn-input' 
              type={visiblyPass ? "text" : "password"} 
              /> 
              <br />

              <input className='signIn-btn' type="submit"  value={"Войти"}/>
            </form>

            <p className={isLogin ? 'signIn-error-message-true' : 'signIn-error-message-false'}>{login} <br />
            <CircularProgress style={isLogin ? {display:'block'}: {display:'none'}} />

            </p>
        </div>
    </div>
  )
}

export default SignIn