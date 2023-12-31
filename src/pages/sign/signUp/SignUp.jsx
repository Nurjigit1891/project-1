import React, { useEffect, useState } from 'react';
import './SignUp.scss'; // Sign.scss  для того чтобы подключить scss к проекту 
import './SignUpMobile.scss'; // Sign.scss  для того чтобы подключить scss к проекту 
import Navbar from '../../../components/navbar/Navbar'; // Навбар (путеводитель который может направлять юзера в разные страницы)
import { addDoc, collection } from 'firebase/firestore'; // addDoc для того чтобы загрузить данные о юзера в FIREBASE 
import { db } from '../../../server/firebase/firebase-config';  // db который находится в firebase-config. Внутри есть API
import { getDocs } from 'firebase/firestore'; // getDocs чтобы получить юзеров с firebase
import Alert from '@mui/material/Alert'; // Алерт который с MUI
import AlertTitle from '@mui/material/AlertTitle';  // Алерт который с MUI
import { Link, useNavigate } from 'react-router-dom'; // Link чтобы переходить между страницами
import { v4 } from 'uuid'; // криптографический идентификатов в системе UUID 
import { ref, uploadBytes } from 'firebase/storage'; // red чтобы построить путь к хранилище 
import { storage } from '../../../server/firebase/firebase-config'; // storage который хранит в себе API KEYS
import CircularProgress from '@mui/material/CircularProgress'; // Анимация загрузки с библиотеки MUI 
import VisibilityIcon from '@mui/icons-material/Visibility'; // открытый глаз иконка 
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; // закрытый глаз иконка
import { DatePicker, Space } from 'antd'; // элемент который из библиотеки и antd для даты и время



