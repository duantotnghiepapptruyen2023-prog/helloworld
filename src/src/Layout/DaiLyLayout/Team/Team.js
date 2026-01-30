/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../../component/MaHoaDuLieu'
import { useTranslation } from 'react-i18next'
import { Loading } from '../../../component/Loading'
import './Team.scss'

const Team = () => {
  const userdata =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  const hasFetched = useRef(false)
  const [data, setData] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL

  const fetchdata = async type => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${apiUrl}/getfulluserdaily/${userdata.id}?type=${type}`
      )
      const result = await response.json()
      if (response.ok) {
        setData(result)
      }
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (userdata && !hasFetched.current) {
      fetchdata(activeTab)
      hasFetched.current = true
    }
  }, [userdata])

  useEffect(() => {
    fetchdata(activeTab)
  }, [activeTab])

  const tabOptions = [
    { label: `${t('tatca')}`, value: 'all' },
    {
      label: `${t('lv')} 1`,
      value: 'f1'
    },
    { label: `${t('lv')} 2`, value: 'f2' },
    { label: `${t('lv')} 3`, value: 'f3' }
  ]

  return (
    <div className='transaction-container'>
      <div className='transaction-header'>
        <Link to='/daily'>
          <div className='ic-back'>
            <img src='/back.png' alt='Back' />
          </div>
        </Link>
        <div className='transaction-text'>{t('doicuatoi')}</div>
        <div className='spacer'></div>
      </div>

      {/* Tabs */}
      <div className='tabs-daily-team'>
        {tabOptions.map(tab => (
          <button
            key={tab.value}
            className={`tab-button-daily-team ${
              activeTab === tab.value ? 'active-daily-team' : ''
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='user-list-daily-team'>
        <div className='user-row-daily-team header-daily-team'>
          <div className='username-header'>{t('tendangnhap')}</div>
          <div className='level-header'>{t('lv')}</div>
          <div className='level-header'>{t('soducapdo')}</div>
          <div className='date-header'>{t('ngaydangky')}</div>
        </div>

        {data.map((item, index) => (
          <div
            key={index}
            className={`user-row-daily-team ${
              index % 2 === 0 ? 'even-daily-team' : 'odd-daily-team'
            }`}
          >
            <div className='username-header'>{item.userdangky}</div>
            <div className='level-header'>{item.level.toUpperCase()}</div>
            <div className='level-header'>
              {Number((item?.coin || 0).toFixed(0)).toLocaleString('en-US') ||
                0}
            </div>
            <div className='date-header'>{item.created}</div>
          </div>
        ))}

        {data.length === 0 && !isLoading && (
          <p
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: 'var(--text-color)'
            }}
          >
            Không có dữ liệu
          </p>
        )}
      </div>

      <Loading isLoading={isLoading} />
    </div>
  )
}

export default Team
