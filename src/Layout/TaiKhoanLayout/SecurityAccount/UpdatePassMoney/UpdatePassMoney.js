/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import './UpdatePassMoney.scss'
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
const UpdatePassMoney = () => {
  const initialData =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
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
  const hasFetched = useRef(false)
  const { user, fetchUser } = useUser()

  useEffect(() => {
    if (initialData && !hasFetched.current) {
      fetchUser(initialData._id)
      hasFetched.current = true
    }
  }, [initialData])

  const hasOldPassword = user
    ? user.withdrawal_password !== 0
    : initialData.withdrawal_password !== 0

  useEffect(() => {
    if (!hasOldPassword) {
      setOldPassword('')
    }
  }, [hasOldPassword])

  const handleSubmit = e => {
    e.preventDefault()
    if (hasOldPassword && !oldPassword) {
      setMessage(t('vuilongnhapmkcu'))
      settypenoti('error')
      return
    }
    if (!newPassword) {
      setMessage(t('vuilongnhapmkmoi'))
      return
    }
    setIsModalCapcha(true)
  }

  const handleUpdatePassword = async () => {
    setLoading(true)
    setIsModalCapcha(false)

    const url = `${apiUrl}/postmkruttien/${initialData._id}`
    const body = hasOldPassword
      ? {
          withdrawal_password_old: oldPassword,
          withdrawal_password: newPassword
        }
      : { withdrawal_password: newPassword }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(t('capnhatthanhcong'))
        settypenoti('success')
        await fetchUser(initialData._id)
        setOldPassword('')
        setNewPassword('')
      } else {
        setMessage(
          result.message === 'Mật khẩu cũ không đúng'
            ? t('matkhaucukhongdung')
            : t('matkhauphailaso')
        )
        settypenoti('error')
      }
    } catch (error) {
      console.error(t('loikhigoiapi'), error)
      setMessage(t('loikhithaydulieu'))
      settypenoti('error')
    } finally {
      setLoading(false)
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
          <div className='setting-text'>{t('doimkrutien')}</div>
        </div>
        <div style={{ margin: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div className='security-pass-form'>
              {hasOldPassword && (
                <div className='pass-form-group'>
                  <div className='pass-form-input'>
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      id='old-password'
                      placeholder=' '
                      required={hasOldPassword}
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
                      {showOldPassword ? 'Ẩn' : 'Xem'}
                    </span>
                  </div>
                </div>
              )}

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
                    {showNewPassword ? 'Ẩn' : 'Xem'}
                  </span>
                </div>
              </div>
              {/* {hasOldPassword && (
                <Link to={'/quemkruttien'} className='forgot-password-ruttien'>
                  {t('quenmatkhau')} ?
                </Link>
              )} */}

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
        Event={handleUpdatePassword}
      />

      <Loading isLoading={loading} />
    </>
  )
}

export default UpdatePassMoney
