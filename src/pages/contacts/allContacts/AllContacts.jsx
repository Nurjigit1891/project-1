import React, { useEffect, useState } from 'react';
import './AllContacts.scss'; //стили для монитора 
import './AllContactsMobile.scss'; //стили для телефона 
import Navbar from '../../../components/navbar/Navbar'; //Навбар чтобы зайти на другие страницы 
import { collection, getDocs } from 'firebase/firestore'; // получаем готовые функции из FireBase чтобы получить данные о юзеров
import { db, storage } from '../../../server/firebase/firebase-config'; // db - это совокупность API ключев из FireBase
import { Link, useNavigate } from 'react-router-dom'; //use Navigate чтобы через ID юзера зайти на одиночную страницу 
import CircularProgress from '@mui/material/CircularProgress'; // анимация загрузки из MUI
import { getDownloadURL, listAll, ref } from 'firebase/storage'; // функции чтобы получить картинку из FireBase
import { motion } from 'framer-motion'; // Библиотека Frame Motion

// функция для аниации 
const cardImgAnimation = {
  hidden: {
    x: -200,
    opacity: 0,
  },
  visible: custom => ({
    x: 0,
    opacity: 1,
    transition: {delay: custom * 0.2}
    }   
  )
}
// функция для аниации 
const cartButtonAnimation = {
  hidden: {
    y: -200,
    opacity: 0,
  },
  visible: custom => ({
    y: 0,
    opacity: 1,
    transition: {delay: custom * 0.2}
    }   
  )
}

const AllContacts = () => {
  const [users, setUsers] = useState([]); // Текстовые данные о пользователях
  const [imageList, setImageList] = useState([]); // Фотографии профиля пользователей

  const userCollectionRef = collection(db, 'users'); // Для получения ключей API из Firebase
  const navigate = useNavigate();
  const imageListRef = ref(storage, 'images/');

  // Функция для получения аватарок пользователей из Firebase
  useEffect(() => {
    listAll(imageListRef) // путь к изображению
      .then((response) => { 
        const downloadPromise = response.items.map((item) => getDownloadURL(item)); // ссылки получем в этой строке 

        // оброботка ссылок, then catch
        Promise.all(downloadPromise)  
          .then((urls) => {
            setImageList(urls);
          })
          .catch((error) => {
            console.log(error);
          });
      });
  }, []);

  // Функция для получения данных из Firebase
  useEffect(() => {
    const getUsers = async () => {
      // Используем try-catch для обработки ошибок
      try {
        const data = await getDocs(userCollectionRef);

        // Используем setUsers для хранения данных из 'data'
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  return (
    <div>
      <div className="allContacts">
        <Navbar />
        <div className="countAllContacts">
          <p>Количество контактов: <span style={{fontWeight:'900'}}>{users.length - 1 === -1 ? 0 : users.length - 1 }</span></p>
        </div>
        {users.length > 0 ? (
          <motion.div className="cards" >
            {users.filter(user => !user.isAdmin).map((user) => {
              const urlImage = imageList.filter((imageUrl) => imageUrl.includes(user.avatarV4));
              return (
                <motion.div key={user.id} className="card">
                  <motion.p custom={2} variants={cardImgAnimation} className="userName">{user.name}</motion.p>
                  <motion.p custom={3} variants={cardImgAnimation} className="userJob">{user.job}</motion.p>
                  <motion.img
                    variants={cardImgAnimation}
                    className={urlImage.length > 0 ? 'userAvatarTrue' : 'userAvatarDefault'}
                    src={urlImage.length > 0 ? urlImage[0] : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt=""
                  />
                  <motion.button
                    variants={cartButtonAnimation}
                    custom={4}
                    className="userMoreInfoBtn"
                    onClick={() => {
                      navigate(`/singleContact/${user.id}`);
                    }}
                  >
                    Узнать больше
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <CircularProgress size={70} className="loading-animation" />
        )}
      </div>
    </div>
  );
}



export default AllContacts;
