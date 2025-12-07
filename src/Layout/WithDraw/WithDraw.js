import React, { useState, useEffect, useRef } from 'react'
import './WithDraw.scss'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../component/MaHoaDuLieu'
import { ModalCapCha } from '../../component/ModalCapCha'
import CheckCrypto from '../../component/CheckCrypto/CheckCrypto'
import { Loading } from '../../component/Loading'
import { useTranslation } from 'react-i18next'
import Notify from '../../component/Notify/Notify'
import { useUser } from '../../component/UserProvider/UserProvider'
import ModalChonPhuongThuc from '../DepositPage/ModalChonPhuongThuc'

const WithDraw = () => {
  const navigate = useNavigate()
  const [amounts, setAmounts] = useState({
    qr: '',
    usdt: ''
  })
  const [receivedAmount, setReceivedAmount] = useState(0)
  const [password, setPassword] = useState('')
  const [method, setMethod] = useState('qr')
  const [loading, setLoading] = useState(false)
  const [message, setNotification] = useState('')
  const [modalCapcha, setIsModalCapcha] = useState(false)
  const { user, fetchUser } = useUser()
  const hasFetched = useRef(false)
  const [modalSelect, setModalSelect] = useState(true);

  const data =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  const depositAmounts = [50, 100, 200, 500, 1000, 5000, 10000, 20000]
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL
  useEffect(() => {
    if (data && !hasFetched.current) {
      fetchUser(data._id)
      hasFetched.current = true
    }
  }, [data])
  const totalBalance =
    Number((user?.coins || 0).toFixed(0)).toLocaleString('en-US') || 0

  const handleAmountClick = value => {
    setAmounts(prev => ({
      ...prev,
      [method]: value // Cập nhật giá trị cho method hiện tại (qr hoặc usdt)
    }))
    setReceivedAmount(value * 1000) // 1 coin = 1000 VND
  }

  const handleInputChange = e => {
    const value = Number(e.target.value)
    setAmounts(prev => ({
      ...prev,
      [method]: value // Cập nhật giá trị cho method hiện tại
    }))
    setReceivedAmount(value * 1000) // Cập nhật receivedAmount
  }
  const handleSelectMethod = (method) => {
    setMethod(method);
    setModalSelect(false);
  };
  const handleChange = e => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '')
    setPassword(numericValue)
  }

  const handleWithdraw = async () => {
    const currentAmount = amounts[method] // Lấy giá trị tương ứng với method
    if (currentAmount < 50) {
      setNotification(t('sotientoithieu100'), 'error')
      return
    }

    if (!password) {
      setNotification(t('passruttien'), 'error')
      return
    }
    setIsModalCapcha(true)
  }

  const handleCapchaSubmit = async () => {
    setIsModalCapcha(false)
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/ruttien/${data._id}`, {
        amount: amounts[method], // Sử dụng giá trị tương ứng với method
        type: method === 'qr' ? 'withdraw' : 'withdraw-crypto',
        mkruttien: password
      })

      if (response.status === 200) {
        setNotification(t('ruttienthanhcong'), 'success')
        setAmounts(prev => ({
          ...prev,
          [method]: '' // Reset giá trị sau khi rút tiền thành công
        }))
        setReceivedAmount(0)
        setPassword('')
        setTimeout(() => {
          navigate(`/member/transactionhistory`)
        }, 1000)
      }
    } catch (error) {
      let errorMessage = t('coloikhiruttien')
      if (error.response) {
        errorMessage = error.response.data.error || t('ruttienthatbai')
        setNotification(
          errorMessage === 'Mật khẩu không chính xác'
            ? t('matkhaukhongchinhxac')
            : t('sodukhongdu')
        )
        console.log('Lỗi từ server:', error.response.data.error)
      } else {
        setNotification(t('sodukhongdu'))
        console.log('Lỗi:', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Loading isLoading={loading} />
      <ModalChonPhuongThuc
        isOpen={modalSelect}
        onSelect={handleSelectMethod}
        page="withdraw"
      />
      <div className='deposit-container'>
        <div className='deposit-header'>
          <Link to='/member'>
            <div className='deposit-left'>
              <img src='/back.png' alt='Back' />
            </div>
          </Link>
          <div className='deposit-title'>{t('ruttien')}</div>
          <div className='deposit-right'></div>
        </div>

        {/* <div className='deposit-method'>
          <div
            className={`deposit-method-item ${method === 'qr' ? 'active' : ''}`}
            onClick={() => setMethod('qr')}
          >
            <img src='/quet_ma_qr.png' alt='Ngân hàng' />
            <div className='deposit-method-name'>{t('rutphapdinh')}</div>
          </div>
          <div
            className={`deposit-method-item ${
              method === 'usdt' ? 'active' : ''
            }`}
            onClick={() => CheckCrypto(navigate, setMethod)}
          >
            <img src='/icon_usdt.png' alt='USDT' />
            <div className='deposit-method-name'>{t('rutusdt')}</div>
          </div>
        </div> */}

        {method && (
          <>
            <div className='deposit-input'>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--backgroud-color2)', // Màu nền xanh đậm giống hình
                  borderRadius: '8px', // Bo góc giống hình
                  padding: '10px 15px' // Điều chỉnh padding cho thẩm mỹ
                }}
              >
                <input
                  type='number'
                  placeholder={t('nhapsocoin')}
                  value={amounts[method] || ''} // Hiển thị giá trị tương ứng với method
                  onChange={handleInputChange}
                  style={{
                    flex: 1, // Chiếm toàn bộ không gian còn lại
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: 'none', // Loại bỏ viền input
                    outline: 'none', // Loại bỏ viền khi focus
                    fontSize: '16px',
                    padding: '0' // Loại bỏ padding bên trong input
                  }}
                  autoComplete='off'
                />

                <button
                  style={{
                    backgroundColor: 'var(--button-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    handleInputChange({
                      target: { value: totalBalance.replace(/,/g, '') }
                    })
                  }}
                >
                  {t('tatca')}
                </button>
              </div>
              <div className='rut-info'>
                <span className='title-rut'>{t('toidacotherut')}</span>
                <img
                  src='/vnd.webp'
                  alt='USDT'
                  style={{ width: '20px', height: '20px' }}
                />
                <span>{totalBalance} point</span>
              </div>
              <div className='deposit-choice'>
                <div className='deposit-result'>
                  = {receivedAmount.toLocaleString('en-US')} VND
                </div>
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--backgroud-color2)',
                  borderRadius: '8px',
                  padding: '10px 15px',
                  marginTop: '10px'
                }}
              >
                <input
                  style={{
                    flex: 1,
                    fontSize: '16px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'white'
                  }}
                  type='password'
                  name='password_withdrawal'
                  value={password}
                  onChange={handleChange}
                  placeholder={t('passruttien')}
                  autoComplete='new-password'
                  required
                />
              </div>
              <div className="luuy-box">
                <div className="luuy-title">
                  <img src="/vnd.webp" alt="warning" />
                  <span>LƯU Ý</span>
                </div>

                <ul className="luuy-list">
                  <li>Hạn mức giao dịch phụ thuộc vào ngân hàng.</li>
                  <li>Mỗi lần chỉ thực hiện 1 giao dịch.</li>
                  <li>Chỉ giao dịch trong khung giờ quy định (hoặc nhanh 24/7 nếu ngân hàng hỗ trợ).</li>
                  <li>Vui lòng kiểm tra kỹ số tài khoản, nội dung, số tiền trước khi gửi.</li>
                  <li>Phí nạp: 0%</li>
                </ul>
              </div>


            </div>
            <div className='deposit-proceed'>
              <button
                type='button'
                className='btn-proceed'
                onClick={handleWithdraw}
                disabled={loading}
              >
                {t('ruttien')}
              </button>
            </div>
          </>
        )}
      </div>
      {message && <Notify message={message} setcontent={setNotification} />}
      <ModalCapCha
        isOpen={modalCapcha}
        onClose={() => setIsModalCapcha(false)}
        loading={loading}
        setloading={setLoading}
        Event={handleCapchaSubmit}
      />
    </>
  )
}

export default WithDraw
