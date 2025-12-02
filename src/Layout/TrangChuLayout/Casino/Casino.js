import { useState } from 'react'
import { ListGameMobile } from '../../../component/ListGameMobile'
import {
  getFromlocalstorage,
  getFromsessionstorage
} from '../../../component/MaHoaDuLieu/MaHoaDuLieu'
import Loading from '../../../component/Loading/Loading'
import { useNavigate } from 'react-router-dom'

function Casino () {
  const [isLoading, setisLoading] = useState(false)
  const apiUrl = process.env.REACT_APP_API_URL

  const device = window.innerWidth > 540 ? 'd' : 'm'
  const userdata =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))

  const navigate = useNavigate()

  const data = [
    {
      logo: '/mobile/casino/logosexy.png',
      img: '/mobile/casino/anhsexy.webp',
      first: 'lifirst',
      classimage: 'anh_item_first',
      firm_logo: 'firm_logo2',
      portfolio: 'SeamlessGame',
      gameproviderid: '7',
      gameid: '0'
    },
    {
      logo: '/mobile/casino/logodg.png',
      img: '/mobile/casino/anhdg.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '1030',
      gameid: '0'
    },
    {
      logo: '/mobile/casino/logowm.png',
      img: '/mobile/casino/anhwm.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '0',
      gameid: '0'
    },
    {
      logo: '/mobile/casino/logoag.png',
      img: '/mobile/casino/anhag.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '1035',
      gameid: '0'
    },
    {
      logo: '/mobile/casino/logoevo.png',
      img: '/mobile/casino/anhevo.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '20',
      gameid: '0'
    },
    {
      logo: '/mobile/casino/logosa.png',
      img: '/mobile/casino/anhsa.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '19',
      gameid: '0'
    },
    {
      logo: '/mobile/casino/logopp.png',
      img: '/mobile/casino/anhpp.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '3',
      gameid: '0'
    },
    {
      logo: '/mobile/casino/logovia.png',
      img: '/mobile/casino/anhvia.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '1064',
      gameid: '0'
    },
    {
      logo: '/mobile/casino/logomg.png',
      img: '/mobile/casino/anhmg.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '29',
      gameid: '0'
    },
    {
      logo: '/mobile/casino/logoplaytech.png',
      img: '/mobile/casino/anhplaytech.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '1018',
      gameid: '0'
    },
    {
      logo: '/mobile/casino/logowe.png',
      img: '/mobile/casino/anhwe.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '1037',
      gameid: '0'
    },

    {
      logo: '/mobile/casino/logopa.png',
      img: '/mobile/casino/anhpa.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      portfolio: 'SeamlessGame',
      gameproviderid: '1035',
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
              className={`thethao_item ${item.first}`}
              key={index}
              style={{ background: 'url(/mobile/casino/backcasino.png)' }}
              onClick={() => {
                if (!userdata) {
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
                <div className={`firm_logo ${item.firm_logo}`}>
                  <i>
                    <img src={item.logo} alt='' />
                  </i>
                </div>
                <div
                  style={{ backgroundImage: `url(${item.img})` }}
                  className={`anhgame ${item.classimage}`}
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

export default Casino