const SignUp = () => {
  const userCollectionRef = collection(db, "users"); //путь чтобы получить юзеров с FIREBASE
  const [users, setUsers] = useState([]); // Массив объектов который содержит в себе пользователей
  const [error, setError] = useState(null); // error - не знаю почему тут
  const [imageUpload, setImageUpload] = useState(null); // хук который временно содержит в себе фото от юзера до передачи в FIREBASE
  const [loading, setLoading] = useState(false); // Хук который нужен для анимации загрузки который будет виден в момент отправки в базу данных
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Состояние для показа/скрытия успешного Alert
  const [showErrorPassAlert, setShowErrorPassAlert] = useState(false) // Состояние показа/скрытия ошибки в случае не идентичность пароля
  const [showEmptyError , setShowEmptyError] = useState(false) // хук для того что проверить на пустоту
  const [visiblyPass, setVisiblyPass] = useState(false); // для того чтобы видеть пароль и скрыть
  const [getUserAge, setGetUserAge] = useState(null); // хук для того чтобы получить данные пользователя о его возрасте обновленная версия
  const [getUserEndSchool, setGetUserEndSchool] = useState(null) //хук для того чтобы получить данные пользователя о окончания школы


 // onChange для получение дату рождения пользователя
  const onChangeAge = (date, dateString) => {
    const a = (date.$s , dateString)
    setGetUserAge(a)
  };

  // onChange для получение дату (год) окончания школы
  const onChangeSchool = (date, dateString) => {
    const a = (date.$s , dateString);
    setGetUserEndSchool(a); // Сохраняем в state чтобы передать в функцию createUser
  };
 
  // функця который отправляет фото в FIREBASE. Принимает параметр n чтобы дать фотке имя n (n = v4();)
  function imageUploadF(n) { 
    if (imageUpload == null) return; // Ничего не делаем если фото пусто

    setLoading(true); // А иначе загрузка будет работать

    const imageRef = ref(storage, `images/${n}`); // получаем путь images и туда имя равен n 
    uploadBytes(imageRef, imageUpload) // imageUpload который содержит в себе фото юзера
      .then(() => { // если она получены, то выходит alert и остонавливает загрузку 
        setLoading(false); //остонавливает загрузку
        setImageUpload(null); //очищяет место для фото
        setShowSuccessAlert(true); // Показываем успешный Alert
        setTimeout(() => {
          setShowSuccessAlert(false); // Скрываем Alert через 5 секунд
          window.location.reload()
        }, 5000);
      })
      .catch((error) => { // cath для ошибки 
        console.error("Ошибка при загрузке картинки: ", error); // Выводим ошибку в консоль
        setLoading(false); //остонавливает загрузку
      });
  }

  // Функция которая полуает юзеров с FIREBASE?
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(userCollectionRef); // данные которые придут с FIREBAES будут временно храниться  в data
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // в хук users даем все данные о юзероах с перемнной data
      } catch (error) { // Выполняет когда ошибка 
        console.log(error);
      }
    };
    getUsers(); // Вызываем функцию
  }, []);


  // Функция которая проверяет данные на пустоту 
  function checkInput(userData) { // userData который как параметр получаем с функции "createUser" 
    const { name, lastName, age, region, job, email, phoneNumber, moreInfo, password, confirmPassword,endSchoolYear } = userData; //деструктуризация userData
    if (// проверка условии на пустоты всех данных
      name.trim().length > 0 &&  // проверка имени 
      lastName.trim().length > 0 && // проверка фамилии
      age !== null && // проверка возраста
      job.trim().length > 0 && // проверка професии
      region.trim().length > 0 && // проверка региона
      email.trim().length > 0 && // проверка эл. почты
      phoneNumber.trim().length > 0 && // проверка номер телефона
      password.trim().length > 0 && // проверка пароля 
      confirmPassword.trim().length > 0 && // проверка подтверждающего пароля 
      endSchoolYear !== null 

    ) { // тут получаем пароль и повторение паролей чтобы проверить на идентичность
      if (checkPassword(password, confirmPassword)) {
        return true; // если пароли идентичны то возвращаем TRUE
      } else {
        setShowErrorPassAlert(true); // Показываем успешный Alert
        setTimeout(() => {
          setShowErrorPassAlert(false); // Скрываем Alert через 5 секунд
        }, 5000);
        return false; // если не идентичны то возвращаем FALSE
      }
    } else {
      return false; // если данные пусты, то возвращаем FALSE
    }
  }


  //Функция которая вызывается при нажатии на кнопку "ЗАРЕГИСТРИРОВАТСЬЯ"
  function createUsers(e) {
    e.preventDefault(); // остановливает перезагрузку страницы

    const avatarV4 = v4(); // получаем уникальный ключи который не повторяется чтобы дать юзеру и имя картинке чтобы их соеденить

    const userName = e.target.name.value; // получаем имя от инпута 
    const userLastName = e.target.lastName.value; // получаем фамилию от инпута 
    const userJob = e.target.job.value; // получаем профессию от  инпута 
    const userEmail = e.target.email.value; // получаем почту от инпута 
    const userAge = getUserAge // получаем возраст от инпута 
    const userRegion = e.target.region.value; // получаем имя регион инпута 
    const userPhoneNumber = e.target.phoneNumber.value; // получаем телефон номер от инпута 
    const userMoreInfo = e.target.moreInfo.value; // получаем описание юзера  от инпута 
    const userPassword = e.target.password.value; // получаем имя пароль инпута 
    const userConfirmPassword = e.target.confirmPassword.value;  // получаем повторение пароля от инпута 
    const userEndSchoolYear = getUserEndSchool // получем год окончание школы пользователя

    // объединяем данные о юзера в одну переменную userDAta
    const userData = {
      name: userName,
      lastName: userLastName,
      region: userRegion,
      phoneNumber: userPhoneNumber,
      age: userAge,
      job: userJob,
      email: userEmail,
      password: userPassword,
      confirmPassword: userConfirmPassword,
      moreInfo: userMoreInfo,
      avatarV4: avatarV4,
      endSchoolYear: userEndSchoolYear,
    };

    if (checkInput(userData)) { // вызываем функцию checkInput чтобы проверть на пустоту 
      setLoading(true);  // включает загрузку 

      const createUser = async () => { 
        try {
          await addDoc(userCollectionRef, userData);
          imageUploadF(avatarV4); // Сохраняет фото с именем avatarV4 в котором есть уникальный ключ
          const isLogin = true;
          localStorage.setItem('isStatus' , isLogin);
          e.target.reset(); // очищяет поле инпутов
        } catch (error) { // вызывается при ошибке 
          console.log(error);  // выводим ошибку в консоль 
          setLoading(false); // остановливаем 
          window.location.reload(); // остановливаеми 
        }
      };
      createUser();
    }else {
      setShowEmptyError(true) // показываем уведомление о пустом инпуте
      setTimeout(() => {
        setShowEmptyError(false) // скрываем уведомление после 3 сек
      },3000)
    }
  }

  // Функция которая проверяет на идентичность паролей.
  function checkPassword(password, confirmPassword) {
    return password === confirmPassword;
  }


  return (
    <div>
      {showSuccessAlert && ( // Показываем Alert, если showSuccessAlert равно true
        <Alert severity="success" className='alertSuccess'>
          <AlertTitle>Успешно</AlertTitle>
          Регистрация прошла успешно,войдите в сайт и получите доступ к контактам <strong><Link to='/signIn'>Войти</Link></strong>
        </Alert>
      )}
      {showErrorPassAlert && (
        <Alert severity="warning" className='alertError'>
          <AlertTitle>Ошибка</AlertTitle>
           Пароли не совподают.  <strong>Повторите попытку</strong>
      </Alert>
      )}
      {showEmptyError && (
            <Alert severity="warning" className='alertError'>
                <AlertTitle>Ошибка</AlertTitle>
                 Заполните все поля и потом  <strong>Повторите попытку</strong>
            </Alert>
      )}
      <div className="signUp">
        <Navbar />
        <div className="signUp-infoBlock">
          <p className='signUp-infoBlock-text-1'>
            Чтобы смотреть контакты нужно сначала <span style={{textDecoration: 'underline', fontWeight: '600'}}>Зарегистрироваться</span> или <span style={{textDecoration: 'underline', fontWeight: '600'}}> войти</span> если у вас есть аккаунт
          </p>
        </div>
        <div className="registration-container">
          <h2>Регистрация</h2>

          <form onSubmit={createUsers}>
          <div className="form-group">
            <input maxLength={20} className='signUp-input' type="text" name="name" placeholder="Имя" required />
            <input maxLength={20} className='signUp-input' type="text" name="lastName" placeholder="Фамилия" required />
          </div>
          <div className="form-group">
            <input maxLength={20} className='signUp-input' type="text" name="job" placeholder="Профессия" required />
            <input maxLength={30} className='signUp-input' type="email" name="email" placeholder="Почта" required />
          </div>
          <div className="form-group">
            <input maxLength={15} className='signUp-input' type="text" name="region" placeholder="Регион проживания" required />
            <input maxLength={20} className='signUp-input' type="text" name="phoneNumber" placeholder="Номер телефона (Ватсап)" required />
          </div>
          <div className="form-group">
            <textarea className='signUp-input' name="moreInfo" placeholder="Подробная информация"></textarea>
            <Space direction="vertical">
              <DatePicker className='ant' placeholder='Введите дату рожднения' onChange={onChangeAge} />
            </Space>

            <p className='form-group-text1'>Ваша дата рождения</p>
          </div>
          <div className="form-group">
          { visiblyPass ? 
            <VisibilityOffIcon 
                className="passwordEye" 
                onClick={() => setVisiblyPass(!visiblyPass)} 
            />
            :
            <VisibilityIcon 
                className="passwordEye" 
                onClick={() => setVisiblyPass(!visiblyPass)} 
            />
            }

              <input 
                  maxLength={30} 
                  className='signUp-input' 
                  type={visiblyPass ? "text" : "password"} 
                  name="password" 
                  placeholder="Пароль" 
                  required 
              />
              <input 
                  maxLength={30} 
                  className='signUp-input' 
                  type={visiblyPass ? "text" : "password"} 
                  name="confirmPassword" 
                  placeholder="Подтверждение пароля" 
                  required 
              />
          </div>

            <div className="form-group">
              <input onChange={(e) => { setImageUpload(e.target.files[0]) }} name='userAvatar' className='signUp-input' type="file" />
              <p className='form-group-text2'>Выберите фото для профиля</p>

              {/* Дата пикер с сайта Antd чтобы получить год окончания школы */}
              <DatePicker className='endSchoolYear' onChange={onChangeSchool} picker="year" placeholder='Год окончания школы' />  

            </div>

            {loading ? (
              <CircularProgress />
            ) : (
              <button className='signUp-btn' type="submit">Зарегистрироваться</button>
            )}
            <br />
            <Link to='/signIn' className='alreadyHaveAccount'>У вас есть аккаунт?</Link>
          </form>

        </div>
        <p className='choose-photo-profile' >Выберите фото для профиля</p>
      </div>
    </div>
  );
}

export default SignUp;


