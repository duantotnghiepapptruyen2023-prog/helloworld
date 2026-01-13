/* eslint-disable react-hooks/exhaustive-deps */
import './BangXepHang.scss'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

function BangXepHang ({ userId }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [yourRank, setYourRank] = useState(null)
  const [loading, setLoading] = useState(false)
  const apiUrl = process.env.REACT_APP_API_URL
  const { t } = useTranslation()

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      if (!userId) return
      setLoading(true)
      try {
        const res = await fetch(`${apiUrl}/getbangxephang/${userId}`)
        if (!res.ok) throw new Error('network')
        const data = await res.json()
        if (!mounted) return
        setLeaderboard(Array.isArray(data.top10) ? data.top10 : [])
        setYourRank(data.yourRank || null)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => {
      mounted = false
    }
  }, [userId, apiUrl])

  const isInTop10 = leaderboard.some(p => p.username === yourRank?.username)

  return (
    <section className='rx-leaderboard'>
      <div className='rx-leaderboard-head'>
        <h3>{t('bxh') || 'Bảng xếp hạng'}</h3>
      </div>

      <div className='rx-leaderboard-body'>
        {loading ? (
          <div className='rx-spinner'>...</div>
        ) : (
          <ul className='rx-list'>
            <li className='rx-row rx-row-head'>
              <span className='rx-col-rank'>#</span>
              <span className='rx-col-user'>
                {t('nguoidung') || 'Người dùng'}
              </span>
              <span className='rx-col-meta'></span>
            </li>
            {leaderboard.map((p, i) => {
              const isMe = p.username === yourRank?.username
              return (
                <li key={i} className={`rx-row ${isMe ? 'rx-me' : ''}`}>
                  <span className='rx-col-rank'>{p.rank || i + 1}</span>
                  <span className='rx-col-user'>{p.username}</span>
                  <span className='rx-col-meta'>
                    {p.totalBonus
                      ? p.totalBonus.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      : ''}
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {!isInTop10 && yourRank && (
          <div className='rx-your-rank'>
            <div className='rx-your-rank-left'>#{yourRank.rank}</div>
            <div className='rx-your-rank-center'>{yourRank.username}</div>
            <div className='rx-your-rank-right'>
              {yourRank.totalBonus.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) || ''}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default BangXepHang
