/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  convertTimestampToDateTime,
  convertTimestampToDate,
  convertTimestampToTime
} from '../../component/ConvertTime'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../component/MaHoaDuLieu'
import { Loading } from '../../component/Loading'
import { useTranslation } from 'react-i18next'
import './PhanTySoScreen.scss'
const removeVietnameseTones = str => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

const PhanTySoScreen = () => {
  const userdata =
    getFromsessionstorage('data_u') || getFromlocalstorage('data_u')
  const [loading, setLoading] = useState(true)
  const apiUrl = process.env.REACT_APP_API_URL
  const { t } = useTranslation()
  const labels = [t('homnay'), t('ngaymai')]

  const generateDates = () => {
    const todayDate = new Date()
    const tomorrowDate = new Date()
    tomorrowDate.setDate(todayDate.getDate() + 1)

    return [
      todayDate.toLocaleDateString('en-CA'),
      tomorrowDate.toLocaleDateString('en-CA')
    ]
  }

  const [dates] = useState(generateDates())
  const [activeDate, setActiveDate] = useState(dates[0])
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [percentages, setPercentages] = useState({})

  const fetchTranDau = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/getmatches?date=${activeDate}`)
      const data = await response.json()
      if (data.error) {
        console.log(data.error)
      } else {
        setData(data)

        const newPercentages = {}
        data.forEach(item => {
          newPercentages[item.id] = (Math.random() * (5 - 2) + 2).toFixed(2)
        })
        setPercentages(newPercentages)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Failed to fetch API: ', error)
    }
  }

  useEffect(() => {
    fetchTranDau()
  }, [activeDate])

  const filteredData = data.filter(item => {
    const leagueName = removeVietnameseTones(item.leagueName.toLowerCase())
    const homeTeam = removeVietnameseTones(item.homeTeam.toLowerCase())
    const awayTeam = removeVietnameseTones(item.awayTeam.toLowerCase())

    const keyword = removeVietnameseTones(searchText.trim().toLowerCase())

    return (
      leagueName.includes(keyword) ||
      homeTeam.includes(keyword) ||
      awayTeam.includes(keyword)
    )
  })
  const tabNames = [
    { id: '1_1', name: t('fttyso'), type: 'FT' },
    { id: '1_2', name: t('ftchanle'), type: 'FT' },
    { id: '1_3', name: t('ftthanghoathua'), type: 'FT' },
    { id: '2_1', name: t('httyso'), type: 'HT' },
    { id: '2_3', name: t('htthanghoathua'), type: 'HT' },
    { id: '3_1', name: t('h2ttyso'), type: 'H2T' }
  ]

  return (
    <>
      <div className='lichthidau' id='lichthidau' style={{ width: '100%' }}>
        <div className='divinputsearch'>
          <div className='inputtk'>
            <input
              type='text'
              placeholder={t('timkiemtrandau')}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ backgroundColor: 'transparent' }}
            />
            <img src='/search2.png' alt='' />
          </div>
        </div>
        <div className='lichtyso'>
          {dates.map((date, index) => (
            <div
              className={
                activeDate === date ? 'item-lich item-lich-active' : 'item-lich'
              }
              key={index}
              onClick={() => setActiveDate(date)}
            >
              <p>{labels[index]}</p>
            </div>
          ))}
        </div>

        {filteredData.length > 0 ? (
          filteredData.map(item => (
            <Link
  to={userdata ? `/game/detailmatch/${item.gameId}` : '/login'}
  key={item.id}
>
  <div className='wrap-match-card'>
    <div
      className={`match-card-main ${item.baotoan ? 'match-protected' : ''}`}
    >
      <div className='match-header'>
        <div className='team-block'>
          <img src={`${apiUrl}/${item.homeIcon}`} alt='' />
          <p>{item.homeTeam}</p>
        </div>

        <div className='league-info'>
          <h4>{item.leagueName}</h4>
          <p>{convertTimestampToTime(item.started)}</p>
          <p className='league-date'>
            {convertTimestampToDate(item.started)}
          </p>
        </div>

        <div className='team-block'>
          <img src={`${apiUrl}/${item.awayIcon}`} alt='' />
          <p>{item.awayTeam}</p>
        </div>
      </div>

      {/* --- BETTING --- */}
      <div className='match-betting-zone'>
        <div className='bet-column'>
          <span className='bet-title'>
            {tabNames.find(i => i.id === item.bet[0].type).name}
          </span>
          <div className='bet-values'>
            {item.bet[0].data.map(i => (
              <span key={i.id}>{i.value}</span>
            ))}
          </div>
        </div>

        <div className='bet-action'>
          <button className='btn-placebet'>Đặt cược</button>
        </div>

        <div className='bet-column'>
          <span className='bet-title'>
            {tabNames.find(i => i.id === item.bet[1].type).name}
          </span>
          <div className='bet-values'>
            {item.bet[1].data.map(i => (
              <span key={i.id}>{i.value}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  </div>
</Link>

          ))
        ) : (
          <div
            className='list-bottom center'
            style={{ justifyContent: 'center' }}
          >
            <div className='nodata'>
              <h4 className='data'>
                <span>{t('khongcodulieu')}</span>
              </h4>
            </div>
          </div>
        )}

        <Loading isLoading={loading} />
      </div>
      <div className='box-height'></div>
    </>
  )
}

export default PhanTySoScreen
