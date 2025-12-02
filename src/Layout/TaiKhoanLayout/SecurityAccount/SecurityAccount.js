import React from 'react'
import { Link } from 'react-router-dom'
import './SecurityAccount.scss'
import { useTranslation } from 'react-i18next'

const SecurityAccount = () => {
  const { t } = useTranslation()

  return (
    <div className='security-container'>
      <div className='setting-header'>
        <Link to='/member'>
          <div className='setting-ic-back'>
            <img src='/back.png' alt='Back' />
          </div>
        </Link>
        <div className='setting-text'>{t('baomattk')}</div>
      </div>

      <div className='security-menu'>
        <Link to='/member/security/security-phone'>
          <div className='security-menu-item'>
            <div className='menu-item-title'>{t('sodienthoai')}</div>
            <img src='/next.png' alt='Next' />
          </div>
        </Link>
        <Link to='/member/security-bank'>
          <div className='security-menu-item'>
            <div className='menu-item-title'>{t('tkbank')}</div>
            <img src='/next.png' alt='Next' />
          </div>
        </Link>
        <Link to='/member/security/security-bep'>
          <div className='security-menu-item'>
            <div className='menu-item-title'>{t('diachivi')} BEP20</div>
            <img src='/next.png' alt='Next' />
          </div>
        </Link>
        <Link to='/member/security/security-pass'>
          <div className='security-menu-item'>
            <div className='menu-item-title'>{t('passdangnhap')}</div>
            <img src='/next.png' alt='Next' />
          </div>
        </Link>
        <Link to='/member/security/security-password-withdrawal'>
          <div className='security-menu-item'>
            <div className='menu-item-title'>{t('passruttienthaydoi')}</div>
            <img src='/next.png' alt='Next' />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default SecurityAccount
