/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './Bettinghistory.scss'
import { Link } from 'react-router-dom'
import DateCustom from '../../component/DateCustom/DateCustom'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../component/MaHoaDuLieu'
import { useTranslation } from 'react-i18next'
import { Loading } from '../../component/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol } from '@fortawesome/free-solid-svg-icons'
import { Tabs } from 'antd'
import Notify from '../../component/Notify/Notify'
const { TabPane } = Tabs

const GameStatusDropdown = ({ status, setStatus }) => {
  const { t } = useTranslation()

  const handleTabChange = key => {
    setStatus(key)
  }

  return (
    <div className='tabs-container-bettinghistory'>
      <Tabs activeKey={status} onChange={handleTabChange}>
        <TabPane tab={t('dangxuly')} key='đang xử lý' />
        <TabPane tab={t('dahoanthanh')} key='đã hoàn thành' />
      </Tabs>
    </div>
  )
}
const GameHistory = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const apiUrl = process.env.REACT_APP_API_URL

  const getCurrentDate = () => {
    const today = new Date()
    const vietnamOffset = 7 * 60
    const utcOffset = today.getTimezoneOffset()
    const vietnamDate = new Date(
      today.getTime() + (vietnamOffset + utcOffset) * 60 * 1000
    )

    const yyyy = vietnamDate.getFullYear()
    const mm = String(vietnamDate.getMonth() + 1).padStart(2, '0')
    const dd = String(vietnamDate.getDate()).padStart(2, '0')

    const formattedDate = `${yyyy}-${mm}-${dd}`
    return formattedDate
  }

  const [startDate, setStartDate] = useState(getCurrentDate())
  const [endDate, setEndDate] = useState(getCurrentDate())
  const [betHistory, setBetHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('đang xử lý')
  const [message, setMessage] = useState('')
  const { t } = useTranslation()
  const data =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  const userId = data?.id

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${apiUrl}/lichsucuoc/${userId}?startdate=${startDate}&enddate=${endDate}&type=${status}`
      )
      if (!response.ok) throw new Error('Lỗi khi gọi API')

      const result = await response.json()
      console.log(result)
      setBetHistory(result.length > 0 ? result : [])
    } catch (error) {
      console.error('API Fetch Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) fetchData()
  }, [userId, status])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const canCancelBet = (betTime, betStatus, now = new Date()) => {
    if (betStatus !== 'Đang chờ kết quả') return false

    const betDateTime = new Date(betTime)
    const diffInMinutes = (now - betDateTime) / (1000 * 60)

    return diffInMinutes <= 3
  }

  const handleCancelBet = async code => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/huycuoc/${code}`, {
        method: 'POST'
      })
      const data = await response.json()
      if (!data.success) throw new Error('Lỗi khi hủy cược')

      setMessage(t('huycuocthanhcong'))
      fetchData()
    } catch (error) {
      console.error('Lỗi khi hủy cược:', error)
      setMessage(t('huycuocthatbai'))
    } finally {
      setLoading(false)
    }
  }
  const keoTranslationMap = {
    'FT Tỷ số': 'fttyso',
    'FT Chẵn lẻ': 'ftchanle',
    'FT Thắng Hòa Thua': 'ftthanghoathua',
    'HT Tỷ số': 'httyso',
    'HT Thắng Hòa Thua': 'htthanghoathua',
    'H2T Tỷ số': 'h2ttyso'
  }
  return (
    <div className='container-bettinghistory'>
      <Loading isLoading={loading} />{' '}
      <Notify message={message} setcontent={setMessage} type='success' />
      <div className='header-app-bettinghistory'>
        <Link to='/member'>
          <img src='/back.png' alt='Back' className='back-icon' />
        </Link>
        {t('lstc')}
      </div>
      <div className='game-history-search-form-1'>
        <GameStatusDropdown status={status} setStatus={setStatus} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className='time-picker-bettinghistory'>
            <div className='input-container-bettinghistory'>
              <DateCustom
                onChange={(start, end) => {
                  setStartDate(start)
                  setEndDate(end)
                }}
              />
            </div>
          </div>

          <div className='button-betting'>
            <img
              src='/search2.png'
              alt='Tìm kiếm'
              onClick={fetchData}
              style={{
                width: '32px',
                height: '32px',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        <div className="bet-history-wrapper">
  {betHistory.length > 0 ? (
    betHistory.map((game, index) => (
      <div key={index} className="bet-item-card">
        
        {/* Header */}
        <div className="bet-item-header">
          <div className="bet-league">
      <img src='/logo.png' style={{width:70, background: "black"}}></img>
            <span className="league-title">{game.leageName}</span>
          </div>

          {canCancelBet(game.datecuoc, game.trangthai, currentTime) && (
            <button
              className="btn-cancel-bet"
              onClick={() => handleCancelBet(game.code)}
            >
              {t('huycuoc')}
            </button>
          )}
        </div>

        <div className="bet-match-info">
          <span className="teams">
            {game.homeName} - {game.awayName}
          </span>
          <span className="kickoff-time">{game.giodau}</span>
        </div>

        <div className="bet-type-box">
          <div className="bet-type-row">
            <span className="bet-type-label">
              {t(keoTranslationMap[game.keo] || game.keo)}
            </span>

            <span className="bet-type-value">
              {game.keo === t('ftchanle')
                ? game.gamekey === '0_0'
                  ? t('le')
                  : game.gamekey === '1_1'
                  ? t('chan')
                  : game.gamekey
                : [t('ftthanghoathua'), t('htthanghoathua')].includes(
                    game.keo
                  )
                ? game.gamekey === '1_0'
                  ? t('thang')
                  : game.gamekey === '0_0'
                  ? t('hoa')
                  : game.gamekey === '0_1'
                  ? t('thua')
                  : game.gamekey
                : game.gamekey}
            </span>

            <span className="bet-profit-rate">{game.profit}%</span>
          </div>
        </div>

        {/* Betting Amounts */}
        <div className="bet-amount-section">
          <div className="amount-row">
            <span>{t('tiencuoc')}:</span>
            <span className="amount-value">
              {Number(game.tiencuoc).toFixed(2).toLocaleString()}
            </span>
          </div>

          <div className="amount-row">
            <span>{t('phicuoc')}:</span>
            <span className="amount-value">
              {Number(game.phicuoc).toFixed(2).toLocaleString()}
            </span>
          </div>

          <div className="amount-row">
            <span>{t('loinhuan')}:</span>
            <span className="amount-value">
              {Number(game.loinhuan).toFixed(2).toLocaleString()}
            </span>
          </div>

          <div className="amount-row">
            <span>{t('loinhuanrong')}:</span>
            <span className="amount-value">
              {Number(game.loinhuanrong).toFixed(2).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="bet-status-row">
          <div className="bet-time">
            <span>{t('tgiancuoc')}:</span>
            <span>{game.datecuoc}</span>
          </div>

          <strong
            className={
              game.trangthai === 'Thắng'
                ? 'status-win'
                : game.trangthai === 'Hủy'
                ? 'status-cancel'
                : game.trangthai === 'Đang chờ kết quả'
                ? 'status-pending'
                : 'status-lose'
            }
          >
            {t(
              game.trangthai === 'Thắng'
                ? 'thang'
                : game.trangthai === 'Hủy'
                ? 'huybo'
                : game.trangthai === 'Đang chờ kết quả'
                ? 'dangchokq'
                : 'thua'
            )}
          </strong>
        </div>

        {/* Bao Toan Refund */}
        {game.keo_tran === game.betType &&
          game.baotoan === game.gamekey &&
          game.trangthai === 'Thua' && (
            <div className="refund-box">{t('hoantienbtv')}</div>
          )}

        {/* Footer */}
        <div className="bet-extra-info">
          <p>
            {t('matrandau')}: <span className="match-code">{game.code}</span>
          </p>
        </div>
      </div>
    ))
  ) : (
    <p className="bet-no-data">{t('khongcodulieu')}</p>
  )}
</div>

      </div>
    </div>
  )
}

export default GameHistory

