import React, { useEffect, useState } from 'react'
import './Notify.scss'

export default function Notify ({ message, type = 'error', duration = 3000,setcontent }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setcontent('')
    }, duration)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, message])

  if (!visible || !message) return null

  return <div className={`notify-message ${type}`}>{message}</div>
}
