/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { Wheel } from 'react-custom-roulette'
import { Notify } from '../../../component/Notify'
import { ModalKetQua } from './ModalKetQua'
import './LuckyWheel.scss'
import { useUser } from '../../../component/UserProvider/UserProvider'
import { useTranslation } from 'react-i18next'

const data = [
  { option: '💰 2 points' },
  { option: '💰 5 points' },
  { option: '💰 10 points' },
  { option: '💰 15 points' },
  { option: '💰 20 points' },
  { option: '💰 16 points' },
  { option: '💰 50 points' },
  { option: '💰 100 points' },
  { option: '💰 200 points' },
  { option: '💰 500 points' }
]

const ENERGY_MAX = 300

export default function LuckyWheel ({ userId, apiUrl, result, setResult }) {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const [error, setError] = useState(null)
  const [type, settype] = useState('error')
  const [energy, setEnergy] = useState(0)
  const hasFetched = useRef(false)
  const [reward, setreward] = useState(0)
  const [luotquay, setluotquay] = useState(0)
  const { user, fetchUser } = useUser()
  const { t } = useTranslation()

  useEffect(() => {
    if (userId && !hasFetched.current) {
      fetchUser(userId)
      hasFetched.current = true
    }
  }, [userId])

  useEffect(() => {
    setEnergy(user?.diemthuong || 0)
    setluotquay(user?.luotquay || 0)
  }, [user])

  const rewardToIndex = {
    2: 0,
    5: 1,
    10: 2,
    15: 3,
    20: 4,
    16: 5,
    50: 6,
    100: 7,
    200: 8,
    500: 9
  }

  const handleSpinClick = async () => {
    setError('')
    setResult('')
    if (mustSpin || luotquay <= 0) return

    try {
      const response = await fetch(`${apiUrl}/postquaythuong/${userId}`, {
        method: 'POST'
      })
      const data = await response.json()

      if (data.error) {
        const errorMap = {
          'Không tìm thấy người dùng': t('khongtimthayuser'),
          'Bạn đã hết lượt quay': t('hetluot'),
          'Điểm thưởng đã đạt tối đa': t('diemmax')
        }
        setError(errorMap[data.error] || t('loiserver'))
        return
      }

      const reward = data.reward
      const index = rewardToIndex[reward]

      if (index === undefined) {
        setError(t('phanthuongloi'))
        return
      }
      setluotquay(data.luotquay || 0)
      setreward(reward)
      setPrizeNumber(index)
      setMustSpin(true)
    } catch (err) {
      setError(t('loiserver'))
    }
  }

  const handleSpinAgain = () => {
    setResult('')
    setMustSpin(false) // Ensure the wheel is ready for the next spin
    handleSpinClick() // Trigger the next spin
  }

  const handelRutTien = async () => {
    try {
      const response = await fetch(`${apiUrl}/ruttienquaythuong/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()

      if (data.error) {
        const errorMap = {
          'Không tìm thấy người dùng': t('khongtimthayuser'),
          'Điểm thưởng phải đạt ít nhất là 300 để rút tiền': t('diemthuongmax')
        }
        setError(errorMap[data.error])
        settype('error')

        return
      }
      setError(t('ruttienthanhcong'))
      setEnergy(0)
      settype('success')
    } catch (error) {
      setError(t('ruttienthatbai'))
      settype('error')
    }
  }

  return (
    <>
      <div className='luckywheel-container'>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false)
            setTimeout(() => {
              setResult(data[prizeNumber].option)
              const rewardValue =
                parseInt(data[prizeNumber].option.replace(/\D/g, '')) || 0
              setEnergy(prev => Math.min(ENERGY_MAX, prev + rewardValue))
            }, 300)
          }}
          backgroundColors={['#FFDD57', '#FF6B6B']}
          textColors={['#000']}
          outerBorderColor={'#000'}
          outerBorderWidth={5}
          radiusLineColor={'#ddd'}
          radiusLineWidth={2}
          fontSize={18}
        />
        <div className='energy-label'>
          {t('luotquay')}: {luotquay}
        </div>
        <div className='energy-label'>{t('moibanben3')}</div>

        <button
          onClick={handleSpinClick}
          disabled={mustSpin || luotquay <= 0}
          className='spin-button'
        >
          {mustSpin ? `${t('dangquay')}...` : `${t('quay')}`}
        </button>

        {error && <Notify message={error} type={type} setcontent={setError} />}

        <div className='energy-bar-container'>
          <div
            className='energy-bar-fill'
            style={{ width: `${(energy / ENERGY_MAX) * 100}%` }}
          />
        </div>
        <div className='energy-label'>
          Point {t('xuthuong')}: {energy} / {ENERGY_MAX}
        </div>

        {energy >= ENERGY_MAX && (
          <button className='withdraw-button' onClick={handelRutTien}>
            {t('ruttien')}
          </button>
        )}
      </div>
      {result && !error && (
        <ModalKetQua
          ketqua={reward}
          luotquay={luotquay}
          onClose={() => setResult('')}
          onSpinAgain={handleSpinAgain}
        />
      )}
    </>
  )
}
