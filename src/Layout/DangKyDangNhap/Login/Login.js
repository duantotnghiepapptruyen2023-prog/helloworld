import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Login.scss'
import { faEye, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'
import { Input, Checkbox } from 'antd'
import { Link } from 'react-router-dom'
import Notify from '../../../component/Notify/Notify'
import {
  saveTolocalstorage,
  saveTosessionstorage
} from '../../../component/MaHoaDuLieu'
import ModalCapCha from '../../../component/ModalCapCha/ModalCapCha'

function Login ({ handelclose, settab }) {
  const apiUrl = process.env.REACT_APP_API_URL
  const [isPassword, setisPassword] = useState(true)
  const [isOpenCapcha, setisOpenCapcha] = useState(false)
  const { t } = useTranslation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(false)

  const handeleshowmodal = e => {
    e.preventDefault()
    setisOpenCapcha(true)
  }

  const handelsubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })

      const data = await response.json()
      if (data.error === 'Tên đăng nhập không tồn tại') {
        setError(t('tendangnhapkotontai'))
        setisOpenCapcha(false)
      } else if (data.error === 'Mật khẩu không chính xác') {
        setError(t('matkhaukhongchinhxac'))
        setisOpenCapcha(false)
      } else if (data.error === 'Tài khoản đã bị khóa') {
        setError(t('tkdabikhoa'))
        setisOpenCapcha(false)
      } else {
        if (!remember) {
          saveTosessionstorage('data_u', JSON.stringify(data))
        } else {
          saveTolocalstorage('data_u', JSON.stringify(data))
        }
        setisOpenCapcha(false)
        handelclose()
      }
    } catch (error) {
      setError(error)
    }
  }
  console.log(remember)
  return (
    <>
      {error && <Notify message={error} type='error' setcontent={setError} />}

      <div className='div_login_container'>
        <form onSubmit={handeleshowmodal}>
          <div className='div_login_item'>
            <FontAwesomeIcon icon={faUser} className='icon_user_login' />
            <Input
              placeholder={`${t('tendangnhap')}`}
              className='input_login'
              type='text'
              autoComplete='off'
              value={username}
              onChange={e =>
                setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))
              }
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
              onChange={e => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={isPassword ? faEye : faEyeSlash}
              className='icon_user_login'
              onClick={() => setisPassword(!isPassword)}
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 10,
              justifyContent: 'space-between'
            }}
            onClick={() => setRemember(!remember)}
          >
            <Checkbox
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ fontSize: 14 }}
            >
              Ghi nhớ đăng nhập
            </Checkbox>
            <Link to={'/quenmatkhau'} style={{color:'#f7931e'}}>Quên mật khẩu?</Link>
          </div>

          <button type='submit' className='btn_login_dangnhap'>
            {t('login')}
          </button>
        </form>

        <div className='div_notk_dangky'>
          <div className='div_notk'>{t('banchuacotk')}</div>
          <div className='div_dangky' onClick={() => settab(t('register'))}>
            {t('register')}
          </div>
        </div>
      </div>
      <ModalCapCha
        isOpen={isOpenCapcha}
        onClose={() => setisOpenCapcha(false)}
        Event={handelsubmit}
      />
    </>
  )
}

export default Login
