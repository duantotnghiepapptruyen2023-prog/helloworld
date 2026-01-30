/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../../component/MaHoaDuLieu'
import { Loading } from '../../../component/Loading'
import MatchCard from '../../../component/MatchCard/MatchCard'

const MatchCardList = () => {
  const userdata =
    getFromsessionstorage('data_u') || getFromlocalstorage('data_u')
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const apiUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${apiUrl}/randomtran`)
        const data = await response.json()

        if (!data.error) {
          const limitedMatches = data.slice(0, 5)
          setMatches(limitedMatches)
        }
        setLoading(false)
      } catch (error) {
        console.error('Lỗi fetch API:', error)
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])
  console.log(matches)

  return (
    <div style={{ padding: '10px' }}>
      {matches.map(match => (
        <MatchCard
          key={match.id}
          leagueName={match.leagueName}
          time={match.started}
          hour={match.hour}
          homeTeam={match.homeTeam}
          awayTeam={match.awayTeam}
          homeIcon={`${apiUrl}/${match.homeIcon}`}
          awayIcon={`${apiUrl}/${match.awayIcon}`}
          linkTo={userdata ? `/game/detailmatch/${match.gameId}` : '/login'}
          bet={match.bet}
        />
      ))}
      <Loading isLoading={loading} />
    </div>
  )
}

export default MatchCardList
