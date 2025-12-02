import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Notify } from '../Notify'

const CountdownTimer = ({ initialTime = 300 }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [showTimeoutNotification, setShowTimeoutNotification] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (timeLeft <= 0) {
      setShowTimeoutNotification(true)
      setTimeout(() => navigate('/member/deposit'), 3000)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, navigate])

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0'
    )}`
  }

  return (
    <>
      {showTimeoutNotification && (
        <Notify
          message='Hết thời gian! Đang quay lại màn hình trước...'
          isVisible={true}
          setcontent={setShowTimeoutNotification}
        />
      )}
      <span className='demnguoc'>{formatTime(timeLeft)}</span>
    </>
  )
}

export default CountdownTimer
