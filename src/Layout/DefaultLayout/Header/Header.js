import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useState, useContext, useEffect, useRef } from 'react'
import './Header.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from '../../../locales/LanguageContext'
import { useNavigate } from 'react-router-dom'
import {
  getFromlocalstorage,
  getFromsessionstorage
} from '../../../component/MaHoaDuLieu'
import { useUser } from '../../../component/UserProvider/UserProvider'
import { Notify } from '../../../component/Notify'
import Marquee from '../../../component/Marquee/Marquee'

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const hasFetched = useRef(false)
  const { user, fetchUser } = useUser()
  const { currentLang, changeLanguage } = useContext(LanguageContext)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [notifyContent, setNotifyContent] = useState('')

  const data_user =
    JSON.parse(getFromlocalstorage('data_u')) ||
    JSON.parse(getFromsessionstorage('data_u'))
  useEffect(() => {
    if (data_user && !hasFetched.current) {
      fetchUser(data_user._id)
      hasFetched.current = true
    }
  }, [data_user])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLanguageChange = lang => {
    changeLanguage(lang)
    setIsDropdownOpen(false)
  }

  const handleClickTaiApp = () => {
    // setNotifyContent('') // Xóa nội dung cũ
    // setTimeout(() => {
    //   setNotifyContent(t('dangcapnhat')) // Set lại sau một chút để Notify nhận biết thay đổi
    // }, 10)
    navigate('/download')
  }

  return (
  <>
    <div className="header">
      
      <div className="header_top">
        {data_user ? (
          <div className='logo'>
            <img src='/logo.png' alt='Logo' />
            <div className='div_sotien_text'>
              <div className='div_sotien'>
                {' '}
                {user?.coins === 0
                  ? '0.00'
                  : Number((user?.coins || 0).toFixed(0)).toLocaleString(
                      'en-US'
                    ) || 0}
                    {' '}đ
              </div>
            </div>
          </div>
        ) : (
          <div className='logo'>
            <img src='/logo.png' alt='Logo' />
            <div
              className='div_login_text'
              onClick={() => navigate('/login')}
            >
              {t('login')}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className='div_language' onClick={toggleDropdown}>
            <img
              src={currentLang === 'vi' ? '/vina.png' : '/eng.png'}
              className='imglanguage'
            />

            <FontAwesomeIcon
              icon={faChevronDown}
              style={{ cursor: 'pointer' }}
            />

            {isDropdownOpen && (
              <div className='language-dropdown'>
                {currentLang === 'vi' ? (
                  <div
                    onClick={() => handleLanguageChange('en')}
                    className='language-item'
                  >
                    <img src='/eng.png' className='imglanguage' />
                    <span>EN</span>
                  </div>
                ) : (
                  <div
                    onClick={() => handleLanguageChange('vi')}
                    className='language-item'
                  >
                    <img src='/vina.png' className='imglanguage' />
                    <span>VN</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* hàng dưới – chữ chạy */}
      <Marquee />

    </div>

    {notifyContent && (
      <Notify
        message={notifyContent}
        setcontent={setNotifyContent}
        type='normal'
      />
    )}
  </>
)

}

export default Header
