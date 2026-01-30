import { useTranslation } from 'react-i18next'
import './Footer.scss'
import { useLocation } from 'react-router-dom'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../../component/MaHoaDuLieu'

function Footer () {
  const { t } = useTranslation()
  const location = useLocation()
  const userdata =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))

  const navbar = [
    {
      name: t('trangchu'),
      path: '/',
      icon: '/footer/icon_home_active.png',
      iconactive: '/footer/icon_home_active.png'
    },

    // {
    //   name: t('hoahong'),
    //   path: userdata ? '/agent/bonus-direct' : '/login',
    //   icon: '/footer/icon_bouns.png',
    //   iconactive: '/footer/icon_bouns.png'
    // },
    {
      name: t('trogiup'),
      path: '/cskh',
      icon: '/footer/icon_bouns.png',
      iconactive: '/footer/icon_bouns.png'
    },
    {
      name: t('phantyso'),
      path: '/',
      icon: '/footer/icon_game.png',
      iconactive: '/footer/icon_game.png'
    },
    {
      name: t('khuyenmai'),
      path: '/khuyenmai',
      icon: '/footer/icon_ung.png',
      iconactive: '/footer/icon_ung.png'
    },
    {
      name: t('taikhoan'),
      path: userdata ? '/member' : '/login',
      icon: '/footer/icon_service.png',
      iconactive: '/footer/icon_service.png'
    }
  ]

  return (
    <div className='footer'>
      {navbar.map((item, index) => (
        <a
          href={item.path}
          key={index}
          className={`item_link_footer 
        ${index === 2 ? 'always_active' : ''} 

        ${index === 2 ? 'center_item' : ''}`}
        >
          <div className='icon_wrapper'>
            <img
              src={
                location.pathname === item.path ? item.iconactive : item.icon
              }
              alt={item.name}
              className='icon_footer'
            />
          </div>
          <p>{item.name}</p>
        </a>
      ))}
    </div>
  )
}

export default Footer
