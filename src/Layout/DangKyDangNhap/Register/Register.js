import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faLock,
  faPhone,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'
import { Input } from 'antd'
import { useSearchParams } from 'react-router-dom'
import Notify from '../../../component/Notify/Notify'

function Register ({ settab }) {
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL

  const [searchParams] = useSearchParams()
  const referralCode = searchParams.get('code')

  const [isPassword, setisPassword] = useState(true)
  const [isPassword2, setisPassword2] = useState(true)
  const [username, setusername] = useState('')
  const [phone, setphone] = useState('')
  const [password, setpassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mamoi, setmamoi] = useState(referralCode || '')
  const [error, setError] = useState('')

  const isValidPhone = number => {
    const phoneRegex =
      /^(0|\+84)(3[2-9]|5(6|8|9)|7(0|6|7|8|9)|8[1-9]|9[0-9])[0-9]{7}$/
    return phoneRegex.test(number)
  }
  const usernamePattern = /^[a-zA-Z0-9]+$/

  const validate = () => {
    if (!isValidPhone(phone)) {
      setError(t('sodthople'))
      return false
    }

    if (username.length < 8) {
      setError(t('tendangnhap8kytu'))
      return false
    }

    if (!usernamePattern.test(username)) {
      setError(t('tendangnhapchucaivaso'))
      return false
    }

    if (password !== confirmPassword) {
      setError(t('passkokhop'))
      return false
    }
    return true
  }

  const handleShowOtpModal = async e => {
    e.preventDefault()
    if (!validate()) {
      return
    }

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          phone: phone,
          code: referralCode || mamoi || ''
        })
      })
      const data = await response.json()
      if (data.message === 'Tên đăng nhập đã tồn tại') {
        setError(t('tendangnhapdatontai'))
      } else if (data.message === 'Mã mời không tồn tại') {
        setError(t('mamoikhongtontai'))
      } else if (data.message === 'Số điện thoại đã được đăng ký') {
        setError(t('sodtdadk'))
      } else {
        settab(t('login'))
      }
    } catch (error) {
      console.error(error)
      setError('Lỗi kết nối máy chủ')
    }
  }

  return (
    <>
      {error && <Notify message={error} type='error' setcontent={setError} />}

      <div className='div_login_container'>
        <form onSubmit={handleShowOtpModal}>
          <div className='div_login_item'>
            <FontAwesomeIcon icon={faUser} className='icon_user_login' />
            <Input
              placeholder={`${t('tendangnhap')}`}
              className='input_login'
              type='text'
              autoComplete='off'
              value={username}
              onChange={e =>
                setusername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))
              }
              required
            />
          </div>
          <div className='div_login_item'>
            <FontAwesomeIcon icon={faPhone} className='icon_user_login' />
            <Input
              placeholder={`${t('sodienthoai')}`}
              className='input_login'
              type='text'
              autoComplete='off'
              value={phone}
              onChange={e => setphone(e.target.value)}
              required
            />
          </div>

          <div className='div_login_item'>
            <FontAwesomeIcon icon={faLock} className='icon_user_login' />
            <Input
              placeholder={`${t('pass')}`}
              className='input_login'
              type={isPassword ? 'password' : 'text'}
              autoComplete='new-password'
              value={password}
              onChange={e => setpassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={isPassword ? faEye : faEyeSlash}
              className='icon_user_login'
              onClick={() => setisPassword(!isPassword)}
            />
          </div>

          <div className='div_login_item'>
            <FontAwesomeIcon icon={faLock} className='icon_user_login' />
            <Input
              placeholder={t('vuilongnhaplaimk')}
              className='input_login'
              type={isPassword2 ? 'password' : 'text'}
              autoComplete='new-password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={isPassword2 ? faEye : faEyeSlash}
              className='icon_user_login'
              onClick={() => setisPassword2(!isPassword2)}
            />
          </div>

          <div className='div_login_item'>
            <FontAwesomeIcon icon={faUser} className='icon_user_login' />
            <Input
              placeholder={t('mamoi')}
              className='input_login'
              type='text'
              autoComplete='off'
              value={mamoi}
              onChange={e => setmamoi(e.target.value)}
            />
          </div>

          <button className='btn_login_dangnhap' type='submit'>
            {t('register')}
          </button>
        </form>

        <div className='div_notk_dangky'>
          <div className='div_notk'>{t('bandacotk')}</div>
          <div className='div_dangky' onClick={() => settab(t('login'))}>
            {t('login')}
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
