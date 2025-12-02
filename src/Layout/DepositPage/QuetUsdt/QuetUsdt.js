import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './QuetUsdt.scss'
import CountdownTimer from '../../../component/CountDownTimer/CountDownTimer'
import { useTranslation } from 'react-i18next'
import Notify from '../../../component/Notify/Notify'

const QuetUsdt = () => {
  const usdtAddress = '0x293da07b2686aA53bD7CcafD5Db423939B31B571'
  const [notification, setNotification] = useState('')
  const { t } = useTranslation()

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text)
    setNotification(t('dacopy'))
  }

  return (
    <div className='container-quetusdt'>
      {notification && (
        <Notify
          message={notification}
          setcontent={setNotification}
          type='success'
        />
      )}
      <div className='setting-header'>
        <Link to='/member/deposit'>
          <div className='setting-ic-back'>
            <img src='/back.png' alt='Back' />
          </div>
        </Link>
        <div className='setting-text'>{t('xacnhannaptien')}</div>
        <CountdownTimer initialTime={300} />
      </div>

      <div className='body-qr'>
        <div className='maqr-usdt'>
          <div className='uniform-usdt'>
            <p>{t('diachinhanusdt')}:</p>
            <p
              className='usdt-address'
              style={{ marginBottom: '10px', marginTop: '10px' }}
            >
              <b>{usdtAddress}</b>
              <img
                src='/copy.png'
                className='icon-copy'
                alt='Copy'
                onClick={() => copyToClipboard(usdtAddress)}
              />
            </p>
            <p>
              {t('mangluoi')}: <b>BEP20</b>
            </p>
          </div>
          <div className='qr-usdt'>
            <img src='/bankusdt.jpg?t=12123423213' alt='QR Code' />
          </div>
          <div className='alert-container'>
            <span className='alert-icon'>⚠️</span>
            <span className='alert-message'>Nạp tối thiểu là 5 USDT.</span>
          </div>
        </div>
        <div className='btnnapproceed'>
          <div className='btn-proceed-nap'>
            <Link to='/member/transactionhistory'>{t('xacnhan')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuetUsdt
