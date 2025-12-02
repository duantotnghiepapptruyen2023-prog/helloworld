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

const TaiKhoanLayout = () => {
  const userdata = JSON.parse(getFromsessionstorage('data_u')) || JSON.parse(getFromlocalstorage('data_u'))
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
    { icon: "./account/lsgd.png", label: t('lsgd'), path: "/member/transactionhistory" },
    { icon: "./account/lstc.png", label: t('lstc'), path: "/member/bettinghistory" },
    { icon: "./account/bank.png", label: t('tkbank'), path: "/member/security-bank" },
    { icon: "./account/trc20.png", label: `${t('diachivi')} BEP20`, path: "/member/security/security-bep" },
    { icon: "./footer/icon_bouns.png", label: t('gthieubb'), path: "/daily" },
    { icon: "./account/passrt.png", label: t('passruttienthaydoi'), path: "/member/security/security-password-withdrawal" },
    { icon: "./account/pass.png", label: t('passdangnhap'), path: "/member/security/security-pass" },
    { icon: "./account/sdt.png", label: t('sodienthoai'), path: "/member/security/security-phone" },
    // { icon: "./account/lsgd.png", label: t('trogiup'), path: "/member/setting/help" },
    { icon: "./account/csbm.png", label: t('chinhsachbaomat'), path: "/member/setting/policy" },
    { icon: "./account/vct.png", label: t('vechungtoi'), path: "/member/setting/aboutme" },
  ]

  return (
    <>
      <div className="fab-page-container">
        
        <div className="fab-user-card">
          <button className="logout-btn" onClick={dangxuat}>
        Đăng xuất
      </button>
          <div className="fab-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <div className="fab-username">{user?.username || 'tentoi88'}</div>

          <div className="fab-balance-wrapper">
            <span className="fab-balance">
              {Number((user?.coins || 0).toFixed(0)).toLocaleString('vi-VN')} đ
            </span>
            <img
              src="/reload2.png"
              alt="reload"
              className="fab-reload"
              onClick={handleRutTienGame}
            />
          </div>

          <div className="fab-action-buttons">
            <Link to="/member/deposit" className="fab-btn fab-deposit">
              Nạp Tiền
            </Link>
            <button onClick={handleRutTien} className="fab-btn fab-withdraw">
              Rút Tiền
            </button>
          </div>
        </div>

        <div className="fab-menu-list">
          {menuItems.map((item, i) => (
            <Link to={item.path} key={i} className="fab-menu-item">
              <img className="menu-icon" src={item.icon} alt="Menu Icon"></img>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow">›</span>
            </Link>
          ))}
        </div>
      </div>

      <Loading isLoading={isLoading} />
      {message && <Notify message={message} setcontent={setMessage} type="normal" />}
    </>
  )
}

export default TaiKhoanLayout