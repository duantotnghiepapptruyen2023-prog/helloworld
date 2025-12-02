/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react'
// import "./UpdatePhone.scss";
import { Link } from 'react-router-dom'
import { ModalCapCha } from '../../../../component/ModalCapCha'
import { Loading } from '../../../../component/Loading'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../../../component/MaHoaDuLieu'
import { useTranslation } from 'react-i18next'
import { useUser } from '../../../../component/UserProvider/UserProvider'
import { Notify } from '../../../../component/Notify'
const UpdateVi = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [modalCapcha, setModalCapcha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [Message, setMessage] = useState('')
  const [typenoti, settypenoti] = useState('error')

  const { t } = useTranslation()
  const hasFetched = useRef(false)
  const apiUrl = process.env.REACT_APP_API_URL
  const userdata =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  const { user, fetchUser } = useUser()

  useEffect(() => {
    if (userdata && !hasFetched.current) {
      fetchUser(userdata._id)
      hasFetched.current = true
    }
  }, [userdata])

  useEffect(() => {
    if (user && user.crypto_wallet) {
      setPhoneNumber(user.crypto_wallet) // Gán giá trị cryto_wallet vào input
    }
  }, [user])

  const handleSubmit = e => {
    e.preventDefault()
    if (!phoneNumber) {
      setMessage(t('vuilongnhapdiachivi'))
      settypenoti('error')
      return
    }
    setModalCapcha(true) // Mở modal captcha để xác nhận
  }

  const handleUpdateWallet = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${apiUrl}/postcryto_wallet/${userdata._id}`, // Thay bằng URL thực tế của backend
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ cryto_wallet: phoneNumber }) // Gửi địa chỉ ví
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || t('capnhatthatbaicryto'))
      }

      setMessage(t('capnhatthanhcongcrypto'))
      settypenoti('success')
      setModalCapcha(false) // Đóng modal sau khi thành công
    } catch (error) {
      setMessage(error.message || 'Lỗi server, vui lòng thử lại.')
      settypenoti('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='security-phone-container'>
        <div className='setting-header'>
          <Link to='/member'>
            <div className='setting-ic-back'>
              <img src='/back.png' alt='Back' />
            </div>
          </Link>
          <div className='setting-text'>{t('capnhatvicrypto')}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='security-phone-form'>
            <div className='phone-form-group'>
              <div className='tcapnhat'>
                {t('diachivi')} (<span>*</span>)
              </div>
              <input
                type='text' // Đổi từ "tel" thành "text" vì đây là địa chỉ ví, không phải số điện thoại
                id='phone-number'
                placeholder={t('nhapdiachivi')}
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
              <small style={{ color: 'white' }}>
                {t('hotrorutusdt')}
              </small>
            </div>
            <button type='submit' className='phone-submit-button'>
              {t('capnhat')}
            </button>
          </div>
        </form>
      </div>
      {Message && (
        <Notify message={Message} type={typenoti} setcontent={setMessage} />
      )}

      <ModalCapCha
        isOpen={modalCapcha}
        onClose={() => setModalCapcha(false)}
        loading={loading}
        setloading={setLoading}
        Event={handleUpdateWallet} // Gọi hàm cập nhật khi xác nhận captcha
      />
      <Loading isLoading={loading} />
    </>
  )
}

export default UpdateVi
