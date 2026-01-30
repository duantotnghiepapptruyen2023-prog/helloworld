/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Loading } from '../../component/Loading'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../component/MaHoaDuLieu'
import { useTranslation } from 'react-i18next'
import { useUser } from '../../component/UserProvider/UserProvider'
import { Notify } from '../../component/Notify'
import { useNavigate } from 'react-router-dom'
const QuenMatKhauRutTien = () => {
  const initialData =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL



  const [Message, setMessage] = useState('')
  const [typenoti, settypenoti] = useState('error')
  const hasFetched = useRef(false)
  const { user, fetchUser } = useUser()

  const navigate = useNavigate()

  useEffect(() => {
    if (initialData && !hasFetched.current) {
      fetchUser(initialData._id)
      hasFetched.current = true
    }
  }, [initialData])
  console.log(user)

  const handleUpdatePassword = async () => {
    setLoading(true)

    const url = `${apiUrl}/postquenmkruttien`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          withdrawal_password: newPassword
        })
      })

      if (response.ok) {
        setMessage(t('capnhatthanhcong'))
        settypenoti('success')
        await fetchUser(initialData._id)
        setNewPassword('')
        setTimeout(() => {
          navigate('/member/security/security-password-withdrawal')
        }, 2000)
      } else {
        setMessage(t('matkhauphailaso'))
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
          <Link to='/'>
            <div className='setting-ic-back'>
              <img src='/back.png' alt='Back' />
            </div>
          </Link>
          <div className='setting-text'>{t('doimkrutien')}</div>
        </div>
        <div style={{ margin: '20px' }}>
          <form onSubmit={handleUpdatePassword}>
            <div className='security-pass-form'>
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
                    {showNewPassword ? '😎' : '👀'}
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


      <Loading isLoading={loading} />
    </>
  )
}

export default QuenMatKhauRutTien
