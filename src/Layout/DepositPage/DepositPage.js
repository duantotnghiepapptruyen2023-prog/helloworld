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
import ModalChonPhuongThuc from './ModalChonPhuongThuc'

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
  const [modalSelect, setModalSelect] = useState(true);

  const depositAmounts = [300, 500, 1000, 5000, 10000, 50000, 100000, 200000]
  const depositAmountscrypto = [10, 50, 100, 500, 1000, 2000, 5000, 10000]

  const handleAmountClick = value => {
    setAmounts(prev => ({
      ...prev,
      [selectedMethod]: value
    }))
    setReceivedAmount(value * 1000)
  }
  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setModalSelect(false);
  };
  const handleAmountChange = e => {
    const value = e.target?.value?.trim() || ''
    setAmounts(prev => ({
      ...prev,
      [selectedMethod]: value
    }))
    setReceivedAmount(Number(value) * 1000)
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
      if (response.ok) {
        // saveTolocalstorage('data_b', JSON.stringify(data.bankjson))
        // setTimeout(() => {
        //   navigate(
        //     selectedMethod === 'qr'
        //       ? `/qr-nap-tien/${receivedAmount}?code=${data.transactions.code}`
        //       : `/usdt-nap-tien/${receivedAmount}?code=${data.transactions.code}`
        //   )
        // }, 1000)
        window.location.href = data.data.content;
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
      <ModalChonPhuongThuc
        isOpen={modalSelect}
        onSelect={handleSelectMethod}
      />
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


        {/* Nội dung nhập tiền */}
        <div
          className={`deposit-input ${selectedMethod === 'qr' ? 'qr-active' : ''
            }`}
        >
          {selectedMethod === 'qr' ? (
            <div className='deposit-input-qr'>
              {/* <div className='deposit-result'>Nhập số tiền</div> */}
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
                {/* <div className='deposit-result'>
                  = {Number(receivedAmount).toLocaleString('vi-VN')} 
                </div> */}
                {/* <div className='deposit-units-label'>{t('donvitinh')}</div> */}
                <div className='deposit-buttons'>
                  {depositAmounts.map(value => (
                    <button
                      key={value}
                      onClick={() => handleAmountClick(value)}
                    >
                      {value.toLocaleString('vi-VN')}
                    </button>
                  ))}
                </div>
              </div>
              {/* <div className='deposit-warning-text'>{t('loinhac')}</div> */}
              <div className="luuy-box">
                <div className="luuy-title">
                  <img src="/vnd.webp" alt="warning" />
                  <span>บันทึก</span>
                </div>

                <ul className="luuy-list">

                  <li>วงเงินในการทำธุรกรรมขึ้นอยู่กับธนาคาร</li>

                  <li>อนุญาตให้ทำธุรกรรมได้เพียงหนึ่งครั้งต่อหนึ่งรายการ</li>

                  <li>การทำธุรกรรมจะดำเนินการเฉพาะในช่วงเวลาทำการที่กำหนด (หรือ 24 ชั่วโมง 7 วันต่อสัปดาห์ หากธนาคารรองรับ)</li>

                  <li>โปรดตรวจสอบหมายเลขบัญชี รายละเอียด และจำนวนเงินอย่างละเอียดก่อนทำการส่ง</li>

                  <li>ค่าธรรมเนียมการฝาก: 0%</li>

                </ul>
              </div>
            </div>
          ) : (
            <div className='deposit-input-qr'>
              <div className='deposit-result'>ป้อนจำนวนเงิน</div>
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
