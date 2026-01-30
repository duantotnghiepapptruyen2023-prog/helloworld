/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './VeChungToi.scss'
import { useTranslation } from 'react-i18next'
const AboutMe = () => {
  const [content, setContent] = useState('')
  const { t } = useTranslation();
  const apiUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apivechungtoi = t("linkapivechungtoi")
        const response = await axios.get(
          `${apiUrl}/pages/${apivechungtoi}`
        )
        setContent(response.data.content)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className='about-me-container'>
      <div className='about-me-header'>
        <Link to='/member'>
          <div className='about-me-icback'>
            <img src='/back.png' alt='Back' />
          </div>
        </Link>
        <div className='about-me-text'>{t("vechungtoi")}</div>
      </div>
      <div className='about-me-content'>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <div className='box-height'></div>
    </div>
  )
}

export default AboutMe
