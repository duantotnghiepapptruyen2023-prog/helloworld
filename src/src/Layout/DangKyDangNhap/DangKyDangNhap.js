import './DangKyDangNhap.scss'
import { Modal } from 'antd'
import { Login } from './Login'
import { Register } from './Register'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../locales/i18n'
function DangKyDangNhap () {
  const { t } = useTranslation()

  const [tab, settab] = useState(`${t('login')}`)
  console.log(tab)
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => navigate('/'), 300)
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

  useEffect(() => {
    if (i18n.isInitialized) {
      settab(t('login'))
    }
  }, [i18n.language])
  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      closable={false}
      wrapClassName='dangky_dangnhap'
    >
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
            <div className='btn_tab_container'>
              <div
                className={
                  'btn_tab_item' +
                  (tab === `${t('login')}` ? ' btn_tab_item_active' : '')
                }
                onClick={() => settab(`${t('login')}`)}
              >
                {t('login')}
              </div>
              <div
                className={
                  'btn_tab_item' +
                  (tab === `${t('register')}` ? ' btn_tab_item_active' : '')
                }
                onClick={() => settab(`${t('register')}`)}
              >
                {t('register')}
              </div>
            </div>
            {tab === `${t('login')}` ? (
              <Login handelclose={handleClose} settab={settab} />
            ) : (
              <Register settab={settab} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DangKyDangNhap
