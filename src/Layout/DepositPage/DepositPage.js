import React, { useState } from 'react'
import './DepositPage.scss'
import { Link, useNavigate } from 'react-router-dom'
import {
  getFromsessionstorage,
  getFromlocalstorage,
  saveTolocalstorage
} from '../../component/MaHoaDuLieu'
import { ModalCapCha } from '../../component/ModalCapCha'
import { Loading } from '../../component/Loading'
import { useTranslation } from 'react-i18next'
import Notify from '../../component/Notify/Notify'

const DepositPage = () => {
  const [amounts, setAmounts] = useState({
    qr: '',
    usdt: ''
  })
  const [receivedAmount, setReceivedAmount] = useState(0)
  const [modalCapcha, setisModalCapcha] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('qr')
  const { t } = useTranslation()
  const [message, setmessage] = useState('')
  const navigate = useNavigate()
  const apiUrl = process.env.REACT_APP_API_URL
  const data =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  const [loading, setloading] = useState(false)

  const depositAmounts = [100, 500, 1000, 5000, 10000, 50000, 100000, 200000]
  const depositAmountscrypto = [10, 50, 100, 500, 1000, 2000, 5000, 10000]

  const handleAmountClick = value => {
    setAmounts(prev => ({
      ...prev,
      [selectedMethod]: value
    }))
    setReceivedAmount(value)
  }

  const handleAmountChange = e => {
    const value = e.target?.value?.trim() || ''
    setAmounts(prev => ({
      ...prev,
      [selectedMethod]: value
    }))
    setReceivedAmount(Number(value))
  }

  const validateAmount = () => {
    const currentAmount = amounts[selectedMethod]
    if (currentAmount === '') {
      setmessage(t('vuilongnhaptien'))
      return false
    }

    const minAmount = selectedMethod === 'qr' ? 100 : 5

    if (Number(currentAmount) < minAmount) {
      setmessage(
        selectedMethod === 'qr' ? t('sotientoithieu100') : t('sotientoithieu5')
      )
      return false
    }

    return true
  }

  const showModalCapcha = () => {
    if (validateAmount()) return setisModalCapcha(true)
  }
  const handleDeposit = async () => {
    setloading(true)

    const depositType = selectedMethod === 'qr' ? 'deposit' : 'deposit-crypto'
    const apiUrl1 = `${apiUrl}/naptien/${data._id}`
    const requestBody = {
      amount: Number(amounts[selectedMethod]),
      type: depositType
    }

    try {
      const response = await fetch(apiUrl1, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      console.log(data)
      if (response.ok) {
        saveTolocalstorage('data_b', JSON.stringify(data.bankjson))
        setTimeout(() => {
          navigate(
            selectedMethod === 'qr'
              ? `/qr-nap-tien/${receivedAmount}?code=${data.transactions.code}`
              : `/usdt-nap-tien/${receivedAmount}?code=${data.transactions.code}`
          )
        }, 1000)

        console.log(data)
      } else {
        setmessage(data.message || t('napthatbai'))
      }
    } catch (error) {
      setmessage(t('loiketnoi'))
      console.error('Error during deposit:', error)
    } finally {
      setloading(false)
    }
  }

  return (
    <>
      <Loading isLoading={loading} />

      <div className='deposit-container'>
        <div className='deposit-header'>
          <Link to='/member'>
            <div className='deposit-left'>
              <img src='/back.png' alt='Back' />
            </div>
          </Link>
          <div className='deposit-title'>{t('naptien')}</div>
          <div className='deposit-right'></div>
        </div>

        {/* Chọn phương thức nạp tiền */}
        <div className='deposit-method'>
          <Link
            to='#'
            onClick={() => setSelectedMethod('qr')}
            className={`deposit-method-item ${
              selectedMethod === 'qr' ? 'active' : ''
            }`}
          >
            <img src='/quet_ma_qr.png' alt='Quét mã QR' />
            <div className='deposit-method-name'>{t('quetmaqa')}</div>
          </Link>
          <Link
            to='#'
            onClick={() => setSelectedMethod('usdt')}
            className={`deposit-method-item ${
              selectedMethod === 'usdt' ? 'active' : ''
            }`}
          >
            <img src='/icon_usdt.png' alt='USDT' />
            <div className='deposit-method-name'>{t('quetusdt')}</div>
          </Link>
        </div>

        {/* Nội dung nhập tiền */}
        <div
          className={`deposit-input ${
            selectedMethod === 'qr' ? 'qr-active' : ''
          }`}
        >
          {selectedMethod === 'qr' ? (
            <div className='deposit-input-qr'>
              <div className='deposit-input-box'>
                <input
                  type='number'
                  placeholder={t('hanmucgdtoithieu')}
                  name='amount'
                  value={amounts.qr}
                  onChange={handleAmountChange}
                  style={{
                    flex: 1,
                    fontSize: '16px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'white'
                  }}
                />
              </div>
              <div className='deposit-choice'>
                <div className='deposit-result'>= {receivedAmount} baht</div>
                <div className='deposit-units-label'>{t('donvitinh')}</div>
                <div className='deposit-buttons'>
                  {depositAmounts.map(value => (
                    <button
                      key={value}
                      onClick={() => handleAmountClick(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div className='deposit-warning-text'>{t('loinhac')}</div>
            </div>
          ) : (
            <div className='deposit-input-qr'>
              <div className='deposit-input-box'>
                <input
                  type='number'
                  placeholder={t('usdtmuonnap')}
                  value={amounts.usdt}
                  onChange={handleAmountChange}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white'
                  }}
                />
              </div>
              <div className='deposit-choice'>
                <div className='deposit-buttons'>
                  {depositAmountscrypto.map(value => (
                    <button
                      key={value}
                      onClick={() => handleAmountClick(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='box-height'></div>
        <div className='deposit-proceed'>
          <div className='btn-proceed' onClick={() => showModalCapcha()}>
            {t('naptien')}
          </div>
        </div>
      </div>
      {message && (
        <Notify message={message} type='error' setcontent={setmessage} />
      )}
      <ModalCapCha
        isOpen={modalCapcha}
        onClose={() => setisModalCapcha(false)}
        loading={loading}
        setloading={setloading}
        Event={handleDeposit}
      />
    </>
  )
}

export default DepositPage
