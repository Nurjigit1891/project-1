import React from 'react'
import Navbar from '../../components/navbar/Navbar' // панель усправление 
import './Home.scss' // стили для страницы для компютерных экран
import './HomeMobile.scss' // стили для телефона  
import {motion} from 'framer-motion' // библиотека для анимации 




const Home = () => {
  return (
    <div>
      <motion.div className="home">
      <Navbar />


      <div className="home-info-block">
        <p>Проблемы на сайте? <br /> Звоните по номеру: <span style={{fontWeight: '700'}}> +996 (707) 78-00-48</span> </p>
      </div>
      </motion.div>
  
    </div>
  )
}

export default Home