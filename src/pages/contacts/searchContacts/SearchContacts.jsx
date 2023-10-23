import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbar/Navbar';
import './SearchContacts.scss';
import './SearchContactsMobile.scss';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../../server/firebase/firebase-config';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import CircularProgress from '@mui/material/CircularProgress'; // анимация загрузки из MUI



const SearchContacts = () => {
  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, 'users');
  const [searchValue, setSearchValue] = useState('');
  const [filterContacts, setFilterContacts] = useState([]);
  const navigate = useNavigate();
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storage, 'images/');

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(userCollectionRef);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    function filterUsers(filterValue) {
      const newFilterUser = users.filter((user) =>
        user.job.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilterContacts(newFilterUser);
    }

    filterUsers(searchValue);
  }, [searchValue, users]);

  useEffect(() => {
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

  return (
    <div>
      <div className="searchContacts">
        <Navbar />
        <input
          className="search-input"
          type="text"
          placeholder="Искать контакты..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <br />
        <Link className="search-link" to="/allContacts">
          Смотреть все контакты
        </Link>


        <div className="countAllContacts">
          <p>Количество контактов: <span style={{fontWeight:'900'}}>{users.length - 1 === -1 ? 0 : users.length - 1}</span></p>

        </div>
        <div className="cards">
          {users.length === 0 ? (
              <CircularProgress className="searchContactsLoadingAnimate" />
          ) :  (
            (filterContacts.length > 0 ? filterContacts : users)
            .filter(user => !user.isAdmin)
            .map((user) => {
              const urlImage = imageList.filter((imageUrl) => imageUrl.includes(user.avatarV4));
              // { вот тут нужно добавить так несли внутри user.isAdmin равен true то его на надо показывать }
              return (
                <div key={user.id} className="card">
                  <p className="userName">{user.name}</p>
                  <p className="userJob">{user.job}</p>
                  <img
                    className={urlImage.length > 0 ? 'userAvatarTrue' : 'userAvatarDefault'}
                    src={urlImage.length > 0 ? urlImage[0] : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt=""
                  />
                  <br />
                  <Link
                    className="userMoreInfoBtn"
                    to={`/singleContact/${user.id}`}
                  >
                    Узнать больше
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
  
};

export default SearchContacts;
