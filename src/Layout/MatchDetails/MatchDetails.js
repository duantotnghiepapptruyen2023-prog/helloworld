import { useEffect, useState, useRef } from 'react'
import './MatchDetails.scss'
import { useParams } from 'react-router-dom'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../component/MaHoaDuLieu/MaHoaDuLieu'
import {
  convertTimestampToMinutes,
  convertTimestampToHours,
  convertTimestampToDateTimeNoYear,
  convertTimestampToDate
} from '../../component/ConvertTime'
import { Loading } from '../../component/Loading'
import { useTranslation } from 'react-i18next'
import { HeaderPhanTySo } from '../../component/HeaderPhanTySo'
import { useUser } from '../../component/UserProvider/UserProvider'
import { Notify } from '../../component/Notify'

const MatchDetails = () => {
  const { gameID } = useParams()
  const [showModal, setShowModal] = useState(false)
  const [betAmount, setBetAmount] = useState(0)
  const [data, setdata] = useState({})
  const [idtab, setidtab] = useState('1_1')
  const [keodata, setkeodata] = useState({})
  const [betinfo, setbetinfo] = useState({})
  const [betdata, setbetdata] = useState()
  const [gamekey, setgamekey] = useState()
  const [tabname, settabname] = useState('')
  const [message, setMessage] = useState('')
  const userdata =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  const hasFetched = useRef(false)
  const [isLoading, setIsLoading] = useState(false)
  const apiUrl = process.env.REACT_APP_API_URL
  const { t } = useTranslation()
  const { user, fetchUser } = useUser()
  const [typenoti, settypenoti] = useState('error')

  useEffect(() => {
    settabname(t('fttyso'))
  }, [t])

  useEffect(() => {
    if (userdata && !hasFetched.current) {
      fetchUser(userdata._id)
      hasFetched.current = true
    }
  }, [userdata])

  const fetchkeodat = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${apiUrl}/getchitietbet/${gameID}?type=${idtab}`
      )
      const data = await response.json()
      setkeodata(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGameDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiUrl}/chitiettran/${gameID}`)
      const data = await response.json()
      setdata(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchbetinfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiUrl}/getchitietkeo/${gameID}`)
      const data = await response.json()
      setbetinfo(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (gameID) {
      fetchGameDetails()
      fetchbetinfo()
    }
  }, [gameID])

  useEffect(() => {
    if (gameID && idtab) {
      fetchkeodat()
    }
  }, [gameID, idtab])

  const handeldatcuoc = async betAmountToSend => {
    setIsLoading(true)
    try {
      const response = await fetch(`${apiUrl}/postdatcuoc/${userdata.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameKey: gamekey,
          gameId: gameID,
          betAmount: betAmountToSend,
          betType: idtab,
          profit: betdata.value
        })
      })
      const data = await response.json()
      if (data.message) {
        settypenoti('error')
        setMessage(t('datcuocthatbai'))
        console.log(data.message)
      } else {
        setMessage(t('datcuocthanhcong'))
        settypenoti('success')
        setBetAmount(0)
        setShowModal(false)
        fetchUser(userdata._id)
      }
    } catch (error) {
      console.log('error', error)
      setMessage(t('loikhicuoc'))
      settypenoti('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='container-detailsmatch'>
        <HeaderPhanTySo />
        <div className="game-info-modern">
          <div className="league-bar">
            <span className="league-dot"></span>
            <h4 className="league-title">{data.leagueName}</h4>
          </div>
          <div className="teams-container">
            <Team
              name={data.homeTeam}
              logo={`${apiUrl}/${data.homeIcon}`}
              className="team-side"
            />
            <div className="center-info">
              <div className="date-box">
                <GameDate timestaft={data?.started} />
              </div>

              <div className="time-big">
                <span>
                  {data?.started ? convertTimestampToHours(data.started) : 'N/A'}
                </span>
                <span className="colon">:</span>
                <span>
                  {data?.started ? convertTimestampToMinutes(data.started) : 'N/A'}
                </span>
              </div>

              <div className="date-full">
                {data?.started ? convertTimestampToDate(data.started) : 'N/A'}
              </div>
            </div>
            <Team
              name={data.awayTeam}
              logo={`${apiUrl}/${data.awayIcon}`}
              className="team-side"
            />

          </div>
        </div>

        <div className='divnghichtyso'>
          <Tabs
            idtab={idtab}
            setidtab={setidtab}
            betinfo={betinfo}
            settabname={settabname}
          />

          <ScorePredictions
            openModal={() => setShowModal(true)}
            data={keodata}
            setbetdata={setbetdata}
            setgamekey={setgamekey}
            tabname={tabname}
          />
        </div>
        <div className='box-height'></div>
        {showModal && (
          <BetModal
            closeModal={() => setShowModal(false)}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            data={data}
            betdata={betdata}
            tabname={tabname}
            handeldatcuoc={handeldatcuoc}
            datachitiet={user}
            setMessage={setMessage}
            settypenoti={settypenoti}
            timestaft={data?.started}
          />
        )}
        {message && (
          <Notify message={message} setcontent={setMessage} type={typenoti} />
        )}
      </div>
    </>
  )
}

