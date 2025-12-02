/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react'
import './CustomScroll.scss'
// import { t } from 'i18next'
import { Loading } from '../../../component/Loading'
import {
  getFromlocalstorage,
  getFromsessionstorage
} from '../../../component/MaHoaDuLieu'
import Notify from '../../../component/Notify/Notify'

const CustomScroll = () => {
  // const [message, setMessage] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const apiUrl = process.env.REACT_APP_API_URL
  const userdata =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  const device = window.innerWidth > 540 ? 'd' : 'm'
  const [message, setmessage] = useState('')
  const [type, setType] = useState('')

  const scrollImages = [
    {
      name: 'Sexy',
      img: '/anhgame/sexygm.png',
      portfolio: 'SeamlessGame',
      gameproviderid: '0',
      gameid: '0'
    },
    {
      name: 'Wm',
      img: '/anhgame/wm.png',
      portfolio: 'SeamlessGame',
      gameproviderid: '0',
      gameid: '0'
    },
    {
      name: 'Evo',
      img: '/anhgame/evo.png',
      portfolio: 'SeamlessGame',
      gameproviderid: '20',
      gameid: '0'
    }
  ]

  const imagegame = [
    {
      name: 'Saba sport',
      img: '/anhgame/saba.png',
      portfolio: 'ThirdPartySportsBook',
      gameproviderid: '44',
      gameid: '0'
    },
    {
      name: 'BTI',
      img: '/anhgame/bti.png',
      portfolio: 'ThirdPartySportsBook',
      gameproviderid: '1022',
      gameid: '0'
    },
    {
      name: 'CQ9',
      img: '/anhgame/cq9.png',
      portfolio: 'SeamlessGame',
      gameproviderid: '2',
      gameid: '0'
    }
  ]

  // const showUpdateMessage = () => {
  //   setMessage('')
  //   setTimeout(() => {
  //     setMessage(t('dangcapnhat'))
  //   }, 10)
  // }

  const hanldePostWidthdraw = async (
    portfolio,
    device,
    gameProviderId,
    gameId
  ) => {
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

      if (data.message) {
        setisLoading(false)
        setType('error')
        setmessage(data.message)
      } else {
        if (data.link) {
          window.location.href = data.link
          setisLoading(false)
        }
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
      <div className='custom-scroll-wrapper'>
        <div className='custom-scroll'>
          <div className='scroll-inner'>
            <div className='scroll-column1'>
              <div
                className='scroll-item large-item'
                onClick={() =>
                  hanldePostWidthdraw(
                    scrollImages[0].portfolio,
                    device,
                    scrollImages[0].gameproviderid,
                    scrollImages[0].gameid
                  )
                }
              >
                <img
                  src={scrollImages[0].img}
                  alt='Image 1'
                  className='item-image'
                />
              </div>
            </div>
            <div className='scroll-column2'>
              <div
                className='scroll-item small-item'
                onClick={() =>
                  hanldePostWidthdraw(
                    scrollImages[1].portfolio,
                    device,
                    scrollImages[1].gameproviderid,
                    scrollImages[1].gameid
                  )
                }
              >
                <img
                  src={scrollImages[1].img}
                  alt='Image 2'
                  className='item-image'
                />
              </div>
              <div
                className='scroll-item small-item'
                onClick={() =>
                  hanldePostWidthdraw(
                    scrollImages[2].portfolio,
                    device,
                    scrollImages[2].gameproviderid,
                    scrollImages[2].gameid
                  )
                }
              >
                <img
                  src={scrollImages[2].img}
                  alt='Image 3'
                  className='item-image'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='custom-scroll mt_scroll'>
        <div className='scroll-inner1'>
          {imagegame.map((src, index) => (
            <div
              className='scroll-item'
              key={index}
              onClick={() =>
                hanldePostWidthdraw(
                  src.portfolio,
                  device,
                  src.gameproviderid,
                  src.gameid
                )
              }
            >
              <img
                src={src.img}
                alt={`Image ${index + 1}`}
                className='item-image'
              />
            </div>
          ))}
        </div>
      </div>
      {message && (
        <Notify message={message} type={type} setcontent={setmessage} />
      )}
    </>
  )
}

export default CustomScroll
