import React from 'react'
import { Link } from 'react-router-dom'
import './MatchCard.scss'
import { useTranslation } from 'react-i18next'

const MatchCard = ({
  leagueName,
  time,
  homeTeam,
  awayTeam,
  homeIcon,
  awayIcon,
  linkTo,
  bet,
  hour,
  date
}) => {
  const { t } = useTranslation()

  const tabNames = [
    { id: '1_1', name: t('fttyso'), type: 'FT' },
    { id: '2_1', name: t('httyso'), type: 'HT' }
  ]

  return (
    <Link to={linkTo} className='match-card'>
      <div className='match-main'>
        <div className='teams-column'>
          <div className='team'>
            <img src={homeIcon} alt={homeTeam} />
            <p>{homeTeam}</p>
          </div>
          <div className='team'>
            <img src={awayIcon} alt={awayTeam} />
            <p>{awayTeam}</p>
          </div>
        </div>

        <div className='score-column'>
          <div className='score-row'>
            <span className='score-label'>{tabNames[0].name.toUpperCase()}</span>
            <div className='score-boxes'>
              {bet[0].data.map(item => (
                <span key={item.id} className='score-box'>{item.value}</span>
              ))}
            </div>
          </div>
          <div className='score-row'>
            <span className='score-label'>{tabNames[1].name.toUpperCase()}</span>
            <div className='score-boxes'>
              {bet[1].data.map(item => (
                <span key={item.id} className='score-box'>{item.value}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='match-footer'>
        <span className='footer-item league-name'>{leagueName}</span>
        <span className='footer-item hour'>{hour}</span>
        <span className='footer-item date'>{time}</span>
      </div>
    </Link>
  )
}

export default MatchCard
