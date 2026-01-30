/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Input } from 'antd'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faEye,
  faEyeSlash,
  faLock,
  faPhone
} from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Notify } from '../../component/Notify'

function QuenMatkhau () {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(true)
  const apiUrl = process.env.REACT_APP_API_URL



  const [isPassword, setisPassword] = useState(true)
  const { t } = useTranslation()

  const [phone, setphone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [type, setType] = useState('error')

  const isValidPhone = number => {
    const phoneRegex =
      /^(0|\+84)(3[2-9]|5(6|8|9)|7(0|6|7|8|9)|8[1-9]|9[0-9])[0-9]{7}$/
    return phoneRegex.test(number)
  }
  const validate = () => {
    if (!isValidPhone(phone)) {
      setError('Số điện thoại không hợp lệ')
      return false
    }

    return true
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => navigate('/login'), 300)
  }

  useEffect(() => {
    const modalRoot = document.querySelector('.ant-modal-root')
    if (modalRoot && isVisible) {
      modalRoot.classList.add('dangky_dangnhap')
    }
    return () => {
      modalRoot?.classList.remove('dangky_dangnhap')
    }
  }, [isVisible])



  const handlequenmk = async () => {
    if (!validate()) {
      return
    }
    try {
      const response = await fetch(`${apiUrl}/postquenmk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone,
          password
        })
      })
      if (response.ok) {
        setType('success')
        setError(t('capnhatthanhcong'))
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (error) {
      console.error(error)
      setType('error')
      setError(t('loiketnoi'))
    }
  }

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      closable={false}
      wrapClassName='dangky_dangnhap'
    >
      {error && <Notify message={error} type={type} setcontent={setError} />}
      <div className='div_dangky_dangnhap'>
        <div className='header_dangky_dangnhap'>
          <FontAwesomeIcon
            icon={faChevronLeft}
            className='icon_back_dangnhap_dangky'
            onClick={handleClose}
          />
        </div>
        <div className='div_logo_dangky_dangnhap'>
          <img src='/logo.png' alt='' className='img_logo' />
        </div>
        <div className='div_dangky_dangnhap_content'>
          <div className='div_dangky_dangnhap_tab'>
            <div className='div_login_container'>
              <div className='div_quenmk_title'>{t('quenmatkhau')}</div>
              <form onSubmit={handlequenmk}>
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
                    placeholder={`${t('matkhaumoi')}`}
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

                <button type='submit' className='btn_login_dangnhap'>
                  {t('thaydoi')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default QuenMatkhau
