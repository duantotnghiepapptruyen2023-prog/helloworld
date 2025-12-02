/* eslint-disable react-hooks/exhaustive-deps */
// New redesigned component with same class names but different layout and style
import React, { useState, useEffect, useRef } from 'react'
import './HoaHong.scss'
import { Link } from 'react-router-dom'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../../component/MaHoaDuLieu'
import { convertTimestampToDate } from '../../../component/ConvertTime/ConvertTime'
import { Loading } from '../../../component/Loading'
import DateCustom from '../../../component/DateCustom/DateCustom'
import { useTranslation } from 'react-i18next'
import Notify from '../../../component/Notify/Notify'

const HoaHong = () => {
  const userdata =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  const [activeTab, setActiveTab] = useState('f1')
  const apiUrl = process.env.REACT_APP_API_URL
  const [data, setdata] = useState({})

  const [startDateF1, setStartDateF1] = useState('')
  const [endDateF1, setEndDateF1] = useState('')
  const [startDateF2F3, setStartDateF2F3] = useState('')
  const [endDateF2F3, setEndDateF2F3] = useState('')

  const [username, setUsername] = useState('')
  const [message, setmessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const isFetching = useRef(false)
  const { t } = useTranslation()

  const validateDate = (start, end) => {
    if (!start && !end) {
      setmessage(t('vuilongchonngay'))
      return false
    }
    return true
  }

  const validateUsername = () => {
    if (!username) {
      setmessage(t('vuilongnhapusername'))
      return false
    }
    return true
  }

  const fetchDataByDate = async (
    type,
    formattedStart = '',
    formattedEnd = ''
  ) => {
    if (isFetching.current) return

    isFetching.current = true
    setIsLoading(true)

    try {
      const response = await fetch(
        `${apiUrl}/getbonusdate/${userdata._id}?startdate=${formattedStart}&enddate=${formattedEnd}&type=${type}`
      )
      const result = await response.json()

      if (result.message) {
        setmessage(result.message)
      } else {
        setdata(result || { data: [] })
      }
    } catch (error) {
      console.error(error)
    }

    setIsLoading(false)
    isFetching.current = false
  }

  const fetchDataByUsername = async (searchUsername = '') => {
    if (isFetching.current) return

    isFetching.current = true
    setIsLoading(true)

    try {
      const response = await fetch(
        `${apiUrl}/getbonusbyusername/${userdata._id}?username=${searchUsername}&type=${activeTab}`
      )
      const result = await response.json()

      if (result.message) {
        setmessage(result.message)
      } else {
        setdata(result || { data: [] })
      }
    } catch (error) {
      console.error(error)
    }

    setIsLoading(false)
    isFetching.current = false
  }

  const handleTabChange = tab => {
    setActiveTab(tab)
    setStartDateF1('')
    setEndDateF1('')
    setStartDateF2F3('')
    setEndDateF2F3('')
    setUsername('')
    setdata({})
    setmessage('')

    setTimeout(() => {
      fetchDataByDate(tab, '', '')
    }, 0)
  }

  useEffect(() => {
    if (userdata && isLoading) {
      fetchDataByDate('f1', '', '')
    }
  }, [userdata, isLoading])

  return (
    <>
      <Loading isLoading={isLoading} />

      <div className='container-hoahong redesigned-container'>
        <div className='header-app app-header-modern'>
          <Link to='/'>
            <img src='/back.png' alt='Back' className='back-icon' />
          </Link>
          <span className='header-title-new'>{t('hoahong')}</span>
        </div>

        <div className='header-hoahong tab-navigation-modern'>
          <div
            className={activeTab === 'f1' ? 'active' : ''}
            onClick={() => handleTabChange('f1')}
          >
            {t('f1')}
          </div>
          <div
            className={activeTab === 'f2f3' ? 'active' : ''}
            onClick={() => handleTabChange('f2f3')}
          >
            {t('f23')}
          </div>
        </div>

        <div className='filter-hoahong modern-filter-box'>
          <div className='filter-row'>
            <div className='date-filter-card glossy-card'>
              <div className='date-input-group'>
                <DateCustom
                  key={activeTab}
                  onChange={(start, end) => {
                    if (activeTab === 'f1') {
                      setStartDateF1(start)
                      setEndDateF1(end)
                    } else {
                      setStartDateF2F3(start)
                      setEndDateF2F3(end)
                    }
                  }}
                />

                <button
                  className='icon-button-hh'
                  onClick={() => {
                    const start =
                      activeTab === 'f1' ? startDateF1 : startDateF2F3
                    const end = activeTab === 'f1' ? endDateF1 : endDateF2F3

                    if (validateDate(start, end))
                      fetchDataByDate(activeTab, start, end)
                  }}
                >
                  <img src='/search2.png' alt='' />
                </button>
              </div>
            </div>
          </div>

          <div className='filter-row'>
            <div className='search-user-card glossy-card'>
              <div className='search-input-wrapper-hh'>
                <span className='search-icon-hh'>👤</span>
                <input
                  type='text'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder='Nhập username...'
                  className='search-input-hh'
                />
                <button
                  className='kiemtra-button'
                  onClick={() => {
                    if (validateUsername()) fetchDataByUsername(username)
                  }}
                >
                  {t('timkiem')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTENT F1 --- */}
        <div
          className='content'
          style={{
            display: activeTab === 'f1' ? 'block' : 'none',
            padding: '10px'
          }}
        >
          <p className='summary-text-new'>
            {t('tongtiendanhan')} :{' '}
            {data?.totalReceived?.toFixed(2).toLocaleString('en-US')}
          </p>

          <div className='table-container-hoahong smooth-table'>
            <div className='user-row-bonus-team header-daily-team modern-table-header'>
              <div>User</div>
              <div>{t('ngay')}</div>
              <div>{t('datcuoc')}</div>
              <div>{t('hoahong')}</div>
            </div>

            {data?.data?.map((row, index) => (
              <div
                key={index}
                className={`user-row-bonus-team modern-row ${
                  index % 2 === 0 ? 'even-daily-team' : 'odd-daily-team'
                }`}
                style={{
                  color: row.trangthai === 2 ? '#66ff37' : 'var(--text-color)',
                  fontSize: '14px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                <div>{row.user}</div>
                <div>{convertTimestampToDate(row.date)}</div>
                <div>{row.amount.toFixed(2).toLocaleString('en-US')}</div>
                <div>{row.bonus.toFixed(2).toLocaleString('en-US')}</div>
              </div>
            ))}

            <div className='box-height' />
          </div>
        </div>

        {/* --- CONTENT F2F3 --- */}
        <div
          className='content'
          style={{
            display: activeTab === 'f2f3' ? 'block' : 'none',
            padding: '10px'
          }}
        >
          <div className='m-th2' style={{ paddingBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>
                {t('tongtiendanhan')} :{' '}
                {data?.totalReceived?.toFixed(2).toLocaleString('en-US')}
              </p>
              <p>
                {t('tongtienchuanhan')} :{' '}
                {data?.totalPending?.toFixed(2).toLocaleString('en-US')}
              </p>
            </div>
            <p>{t('thanhtoantudong')}</p>
          </div>

          <div className='table-container-hoahong smooth-table'>
            <div className='user-row-bonus-team-f2f3 header-daily-team modern-table-header'>
              <div>User</div>
              <div>Level</div>
              <div>{t('ngay')}</div>
              <div>{t('datcuoc')}</div>
              <div>{t('hoahong')}</div>
            </div>

            {data?.data?.map((row, index) => (
              <div
                key={index}
                className={`user-row-bonus-team-f2f3 modern-row ${
                  index % 2 === 0 ? 'even-daily-team' : 'odd-daily-team'
                }`}
                style={{
                  color: row.trangthai === 2 ? '#66ff37' : 'var(--text-color)',
                  fontSize: '14px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                <div>{row.user}</div>
                <div>{row.level}</div>
                <div>{convertTimestampToDate(row.date)}</div>
                <div>{row.amount.toFixed(2).toLocaleString('en-US')}</div>
                <div>{row.bonus.toFixed(2).toLocaleString('en-US')}</div>
              </div>
            ))}

            <div className='box-height' />
          </div>
        </div>

        <Notify message={message} setcontent={setmessage} />
      </div>
    </>
  )
}

export default HoaHong
