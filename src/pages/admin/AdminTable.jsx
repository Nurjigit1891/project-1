import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../server/firebase/firebase-config';
import { getDownloadURL, listAll, ref , deleteObject } from 'firebase/storage';
import './AdminTable.scss';
import Navbar from '../../components/navbar/Navbar';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert'; // Алерт который с MUI
import AlertTitle from '@mui/material/AlertTitle';  // Алерт который с MUI
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button
} from '@mui/material';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [showAdminDel,setShowAdminDel] = useState (false)

  const userCollectionRef = collection(db, 'users');
  const imageListRef = ref(storage, 'images/');


  //получение картинок (аватаров с firebase)
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

  // для получение юзеров с FireBase
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

  // для удаления юзеров с FireBase 
  const handleDeleteUser = async (userId) => {
    try {
        const userToDelete = users.find((user) => user.id === userId);
        
        if (userToDelete && userToDelete.isAdmin) {
            setShowAdminDel(true);
            setTimeout(() => {setShowAdminDel(false)}, 5000);
        } else if (!userToDelete.isAdmin) {
            // Если у пользователя есть аватарка, удаляем ее из хранилища
            if (userToDelete.avatarV4) {
                const imageRef = ref(storage, 'images/' + userToDelete.avatarV4);
                await deleteObject(imageRef);
            }

            // Удалить пользователя из Firestore
            await deleteDoc(doc(db, 'users', userId));
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        }
    } catch (error) {
        console.log("Error deleting user:", error);
    }
};

  return (
    <div className="adminPage">
      <div className="">
        {showAdminDel && (

        <Alert severity="error">
          <AlertTitle>Ошибка</AlertTitle>
          Вы не можете удалить адинстратора
        </Alert>
        )}
      </div>

      <Navbar />
      <TableContainer component={Paper} className="adminTable">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>More Info</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.filter(user => !user.isAdmin).map((user) => {
              const urlImage = imageList.filter((imageUrl) => imageUrl.includes(user.avatarV4));
              return (
              <TableRow key={user.id}>
                <TableCell className="AvatarCell">
                  <Avatar src={urlImage.length > 0 ? urlImage[0] : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                </TableCell>
                <TableCell style={{fontWeight: 700}} className='table-name'>{user.name}</TableCell>
                <TableCell style={{fontWeight: 700}}>{user.lastName}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell style={{fontWeight: 700}}>{user.email}</TableCell>
                <TableCell>{user.region}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>{user.moreInfo}</TableCell>
                <TableCell className="DeleteButton">
                  <Button color="secondary" onClick={() => handleDeleteUser(user.id)}>Удалить</Button>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AdminPage;
