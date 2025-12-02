import React, { useState } from 'react'
import './UpdatePass.scss'
import { Link } from 'react-router-dom'
import { ModalCapCha } from '../../../../component/ModalCapCha'
import { Loading } from '../../../../component/Loading'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../../../component/MaHoaDuLieu'
import { useTranslation } from 'react-i18next'
import { Notify } from '../../../../component/Notify'
const UpdatePass = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [modalCapcha, setIsModalCapcha] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL

  const [Message, setMessage] = useState('')
  const [typenoti, settypenoti] = useState('error')
  const data =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))

  const handleSubmit = e => {
    e.preventDefault()
    if (!oldPassword || !newPassword) {
      setMessage(t('vuilongdiendayduthongtin'))
      settypenoti('error')
      return
    }
    setIsModalCapcha(true)
  }

  const handlePasswordChange = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/postrepass/${data._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password_old: oldPassword,
          password: newPassword
        })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(t('capnhatthanhcong'))
        settypenoti('success')
      } else {
        setMessage(
          result.message === 'Mật khẩu cũ không đúng'
            ? t('matkhaucukhongdung')
            : t('capnhatthatbaicryto')
        )
        settypenoti('error')
      }
    } catch (error) {
      setMessage(t('loikhithaydulieu'))
      settypenoti('error')
    } finally {
      setLoading(false)
      setIsModalCapcha(false)
    }
  }

  return (
    <>
      <div className='security-pass-container'>
        <div className='setting-header'>
          <Link to='/member'>
            <div className='setting-ic-back'>
              <img src='/back.png' alt='Back' />
            </div>
          </Link>
          <div className='setting-text'>{t('doimatkhaudangnhap')}</div>
        </div>
        <div style={{ margin: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div className='security-pass-form'>
              <div className='pass-form-group'>
                <div
                  className='pass-form-input'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--backgroud-color2)', // Màu nền xanh đậm giống hình
                    borderRadius: '8px', // Bo góc giống hình
                    padding: '10px 15px' // Điều chỉnh padding cho thẩm mỹ
                  }}
                >
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    id='old-password'
                    placeholder=' '
                    required
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                  />
                  <label htmlFor='old-password'>
                    (<span>*</span>) {t('matkhaucu')}
                  </label>
                  <span
                    className='hide-pass-img'
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? '🙈' : '👁'}
                  </span>
                </div>
              </div>

              <div className='pass-form-group'>
                <div className='pass-form-input'>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id='new-password'
                    placeholder=' '
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                  <label htmlFor='new-password'>
                    (<span>*</span>) {t('matkhaumoi')}
                  </label>
                  <span
                    className='hide-pass-img'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? '🙈' : '👁'}
                  </span>
                </div>
              </div>

              <button type='submit' className='pass-submit-button'>
                {t('xacnhan')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {Message && (
        <Notify message={Message} type={typenoti} setcontent={setMessage} />
      )}

      <ModalCapCha
        isOpen={modalCapcha}
        onClose={() => setIsModalCapcha(false)}
        loading={loading}
        setLoading={setLoading}
        Event={handlePasswordChange}
      />

      <Loading isLoading={loading} />
    </>
  )
}

export default UpdatePass