const Team = ({ name, logo }) => (
  <div className='team-item'>
    <img src={logo} alt={name} className='team-logo' />
    <div className='team-name'>{name}</div>
  </div>
)

const GameDate = ({ timestaft }) => {
  const [timeParts, setTimeParts] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    ended: false
  })
  const { t } = useTranslation()

  useEffect(() => {
    let interval
    if (timestaft) {
      interval = setInterval(() => {
        const now = new Date().getTime()
        const matchTime = timestaft * 1000
        const timeLeft = matchTime - now

        if (timeLeft <= 0) {
          setTimeParts({ ended: true })
          clearInterval(interval)
          return
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

        const totalHours = days * 24 + hours

        setTimeParts({
          hours: totalHours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0'),
          ended: false
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [timestaft])

  return (
    <div className='stats-detailmatch'>
      {timeParts.ended ? (
        <span className='stat-item'>{t('dadienra')}</span>
      ) : (
        <>
          <span className='stat-item'>{timeParts.hours}</span>
          <span className='colon'>:</span>
          <span className='stat-item'>{timeParts.minutes}</span>
          <span className='colon'>:</span>
          <span className='stat-item'>{timeParts.seconds}</span>
        </>
      )}
    </div>
  )
}

const Tabs = ({ idtab, setidtab, betinfo, settabname }) => {
  const { t } = useTranslation()

  const tabNames = [
    { id: '1_1', name: t('fttyso'), type: 'FT' },
    { id: '1_2', name: t('ftchanle'), type: 'FT' },
    { id: '1_3', name: t('ftthanghoathua'), type: 'FT' },
    { id: '2_1', name: t('httyso'), type: 'HT' },
    { id: '2_3', name: t('htthanghoathua'), type: 'HT' },
    { id: '3_1', name: t('h2ttyso'), type: 'H2T' }
  ]
  const filteredTabs = tabNames.filter(tab => betinfo[tab.id])

  return (
    <div className='m-tab'>
      {filteredTabs.map((tab, index) => (
        <button
          key={index}
          className={`m-tab-item ${tab.id === idtab ? 'active' : ''}`}
          onClick={() => {
            settabname(tab.name)
            setidtab(tab.id)
          }}
        >
          {tab.name}
        </button>
      ))}
    </div>
  )
}

const ScorePredictions = ({
  openModal,
  data,
  setbetdata,
  setgamekey,
  tabname
}) => {
  const { t } = useTranslation()

  const handelgamekey = (gamekey, betdata) => {
    setgamekey(gamekey)
    setbetdata(betdata)
  }
  return (<div className="popular-bets-modern">

    <div className="bets-wrapper">
      {Object.entries(data).reduce((groups, [gamekey, item], i) => {
        if (i % 4 === 0) groups.push([])
        groups[Math.floor(i / 4)].push({ gamekey, item })
        return groups
      }, []).map((group, idx) => {
        const hasBaotoan = group.some(x => x.item.baotoan)

        const getName = (it) => {
          if (tabname === t('ftchanle')) return it.name === '0_0' ? t('le') : it.name === '1_1' ? t('chan') : it.name
          if ([t('ftthanghoathua'), t('htthanghoathua')].includes(tabname)) {
            return it.name === '1_0' ? t('thang') :
              it.name === '0_0' ? t('hoa') :
                it.name === '0_1' ? t('thua') : it.name
          }
          return it.name.replaceAll('_', ':')
        }

        return (
          <div key={idx} className={`bet-block ${hasBaotoan ? 'vip-block' : ''}`}>
           

            <div className="bet-grid">
              {group.map(({ gamekey, item }) => {
                const locked = item.locked
                const odds = typeof item.value === 'number' ? item.value.toFixed(2) : item.value

                return (
                  <div
                    key={gamekey}
                    className={`bet-tile ${locked ? 'locked' : ''} ${item.baotoan ? 'vip-tile' : ''}`}
                    onClick={() => !locked && (handelgamekey(gamekey, item), openModal())}
                  >
                    <div className="tile-content">
                      <div className="tile-name">{getName(item)}</div>
                      {locked ? (
                        <div className="lock">Lock</div>
                      ) : (
                        <div className="tile-odds">
                          <span className="num">{odds}</span>
                          <span className="pct">%</span>
                          <div className="mirror-shine"></div>
                        </div>
                      )}
                    </div>
                    {item.baotoan && <div className="corner-ribbon">VIP-BTV</div>}
                  </div>
                )
              })}

              {/* Fill empty slots */}
              {group.length < 4 && Array(4 - group.length).fill(null).map((_, i) => (
                <div key={`empty-${i}`} className="bet-tile empty" />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  </div>
  )
}

const BetModal = ({
  closeModal,
  betAmount,
  setBetAmount,
  data,
  datachitiet,
  betdata,
  tabname,
  handeldatcuoc,
  setMessage,
  timestaft,
  settypenoti
}) => {
  const coins = Number(datachitiet.coins) || 0
  const [countdown, setCountdown] = useState('')
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL

  const totalBalanceDisplay =
    coins % 1 === 0 ? coins : Math.floor(coins * 100) / 100 // Giá trị hiển thị
  const totalBalanceActual = Number(datachitiet.coins) || 0 // Giá trị thực tế

  const [isAllIn, setIsAllIn] = useState(false) // Theo dõi nếu chọn "Toàn bộ"

  const handleAmountClick = value => {
    if (value === 0) {
      setBetAmount(totalBalanceDisplay) // Hiển thị giá trị làm tròn
      setIsAllIn(true) // Đánh dấu là chọn "Toàn bộ"
    } else {
      setBetAmount(value)
      setIsAllIn(false) // Không phải "Toàn bộ"
    }
  }

  const handleInputChange = e => {
    const value = e.target.value
    if (value === '' || /^\d*$/.test(value)) {
      setBetAmount(value === '' ? 0 : parseInt(value, 10))
      setIsAllIn(false) // Khi nhập tay, không phải "Toàn bộ"
    }
  }

  const validateAndBet = () => {
    const betAmountActual = Number(betAmount)
    if (betAmountActual < 50) {
      setMessage(t('sotiencuocmin50coin'))
      settypenoti('error')
      return
    }
    if (betAmountActual > totalBalanceActual) {
      setMessage(t('sotienkovuotquasodu'))
      settypenoti('error')
      return
    }
    handeldatcuoc(isAllIn ? totalBalanceActual : betAmountActual) // Gửi giá trị phù hợp
  }

  const game_bet_fee = 0.05
  const betloinhuan = (Number(betAmount) * Number(betdata.value)) / 100 || 0
  const betffe = -betloinhuan * game_bet_fee || 0
  const betloinhuanrong = betloinhuan - betloinhuan * game_bet_fee || 0

  useEffect(() => {
    let interval
    if (timestaft) {
      interval = setInterval(() => {
        const now = new Date().getTime()
        const matchTime = timestaft * 1000 // Chuyển timestamp về milliseconds
        const timeLeft = matchTime - now

        if (timeLeft <= 0) {
          setCountdown(t('dadienra'))
          clearInterval(interval)
          return
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [timestaft])

  return (
    <div id="modal" className="modal-detailmatch modern-modal">
  <div className="modal-content-detailmatch modern-card">

    {/* HEADER */}
    <div className="modal-header">
      <h3 className="modal-title">
        ⚡ {t('datcuoc')}
      </h3>
      <button className="close-btn" onClick={closeModal}>×</button>
    </div>

    <div className="match-info">
     

      <div className="teams-block">
         <div className="match-meta">
        <span className="match-league">{data.leagueName}</span>

        <span className="match-time">
          {convertTimestampToDateTimeNoYear(data.started)}
        </span>
      </div>
        <div className="team-card">
          <img src={`${apiUrl}/${data.homeIcon}`} className="team-logo" />
          <p className="team-name">{data.homeTeam}</p>
        </div>

        

        <div className="team-card">
          <img src={`${apiUrl}/${data.awayIcon}`} className="team-logo" />
          <p className="team-name">{data.awayTeam}</p>
        </div>
      </div>
    </div>

    <div className="bet-section">
      <div className="input-block">
        <div>{t('sotien')}</div>
        <input
          id="input-sotien"
          placeholder={t('hanmucgdmin50coin')}
          type="text"
          value={betAmount}
          onChange={handleInputChange}
        />
      </div>

      <div className="bet-stats">
        <div className="stat-item">
          <p>{t('tylethang')}</p>
          <span>x{betdata.value}%</span>
        </div>
        <div className="stat-item">
          <p>{t('loinhuankyvong')}</p>
          <span>{betloinhuan.toFixed(2)}</span>
        </div>
      </div>

      <div className="fee-info">
        <p>({t('phithutuc')}: {betffe.toFixed(2)})</p>
        <p>({t('loinhuanrong')}: {betloinhuanrong.toFixed(2)})</p>
      </div>
    </div>

    {/* QUICK AMOUNT BUTTONS */}
    <div className="quick-amount">
      {[200, 500, 1000, 2000, 5000].map(num => (
        <button key={num} onClick={() => handleAmountClick(num)}>
          {num.toLocaleString()}
        </button>
      ))}
      <button onClick={() => handleAmountClick(0)} className="full-btn">
        {t('toanbo')}
      </button>
    </div>

    {/* ACTION BUTTONS */}
    <div className="modal-actions">
      <button className="btn-cancel" onClick={closeModal}>{t('huybo')}</button>
      <button className="btn-submit" onClick={validateAndBet}>
        {t('datcuoc')}
      </button>
    </div>
  </div>
</div>

  )
}

export default MatchDetails
