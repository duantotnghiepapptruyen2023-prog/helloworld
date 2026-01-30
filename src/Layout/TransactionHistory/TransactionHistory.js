import React, { useState, useEffect } from 'react'
import { Pagination, Spin } from 'antd'
import { Link } from 'react-router-dom'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../component/MaHoaDuLieu'
import { useTranslation } from 'react-i18next'
import './TransactionHistory.scss'

const TransactionHistory = () => {
  const { t } = useTranslation()

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState('all')

  const pageSize = 5

  const storedData =
    getFromsessionstorage('data_u') || getFromlocalstorage('data_u')
  const data = storedData ? JSON.parse(storedData) : null
  const userId = data?.id
  const apiUrl = process.env.REACT_APP_API_URL

  /* ================= MAP I18N ================= */

  const typeTranslationMap = {
    'Nạp tiền pháp định': 'nap',
    'Rút tiền pháp định': 'rut',
    'Nạp-Crypto': 'napcrypto',
    'Rút-Crypto': 'naprut'
  }

  const statusTranslationMap = {
    'Chờ xử lý': 'choxuly',
    'Thành công': 'thanhcong',
    'Bị hủy': 'bihuy'
  }

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!userId) {
      setError('Không tìm thấy user')
      setLoading(false)
      return
    }

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${apiUrl}/getlichsugd/${userId}`)
        if (!res.ok) throw new Error('Lỗi tải dữ liệu')

        const data = await res.json()
        setTransactions(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [userId])

  /* ================= FILTER ================= */

  const filteredTransactions =
    filterType === 'all'
      ? transactions
      : transactions.filter(item => item.type === filterType)

  const paginatedData = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  /* ================= RENDER ================= */

  return (
    <div className='tx-wrapper'>
      {/* HEADER */}
      <header className='tx-header'>
        <Link to='/member' className='tx-back'>
          <img src='/back.png' alt='Back' />
        </Link>
        <h1 className='tx-title'>{t('lsgd')}</h1>
      </header>

      {/* FILTER BAR */}
      <div className='tx-filter-bar'>
        <div
          className={`tx-filter-item ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => {
            setFilterType('all')
            setCurrentPage(1)
          }}
        >
          {t('tatca')}
        </div>

        <div
          className={`tx-filter-item ${
            filterType === 'Nạp tiền pháp định' ? 'active' : ''
          }`}
          onClick={() => {
            setFilterType('Nạp tiền pháp định')
            setCurrentPage(1)
          }}
        >
          {t('nap')}
        </div>

        <div
          className={`tx-filter-item ${
            filterType === 'Nạp-Crypto' ? 'active' : ''
          }`}
          onClick={() => {
            setFilterType('Nạp-Crypto')
            setCurrentPage(1)
          }}
        >
          {t('napcrypto')}
        </div>

        <div
          className={`tx-filter-item ${
            filterType === 'Rút tiền pháp định' ? 'active' : ''
          }`}
          onClick={() => {
            setFilterType('Rút tiền pháp định')
            setCurrentPage(1)
          }}
        >
          {t('rut')}
        </div>

        <div
          className={`tx-filter-item ${
            filterType === 'Rút-Crypto' ? 'active' : ''
          }`}
          onClick={() => {
            setFilterType('Rút-Crypto')
            setCurrentPage(1)
          }}
        >
          {t('naprut')}
        </div>
      </div>

      {/* BODY */}
      <div className='tx-list'>
        {loading ? (
          <Spin tip={t('dangtai')} />
        ) : error ? (
          <div className='tx-error'>{error}</div>
        ) : filteredTransactions.length === 0 ? (
          <div className='tx-empty'>{t('kocolsgd')}</div>
        ) : (
          <>
            {paginatedData.map((item, index) => (
              <div className='tx-item' key={index}>
                <div className='tx-icon'>
                  {item.type.includes('Nạp') && (
                    <div className='tx-ic deposit'>↓</div>
                  )}
                  {item.type.includes('Rút') && (
                    <div className='tx-ic withdraw'>↑</div>
                  )}
                </div>

                <div className='tx-content'>
                  <div className='tx-row'>
                    <span className='tx-label'>{t('loaigd')}</span>
                    <span className='tx-value type'>
                      {t(typeTranslationMap[item.type] || 'naprut')}
                    </span>
                  </div>

                  <div className='tx-row'>
                    <span className='tx-label'>{t('ngay')}</span>
                    <span className='tx-value'>{item.created}</span>
                  </div>

                  <div className='tx-row'>
                    <span className='tx-label'>{t('sotien')}</span>
                    <span
                      className={`tx-value amount ${
                        item.amount < 0 ? 'red' : 'green'
                      }`}
                    >
                      {item.amount.toLocaleString('en-US')}
                    </span>
                  </div>

                  <div className='tx-row'>
                    <span className='tx-label'>{t('trangthai')}</span>
                    <span className='tx-value status'>
                      {t(statusTranslationMap[item.status] || 'koxacdinh')}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredTransactions.length}
              onChange={page => setCurrentPage(page)}
              className='tx-pagination'
            />
          </>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory