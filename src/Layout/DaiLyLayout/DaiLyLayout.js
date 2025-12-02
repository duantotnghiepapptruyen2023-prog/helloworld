/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { React, useState, useEffect, useRef } from 'react'

import './DaiLyLayout.scss'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../component/MaHoaDuLieu'
import { Loading } from '../../component/Loading'
import { useTranslation } from 'react-i18next'
import Notify from '../../component/Notify/Notify'
import { BangXepHang } from '../BangXepHang'

const DaiLyLayout = () => {
  const [userdata, setUserdata] = useState(null)
  const [datahoahong, setdatahoahong] = useState({})
  const [showNoti, setShowNoti] = useState(false)
  const [notiMessage, setNotiMessage] = useState('')
  const [datanguoi, setdatanguoi] = useState({})
  const qrRef = useRef(null)
  const hasFetched = useRef(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const currentDomain = window.location.origin
  const referralLink = `${currentDomain}/login?code=${userdata?.code || ''}`
  const apiUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    const data =
      JSON.parse(getFromsessionstorage('data_u')) ||
      JSON.parse(getFromlocalstorage('data_u'))
    setUserdata(data)
  }, [])

  const fetchdata = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/referred/${userdata.id}`)
      if (response.ok) {
        const data = await response.json()
        setdatahoahong(data)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (userdata && !hasFetched.current) {
      fetchdata()
      hasFetched.current = true
    }
  }, [userdata])

  const fetchdatanguoi = async () => {
    try {
      const response = await fetch(`${apiUrl}/getsoluongf123/${userdata.id}`)
      if (response.ok) {
        const data = await response.json()
        setdatanguoi(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (userdata) {
      fetchdatanguoi()
    }
  }, [userdata])

  const handleCopy = text => {
    navigator.clipboard.writeText(text).then(() => {
      setNotiMessage(t('dacopy'))
      setShowNoti(true)
    })
  }
  useEffect(() => {
    if (showNoti) {
      const timer = setTimeout(() => setShowNoti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showNoti])

  return (
    <div className='container-daily'>
      {notiMessage && (
        <Notify
          message={notiMessage}
          setcontent={setNotiMessage}
          type='success'
        />
      )}

      <header className='header-daily'>
        <div className='name-daily'>{t('quanlydaily')}</div>
      </header>

      <div className='container-daily2'>
        <div className='avatar-section'>
          <img src='/logo.png' alt='avatar' className='avatar' />
          <div className='username'>
            {t('xinchao')}, {userdata?.username}
          </div>
        </div>
        {/* Link giới thiệu */}
        <div className='link-section'>
          <h4>{t('linkgioithieu')}</h4>

          <div className='qr-section' ref={qrRef}>
            <div className='qr-info'>
              <div className='link-box'>
                <span className='link-text'>{referralLink}</span>
                <img
                  src='/copy.png'
                  alt='Copy Icon'
                  className='icon-copy'
                  onClick={() => handleCopy(referralLink)}
                />
              </div>
              <div className='qr-text-copy'>
                <p>
                  {t('magioithieu')}{' '}
                  <strong className='link-text'>{userdata?.code}</strong>
                </p>
                <img
                  src='/copy.png'
                  alt='Copy Icon'
                  className='icon-copy'
                  onClick={() => handleCopy(`${userdata?.code}`)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* 
        <div className='stats'>
          {['F1', 'F2 + F3'].map((title, index) => {
            const key = index === 0 ? 'f1' : 'f2f3'
            const data = datahoahong?.[key] || {}

            return (
              <div className='card' key={index}>
                <div className='table-container-daily'>
                  <div className='row'>
                    <span>{title}</span>
                    <span>{t('homnay')}</span>
                    <span>{t('homqua')}</span>
                  </div>
                  {[
                    {
                      label: t('hoahong'),
                      today: 'hoahongtoday',
                      yesterday: 'hoahongyesterday'
                    },
                    {
                      label: t('register'),
                      today: 'dangkytoday',
                      yesterday: 'dangkyyesterday'
                    },
                    {
                      label: t('hieuqua'),
                      today: 'hequatoday',
                      yesterday: 'hequoyesterday'
                    }
                  ].map((item, idx) => (
                    <div className='row' key={idx}>
                      <span>{item.label}</span>
                      <span>{data[item.today] || 0}</span>
                      <span>{data[item.yesterday] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div> */}
        {/* Menu */}

        <div className='f123-cards'>
          <div className='f123-header'>
            <h3>{t('doicuatoi')}</h3>
            <a href='/agent/team'>{t('xemtatca')}</a>
          </div>

          <div className='f123-body'>
            {['lv1', 'lv2', 'lv3'].map((lvl, idx) => {
              const colors = ['#ff6b6b', '#4ecdc4', '#ffa502']
              const bgColors = ['#ffe6e6', '#e0f7f7', '#fff4e6']
              return (
                <div
                  className='f123-card'
                  key={lvl}
                  style={{ borderColor: colors[idx] }}
                >
                  <div
                    className='f123-card-inner'
                    style={{ background: bgColors[idx] }}
                  >
                    <div className='f123-card-title'>
                      {datanguoi[lvl] || 0} {t('user')}
                    </div>
                    <div className='f123-card-level'>
                      {t('lv')} {idx + 1}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* <div className='menu'>
          <div className='menu-item'>
            <a href='/agent/bonus-direct' className='item1'>
              <img src='/account/qlthe.png' alt='Setting' /> {t('hoahong')}
            </a>
          </div>
        </div>

        <BangXepHang userId={userdata?.id}/> */}
        <div className='box-height'></div>
      </div>

      <Loading isLoading={loading} />
    </div>
  )
}

export default DaiLyLayout
