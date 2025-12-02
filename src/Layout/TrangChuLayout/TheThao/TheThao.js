import './TheThao.scss'
import { useState } from 'react'
import { ListGameMobile } from '../../../component/ListGameMobile'
import {
  getFromlocalstorage,
  getFromsessionstorage
} from '../../../component/MaHoaDuLieu/MaHoaDuLieu'
import Loading from '../../../component/Loading/Loading'
import { useNavigate } from 'react-router-dom'

function TheThao () {
  const [isLoading, setisLoading] = useState(false)
  const apiUrl = process.env.REACT_APP_API_URL

  const navigate = useNavigate()

  const device = window.innerWidth > 540 ? 'd' : 'm'
  const userdata =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))

  const data_b = sessionStorage.getItem('data_u')
  const data = [
    {
      logo: '/mobile/thethao/logosaba.png',
      img: '/mobile/thethao/anhsaba.webp',
      portfolio: 'ThirdPartySportsBook',
      gameproviderid: '44',
      gameid: '0'
    },
    {
      logo: '/mobile/thethao/logosbo.png',
      img: '/mobile/thethao/anhsbo.webp',
      portfolio: 'SportsBook',
      gameproviderid: null,
      gameid: null
    },
    {
      logo: '/mobile/thethao/logobti.png',
      img: '/mobile/thethao/anhbti.webp',
      portfolio: 'ThirdPartySportsBook',
      gameproviderid: '1022',
      gameid: '0'
    }
  ]

  const hanldePostWidthdraw = async (portfolio, gameProviderId, gameId) => {
    try {
      setisLoading(true)
      const response = await fetch(`${apiUrl}/launch_game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolio,
          device,
          gameProviderId,
          gameId,
          userData: userdata,
          productId: null
        })
      })
      const data = await response.json()
      console.log(data)

      if (data.message) {
        setisLoading(false)
        alert(data.message)
      } else {
        if (data.url) {
          window.location.href = data.url
          setisLoading(false)
        }
      }
    } catch (error) {
      setisLoading(false)
      console.error('Failed to fetch API: ', error)
    }
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <ListGameMobile>
        <ul className='ulthethao'>
          {data.map((item, index) => (
            <li
              className='thethao_item'
              style={{ background: 'url(/backgroundtt.png)' }}
              key={index}
              onClick={() => {
                if (!data_b) {
navigate('/login')
                } else
                  hanldePostWidthdraw(
                    item.portfolio,
                    item.gameproviderid,
                    item.gameid
                  )
              }}
            >
              <div className='gameitem'>
                <div className='firm_logo'>
                  <i>
                    <img src={item.logo} alt='' />
                  </i>
                </div>
                <div
                  style={{ backgroundImage: `url(${item.img})` }}
                  className='anhgame'
                ></div>
                <div className='gametag'></div>
              </div>
            </li>
          ))}
        </ul>
      </ListGameMobile>
    </>
  )
}

export default TheThao
