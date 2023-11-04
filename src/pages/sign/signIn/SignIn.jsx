import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbar/Navbar';
import './SignIn.scss';
import './SignInMobile.scss';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../server/firebase/firebase-config';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const SignIn = () => {
  const [visiblyPass, setVisiblyPass] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) { // Если данные все еще загружаются
        window.location.reload(false); // Принудительно перезагружаем страницу
      }
    }, 5000);

    const getUsers = async () => {
      try {
        const data = await getDocs(collection(db, "users"));
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error(error);
        setLoginMessage("Произошла ошибка при загрузке данных.");
      } finally {
        setLoading(false);
      }
    };

    getUsers();

    return () => clearTimeout(timer); // Очищаем таймер при размонтировании
  }, []);

  const checkValues = (e) => {
    e.preventDefault();
    const login = e.target.login.value;
    const password = e.target.password.value;
  
    if (login.trim() && password.trim()) {
      const foundUser = users.find(user => user.email === login && user.password === password);
      if (foundUser) {
        localStorage.setItem('isStatus', true);
        if (foundUser.isAdmin) {
          localStorage.setItem('adminStatus', true);
        }
        setIsLoginSuccessful(true);
        setLoginMessage("Вы вошли в систему.");
        // Установим таймер для перенаправления после короткой задержки
        setTimeout(() => {
          navigate('/allContacts'); // Убедитесь, что этот путь правильный
        }, 1000); // Перенаправление через 1 секунду
      } else {
        setIsLoginSuccessful(false);
        setLoginMessage("Неверный логин или пароль!");
      }
    } else {
      setIsLoginSuccessful(false);
      setLoginMessage("Данные заполнены не корректно!");
    }
  };
  

  return (
    <div>
      <div className="signIn">
        <Navbar />
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={checkValues}>
            <h2 className='signIn-text-1'>Войти</h2>
            {visiblyPass ? (
              <VisibilityOffIcon 
                className="passwordEyeSignIn" 
                onClick={() => setVisiblyPass(!visiblyPass)} 
              />
            ) : (
              <VisibilityIcon 
                className="passwordEyeSignIn" 
                onClick={() => setVisiblyPass(!visiblyPass)} 
              />
            )}
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
            <input className='signIn-btn' type="submit" value={"Войти"} />
          </form>
        )}
        {loginMessage && (
          <p className={isLoginSuccessful ? 'signIn-success-message' : 'signIn-error-message'}>
            {loginMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignIn;
