/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

import { useSearchParams } from 'react-router-dom'
import Sidebar from './SideBarGame'
import { ListGameMobile } from '../ListGameMobile'
import Loading from '../Loading/Loading'
import { getFromlocalstorage, getFromsessionstorage } from '../MaHoaDuLieu'
import Carousel from '../../Layout/TrangChuLayout/Carousel/Carousel'
import { useTranslation } from 'react-i18next'
import './DanhSachGame.scss'
function DanhSachGame () {
  const [searchParams] = useSearchParams()
  const gamefromurl = searchParams.get('game') || 'nohu'
  const [tab, setTab] = useState(() => {
    return searchParams.get('tab') || (gamefromurl === 'nohu' ? 'PG' : 'JILI')
  })
  const [datagame, setdatagame] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const device = window.innerWidth > 540 ? 'd' : 'm'
  const userdata =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  const [imageList, setimageList] = useState([])
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL

  const data = [
    { name: 'PG', GpId: 35 },
    { name: 'JILI', GpId: 1020 },
    { name: 'MW', GpId: 1045 },
    { name: 'NS', GpId: 1066 },
    { name: 'FC', GpId: 1046 },
    { name: 'PP', GpId: 3 },
    { name: 'JDB', GpId: 1058 },
    { name: 'CQ9', GpId: 2 },
    { name: 'MG', GpId: 29 },
    { name: 'FS', GpId: 1079 },
    { name: 'PS', GpId: 1060 },
    { name: 'YB', GpId: 1019 },
    { name: 'VA', GpId: 1085 },
    { name: 'PA', GpId: 1035 },
    { name: 'HB', GpId: 1031 },
    { name: 'AP', GpId: 1034 }
  ]

  const datafish = [
    {
      name: 'JILI',
      GpId: 1020
    },
    {
      name: 'JDB',
      GpId: 1058
    },
    {
      name: 'FC',
      GpId: 1046
    }
  ]

  const dataxoso = [
    {
      name: 'TC',
      GpId: 1012
    }
  ]

  const currentItem =
    gamefromurl === 'nohu'
      ? data.find(item => item.name === tab)
      : gamefromurl === 'banca'
      ? datafish.find(item => item.name === tab)
      : dataxoso.find(item => item.name === tab)

  const fetcimage = async (req, res) => {
    try {
      const response = await fetch(`${apiUrl}/${t('bannertrangchu123')}`)
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setimageList(data)
      }
    } catch (error) {
      console.error('Lỗi: ', error)
    }
  }
  useEffect(() => {
    fetcimage()
  }, [t])

  const handelgame = async () => {
    try {
      setisLoading(true)
      const response = await fetch(`${apiUrl}/postdanhsachgame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          GpId: currentItem.GpId
        })
      })
      if (response.ok) {
        const data = await response.json()
        if (gamefromurl === 'nohu') {
          setdatagame(data.seamlessGameProviderGames)
        } else if (gamefromurl === 'banca') {
          const fishingGames = data.seamlessGameProviderGames.filter(
            g =>
              g.gameInfos &&
              g.gameInfos[0] &&
              g.gameInfos[0].gameName &&
              g.gameInfos[0].gameName.toLowerCase().endsWith('fishing')
          )
          setdatagame(fishingGames)
        } else if (gamefromurl === 'xoso') {
          setdatagame(data.seamlessGameProviderGames)
        }
        setisLoading(false)
      }
    } catch (error) {
      setisLoading(false)
      console.error(error)
    }
  }

  const hanldePostWidthdraw = async (gameProviderId, gameId) => {
    try {
      setisLoading(true)
      const response = await fetch(`${apiUrl}/launch_game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolio: 'SeamlessGame',
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

  useEffect(() => {
    if (currentItem) {
      handelgame()
    }
  }, [tab])
  console.log(datagame)

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='trangchu_container'>
        <Carousel images={imageList} />
        <div className='home_globby'>
          {gamefromurl !== 'xoso' && (
            <Sidebar
              tab={tab}
              settab={setTab}
              data={gamefromurl === 'nohu' ? data : dataxoso}
              gamefromurl={gamefromurl}
            />
          )}
          <ListGameMobile>
            <ul
              className={`ulthethao gridchia ${
                gamefromurl === 'xoso' && 'gridchia4'
              }`}
            >
              {datagame?.map(
                (item, index) =>
                  item.gameInfos.length > 0 && (
                    <li
                      key={index}
                      className='thethao_item noheight'
                      onClick={() =>
                        hanldePostWidthdraw(item.gameProviderId, item.gameID)
                      }
                    >
                      <div className='item_game'>
                        <img
                          src={item?.gameInfos[0].gameIconUrl}
                          alt=''
                          className='item_game_img_ds'
                        />
                        <span className='item_game_name_ds'>
                          {item.gameInfos[0].gameName}
                        </span>
                      </div>
                    </li>
                  )
              )}
            </ul>
          </ListGameMobile>
        </div>
        <div style={{ height: '100px' }}></div>
      </div>
    </>
  )
}

export default DanhSachGame
