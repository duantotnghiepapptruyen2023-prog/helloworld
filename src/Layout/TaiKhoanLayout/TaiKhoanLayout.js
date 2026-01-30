import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './TaiKhoanLayout.scss'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../component/MaHoaDuLieu'
import CheckRutTien from '../../component/CheckRutTien/CheckRutTien'
import { Loading } from '../../component/Loading'
import { useTranslation } from 'react-i18next'
import { useUser } from '../../component/UserProvider/UserProvider'
import { Notify } from '../../component/Notify'
import CheckNapTien from '../../component/CheckRutTien/CheckNapTien'

const TaiKhoanLayout = () => {
  const userdata =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))

  const hasFetched = useRef(false)
  const navigate = useNavigate()
  const [isLoading, setisLoading] = useState(false)
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL
  const { user, fetchUser } = useUser()
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (userdata && !hasFetched.current) {
      fetchUser(userdata._id)
      hasFetched.current = true
    }
  }, [userdata, fetchUser])

  const dangxuat = () => {
    sessionStorage.clear()
    localStorage.clear()
    window.location.href = '/'
  }

  const handleRutTien = async () => {
    await CheckRutTien(navigate)
  }
 const handleNapTien = async () => {
    await CheckNapTien(navigate)
  }
  const handleRutTienGame = async () => {
    try {
      setisLoading(true)
      const res = await fetch(`${apiUrl}/withdraw-game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: userdata })
      })
      if (res.ok) fetchUser(userdata._id)
    } catch (err) {
      console.error(err)
    } finally {
      setisLoading(false)
    }
  }

  const menuItems = [
    {
      icon: './account/lsgd.png',
      label: t('lsgd'),
      path: '/member/transactionhistory'
    },
    // {
    //   icon: './account/lstc.png',
    //   label: t('lstc'),
    //   path: '/member/bettinghistory'
    // },
    {
      icon: './account/bank.png',
      label: t('tkbank'),
      path: '/member/security-bank'
    },
    {
      icon: './account/trc20.png',
      label: `${t('diachivi')} BEP20`,
      path: '/member/security/security-bep'
    },
    { icon: './footer/icon_bouns.png', label: t('gthieubb'), path: '/daily' },
    {
      icon: './account/passrt.png',
      label: t('passruttienthaydoi'),
      path: '/member/security/security-password-withdrawal'
    },
    {
      icon: './account/pass.png',
      label: t('passdangnhap'),
      path: '/member/security/security-pass'
    },
    {
      icon: './account/sdt.png',
      label: t('sodienthoai'),
      path: '/member/security/security-phone'
    },
    {
      icon: './account/csbm.png',
      label: t('chinhsachbaomat'),
      path: '/member/setting/policy'
    },
    {
      icon: './account/vct.png',
      label: t('vechungtoi'),
      path: '/member/setting/aboutme'
    }
  ]

  return (
    <>
      <div className='tk-page-container'>
        {/* Header */}
        <div className='tk-header'>
          <h2>{t("taikhoan")}</h2>
          <button className='tk-logout' onClick={dangxuat}>
            {t("dangxuat")}
          </button>
        </div>

        {/* Avatar + Info */}
        <div className='tk-profile-card'>
          <div className='tk-profile-left'>
            <div className='tk-avatar'>
              <img src='/avatar.png' alt='' />
            </div>
            <div>
              <div className='tk-username'>{user?.username || 'User_88'}</div>
              <div className='tk-balance'>
                {Number((user?.coins || 0).toFixed(0)).toLocaleString('vi-VN')}{' '}
                đ
              </div>
            </div>
          </div>

          <img
            src='/reload2.png'
            alt='reload'
            className='tk-reload'
            onClick={handleRutTienGame}
          />
        </div>

        {/* Action Buttons */}
        <div className='tk-actions'>
          {/* <Link to='/member/deposit' className='tk-btn deposit'>
            {t("naptien")}
          </Link> */}
          <button className='tk-btn deposit' onClick={handleNapTien}>
                        {t("naptien")}

          </button>
          <button className='tk-btn withdraw' onClick={handleRutTien}>
                        {t("ruttien")}

          </button>
        </div>

        {/* Menu */}
        <div className='tk-menu-grid'>
          {menuItems.map((item, i) => (
            <Link to={item.path} key={i} className='tk-menu-item'>
              <img src={item.icon} className='tk-menu-icon' alt='' />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <Loading isLoading={isLoading} />
      {message && (
        <Notify message={message} setcontent={setMessage} type='normal' />
      )}
    </>
  )
}

export default TaiKhoanLayout
