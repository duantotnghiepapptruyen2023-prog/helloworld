import React from 'react'
import './CSKHLayout.scss'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const CSKHLayoutNew = () => {
  const { t } = useTranslation()

  const hoTroList = [
    { icon: '/cskh/cskh.webp', text: t('gtnm'), link: 'https://t.me/bt66ad' },
    {
      icon: '/cskh/cskh.webp',
      text: 'BT66 - 02',
      link: 'https://t.me/bt66cs1'
    }
  ]

  const hoTroTrucTuyenList = [
    {
      icon: '/cskh/telecn.png',
      text: t('thongbao'),
      link: 'https://t.me/bt66ad'
    },
    {
      icon: '/cskh/telegr.png',
      text: t('trochuyen'),
      link: 'https://t.me/bt66ad'
    }
  ]

  return (
    <div className='cskh-container'>
      <header className='cskh-header'>
        <Link to='/' className='btn-back'>
          <img src='/back.png' alt='Back' />
        </Link>
        <h2 className='title'>{t('CSKH')}</h2>
      </header>

      <main className='cskh-content'>
        <section className='section-box'>
          <h3>{t('hotro')}</h3>
          <div className='item-grid'>
            {hoTroList.map((item, index) => (
              <a href={item.link} key={index} className='item-card'>
                <img src={item.icon} alt='' />
                <span>{item.text}</span>
              </a>
            ))}
          </div>
        </section>

        <section className='section-box'>
          <h3>{t('hotrotructuyen')}</h3>
          <div className='item-list'>
            {hoTroTrucTuyenList.map((item, index) => (
              <Link to={item.link} key={index} className='item-row'>
                <img src={item.icon} alt='' />
                <span>{item.text}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <div className='bottom-space'></div>
    </div>
  )
}

export default CSKHLayoutNew
