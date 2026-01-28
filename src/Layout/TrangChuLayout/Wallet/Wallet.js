import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Wallet.scss'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../../component/MaHoaDuLieu'
import CheckRutTien from '../../../component/CheckRutTien/CheckRutTien'
import { useTranslation } from 'react-i18next'
import { Notify } from '../../../component/Notify'

const Wallet = () => {
  const userdata =
    getFromsessionstorage('data_u') || getFromlocalstorage('data_u')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [message, setMessage] = useState('')

  const handleWithdraw = async () => {
    await CheckRutTien(navigate)
  }

  return (
    <>
      <div className='wallet'>
        <div className='wallet-header'>
          <div className='title'>{t('hoantra')}</div>
          <div className='subtitle'>
            {t('lenden')} <span>1.9%</span>
          </div>
        </div>

        <div className='wallet-actions'>
          <Link
            to={userdata ? '/member/deposit' : '/login'}
            className='nav-item'
          >
            <img src='../wallet/nap.png' alt='Nạp tiền' className='icon' />
            <span>{t('naptien')}</span>
          </Link>

          <div
            className='nav-item'
            onClick={userdata ? handleWithdraw : () => navigate('/login')}
          >
            <img src='../wallet/rut.png' alt='Rút tiền' className='icon' />
            <span>{t('ruttien')}</span>
          </div>

          <div
            className='nav-item'
            onClick={() => {
              setMessage('')
              setTimeout(() => {
                setMessage(t('dangcapnhat'))
              }, 10)
            }}
          >
            <img src='../wallet/phantyso.png' alt='VIP' className='icon' />
            <span>{t('VIP')}</span>
          </div>
        </div>
      </div>
      {message && (
        <Notify message={message} setcontent={setMessage} type='normal' />
      )}
    </>
  )
}

export default Wallet
