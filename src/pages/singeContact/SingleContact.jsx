import React, { useEffect, useState } from 'react';
import './SingleContact.scss'; // стили для монитора
import './SingleContactMobile.scss'; // стили для телефона с шириной в 320px
import { useParams } from 'react-router-dom'; // Параметр нужен для того чтобы перейти в одинночный контакт взяв в параметр id юзера
import { collection, getDocs } from 'firebase/firestore'; // путь и функция для полученя юзеров с FireBase
import { db, storage } from '../../server/firebase/firebase-config'; // db - хранит в себе API ключей которые находились в firebase-config 
import Navbar from '../../components/navbar/Navbar'; // компонент навбар для того чтобы, 
import WorkIcon from '@mui/icons-material/Work'; //
import CircularProgress from '@mui/material/CircularProgress';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const SingleContact = () => {
    const params = useParams();
    const [user, setUser] = useState(null);
    const userCollectionRef = collection(db, 'users');
    const [userAgeYear, setUserAgeYear] = useState(null);

    const [imageList, setImageList] = useState([]) // для хранения ссылок на изображения
    const [profileImg, setProfileImg] = useState(null)

    useEffect(() => {
        // Загрузка информации о пользователе
        const getUser = async () => {
            try {
                const data = await getDocs(userCollectionRef);
                const usersData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                const foundUser = usersData.find(user => user.id === params.id);
                setUser(foundUser);
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, [params.id]);

    useEffect(() => {
        // Получение списка изображений
        const imageListRef = ref(storage, `images`);
        listAll(imageListRef)
            .then((response) => {
                const downloadPromise = response.items.map((item) => getDownloadURL(item));
                Promise.all(downloadPromise)
                    .then((urls) => {
                        setImageList(urls);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
    }, []); 

    useEffect(() => {
        if (user) {
            // Вычисление возраста
            const ageParts = user.age.split('-');
            const agePartsYear = ageParts[0];
            setUserAgeYear(2023 - parseInt(agePartsYear));
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            // Поиск изображения профиля пользователя
            const foundImg = imageList.filter((url) => {
                return url.includes(user.avatarV4);
            });
            setProfileImg(foundImg);
        }
    }, [user, imageList]);

    return (
        <div className="modernSingleContact">
            <Navbar />
            <button className="backButton" onClick={() => window.history.back()}>
                <ArrowBackIcon  />
            </button>
            {user ? (
                <div className="modernUserInfo">
                    <div className="avatarContainer">
                        <img 
                            src={imageList.length > 0 ? profileImg : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt="User Avatar"
                            className="modernUserAvatar"
                        />
                    </div>
                    <div className="detailsContainer">
                        <h2>{user.name} {user.lastName}</h2>
                        <p className="modernUserJob">{user.job}</p>
                        <div className="contactDetails">
                            <div className="phoneDetails">
                                <LocalPhoneIcon />
                                <span>{user.phoneNumber}</span>
                            </div>
                            <div className="locationDetails">
                                <SouthAmericaIcon />
                                <span>{user.region}</span>
                            </div>
                            <div className="ageDetails">
                                <CalendarMonthIcon />
                                <span>{userAgeYear > 100 || userAgeYear <= 0 ? "-" : userAgeYear} лет</span>
                            </div>
                        </div>
                        <p className="moreInfo">{user.moreInfo}</p>
                    </div>
                </div>
            ) : (
                <CircularProgress size={70} className='loading-animation' />
            )}
        </div>
    );
}

export default SingleContact;
