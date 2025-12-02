import React from 'react'
import './CSKHLayout.scss'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const CSKHLayout = () => {
  const { t } = useTranslation()

  const hoTroList = [
    {
      icon: '/cskh/begin.png',
      text: t('gtnm'),
      link: 'https://t.me/akbetsp1'
    },
    {
      icon: '/cskh/faq.png',
      text: 'AKBET - 02',
      link: 'https://t.me/akbetsp2'
    }
  ]

  const hoTroTrucTuyenList = [
    {
      icon: '/cskh/telecn.png',
      text: t('thongbao'),
      link: 'https://t.me/akbetchannelcommunity'
    },
    {
      icon: '/cskh/telegr.png',
      text: t('trochuyen'),
      link: 'https://t.me/akbetcommunitygroups'
    }
    // ,
    // {
    //   icon: '/cskh/web.gif',
    //   text: 'Live chat',
    //   link: 'https://direct.lc.chat/19179204/'
    // }
  ]

  return (
    <div className='container-cskh'>
      <div className='about-me-header'>
        <Link to='/'>
          <div className='about-me-icback'>
            <img src='/back.png' alt='Back' />
          </div>
        </Link>
        <div className='about-me-text'>{t('CSKH')}</div>
      </div>
      <div className='cskh_body'>
        <h3 className='h3_cskh'>{t('hotro')}</h3>
        <div className='cskh_section_hotro'>
          {hoTroList.map((item, index) => (
            <a href={item.link} key={index} className='cskh_link_hotro'>
              <img src={item.icon} alt='' className='icon-img' />
              <span>{item.text}</span>
            </a>
          ))}
        </div>

        <h3 className='h3_cskh'>{t('hotrotructuyen')}</h3>
        <div className='menu_cskh'>
          {hoTroTrucTuyenList.map((item, index) => (
            <div className='menu-item_cskh' key={index}>
              <Link to={item.link} className='item1'>
                <img src={item.icon} alt='Setting' /> {item.text}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className='box-height'></div>
    </div>
  )
}

export default CSKHLayout
