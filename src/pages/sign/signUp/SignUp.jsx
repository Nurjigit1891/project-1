import React, { useEffect, useState } from 'react';
import './SignUp.scss'; // Sign.scss  для того чтобы подключить scss к проекту 
import './SignUpMobile.scss'; // Sign.scss  для того чтобы подключить scss к проекту 
import Navbar from '../../../components/navbar/Navbar'; // Навбар (путеводитель который может направлять юзера в разные страницы)
import { addDoc, collection } from 'firebase/firestore'; // addDoc для того чтобы загрузить данные о юзера в FIREBASE 
import { db } from '../../../server/firebase/firebase-config';  // db который находится в firebase-config. Внутри есть API
import { getDocs } from 'firebase/firestore'; // getDocs чтобы получить юзеров с firebase
import Alert from '@mui/material/Alert'; // Алерт который с MUI
import AlertTitle from '@mui/material/AlertTitle';  // Алерт который с MUI
import { Link } from 'react-router-dom'; // Link чтобы переходить между страницами
import { v4 } from 'uuid'; // криптографический идентификатов в системе UUID 
import { ref, uploadBytes } from 'firebase/storage'; // red чтобы построить путь к хранилище 
import { storage } from '../../../server/firebase/firebase-config'; // storage который хранит в себе API KEYS
import CircularProgress from '@mui/material/CircularProgress'; // Анимация загрузки с библиотеки MUI 
import VisibilityIcon from '@mui/icons-material/Visibility'; // открытый глаз иконка 
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; // закрытый глаз иконка

const SignUp = () => {
  const userCollectionRef = collection(db, "users"); //путь чтобы получить юзеров с FIREBASE
  const [users, setUsers] = useState([]); // Массив объектов который содержит в себе пользователей
  const [error, setError] = useState(null); // error - не знаю почему тут
  const [imageUpload, setImageUpload] = useState(null); // хук который временно содержит в себе фото от юзера до передачи в FIREBASE
  const [loading, setLoading] = useState(false); // Хук который нужен для анимации загрузки который будет виден в момент отправки в базу данных
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Состояние для показа/скрытия успешного Alert
  const [showErrorPassAlert, setShowErrorPassAlert] = useState(false) // Состояние показа/скрытия ошибки в случае не идентичность пароля
  const [visiblyPass, setVisiblyPass] = useState(false); // для того чтобы видеть пароль и скрыть
 
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
        }, 5000);
      })
      .catch((error) => { // cath для ошибки 
        console.error("Ошибка при загрузке картинки: ", error); // Выводим ошибку в консоль
        setLoading(false); //остонавливает загрузку
      });
  }

  // Функция которая полуает юзеров с FIREBASE 
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
    const { name, lastName, age, region, job, email, phoneNumber, moreInfo, password, confirmPassword } = userData; //деструктуризация userData
    if (// проверка условии на пустоты всех данных
      name.trim().length > 0 &&
      lastName.trim().length > 0 &&
      age.trim().length > 0 &&
      job.trim().length > 0 &&
      region.trim().length > 0 &&
      email.trim().length > 0 &&
      phoneNumber.trim().length > 0 &&
      password.trim().length > 0 &&
      confirmPassword.trim().length > 0
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
    const userAge = e.target.age.value; // получаем возраст от инпута 
    const userRegion = e.target.region.value; // получаем имя регион инпута 
    const userPhoneNumber = e.target.phoneNumber.value; // получаем телефон номер от инпута 
    const userMoreInfo = e.target.moreInfo.value; // получаем описание юзера  от инпута 
    const userPassword = e.target.password.value; // получаем имя пароль инпута 
    const userConfirmPassword = e.target.confirmPassword.value;  // получаем повторение пароля от инпута 


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
    };

    if (checkInput(userData)) { // вызываем функцию checkInput чтобы проверть на пустоту 
      setLoading(true);  // включает загрузку 

      const createUser = async () => { 
        try {
          await addDoc(userCollectionRef, userData);
          const status = true; // задаем статус true чтобы дать в локальное хранилище 
          localStorage.setItem('status', status); //  статус нужен для того чтобы активировать кнопку "Контакты" 
          imageUploadF(avatarV4); // Сохраняет фото с именем avatarV4 в котором есть уникальный ключ

          e.target.reset(); // очищяет поле инпутов
        } catch (error) { // вызывается при ошибке 
          console.log(error);  // выводим ошибку в консоль 
          setLoading(false); // остановливаем 
          window.location.reload(); // остановливаеми 
        }
      };
      createUser();
    }
  }

  function checkPassword(password, confirmPassword) {
    return password === confirmPassword;
  }

  console.log(visiblyPass);

  return (
    <div>
      {showSuccessAlert && ( // Показываем Alert, если showSuccessAlert равно true
        <Alert severity="success">
          <AlertTitle>Успешно</AlertTitle>
          Регистрация прошла успешно,войдите в сайт и получите доступ к контактам <strong><Link to='/signIn'>Войти</Link></strong>
        </Alert>
      )}
      {showErrorPassAlert && (
        <Alert severity="warning">
          <AlertTitle>Ошибка</AlertTitle>
           Пароли не совподают.  <strong>Повторите попытку</strong>
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
            <input maxLength={20} className='signUp-input' type="text" name="phoneNumber" placeholder="Номер телефона" required />
          </div>
          <div className="form-group">
            <textarea className='signUp-input' name="moreInfo" placeholder="Подробная информация"></textarea>
            <input className='signUp-input' type="date" name="age" />
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
      </div>
    </div>
  );
}

export default SignUp;


