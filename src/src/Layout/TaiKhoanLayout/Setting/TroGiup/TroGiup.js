import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../VeChungToi/VeChungToi.scss'
import { getFromsessionstorage, getFromlocalstorage } from '../../../../component/MaHoaDuLieu'
import { useTranslation } from 'react-i18next'
const TroGiup = () => {
  const [content, setContent] = useState('')
  const userdata = getFromsessionstorage('data_u') || getFromlocalstorage('data_u')
  const { t } = useTranslation();
  const apiUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apihotro = t("linkapihotro");
        const response = await axios.get(`${apiUrl}/pages/${apihotro}`)
        setContent(response.data.content)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error)
      }
    }

    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='about-me-container'>
      <div className='about-me-header'>
        <Link to={userdata ? '/member' : '/'}>
          <div className='about-me-icback'>
            <img src='/back.png' alt='Back' />
          </div>
        </Link>
        <div className='about-me-text'>{t("hotro")}</div>
      </div>
      <div className='about-me-content'>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <div className='box-height'></div>
    </div>
  )
}

export default TroGiup
