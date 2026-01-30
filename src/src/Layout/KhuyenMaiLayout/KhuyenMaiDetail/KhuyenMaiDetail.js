/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import './KhuyenMaiDetail.scss'
import { useTranslation } from 'react-i18next'

const KhuyenMaiDetail = () => {
  const { id } = useParams()
  const [promotion, setPromotion] = useState(null)
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    axios
      .get(`${apiUrl}/promo/getkhuyenmai/${id}`)
      .then(response => {
        setPromotion(response.data)
      })
      .catch(error => {
        console.error('Lỗi khi lấy chi tiết khuyến mãi:', error)
      })
  }, [id])

  if (!promotion) {
    return <div>{t('dangtai')}</div>
  }

  return (
    <div className='container-khuyenmai-detail'>
      <div className='about-me-header'>
        <Link to='/khuyenmai'>
          <div className='about-me-icback'>
            <img src='/back.png' alt='Back' />
          </div>
        </Link>
        <div className='about-me-text'>{t('chitietkm')}</div>
      </div>

      <div className='container-khuyenmai3'>
        <img
          src={`${apiUrl}/${promotion.photo}`}
          alt={promotion.name}
        />
      </div>
    </div>
  )
}

export default KhuyenMaiDetail
