/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Pagination, Spin, Select } from 'antd'
import { Link } from 'react-router-dom'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../component/MaHoaDuLieu'
import { useTranslation } from 'react-i18next'
import './TransactionHistory.scss'

const { Option } = Select

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState('all')
  const pageSize = 5
  const { t } = useTranslation()

  const storedData =
    getFromsessionstorage('data_u') || getFromlocalstorage('data_u')
  const data = storedData ? JSON.parse(storedData) : null
  const userId = data?.id
  const apiUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    if (!userId) {
      setError(t('kothayiduser'))
      setLoading(false)
      return
    }

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${apiUrl}/getlichsugd/${userId}`)
        if (!response.ok) throw new Error(t('loikhithaydulieu'))

        const data = await response.json()
        setTransactions(data)
      } catch (error) {
        setError(error.message || t('kothetaidlgd'))
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [userId])

  const typeTranslationMap = {
    'Nạp tiền pháp định': 'nap',
    'Rút tiền pháp định': 'rut',
    'Nạp-Crypto': 'napcrypto',
    'Rút-Crypto': 'rutcrypto'
  }

  const statusTranslationMap = {
    'Chờ xử lý': 'choxuly',
    'Thành công': 'thanhcong',
    'Bị hủy': 'bihuy',
    'Không xác định': 'koxacdinh'
  }

  const filteredTransactions =
    filterType === 'all'
      ? transactions
      : transactions.filter(item => item.type === filterType)

  const paginatedData = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className='transaction-container'>
      <div className='transaction-header'>
        <Link to='/member'>
          <div className='ic-back'>
            <img src='/back.png' alt='Back' />
          </div>
        </Link>
        <div className='transaction-text'>{t('lsgd')}</div>
        <div className='deposit-right'></div>
      </div>

      <div className='custom-table-container'>
        <div className='filter-container'>
          <Select
            id='typeFilter'
            value={filterType}
            onChange={value => {
              setFilterType(value)
              setCurrentPage(1)
            }}
            style={{ width: 180 }}
          >
            <Option value='all'>{t('tatca')}</Option>
            <Option value='Nạp'>{t('nap')}</Option>
            <Option value='Nạp-Crypto'>{t('napcrypto')}</Option>
            <Option value='Rút'>{t('rut')}</Option>
            <Option value='Rút-Crypto'>{t('rutcrypto')}</Option>
          </Select>
        </div>

        {loading ? (
          <Spin tip={t('dangtai')} />
        ) : error ? (
          <div className='error-text'>{error}</div>
        ) : filteredTransactions.length === 0 ? (
          <div className='empty-text'>{t('kocolsgd')}</div>
        ) : (
          <>
            {paginatedData.map((item, index) => (
              <div className='transaction-card' key={index}>
                <div className='card-title'>
                  {t(typeTranslationMap[item.type] || 'koxacdinh')}
                </div>
                <div className='card-info'>
                  <div>
                    <strong>{t('ngay')}</strong> {item.created}
                  </div>
                  <div>
                    <strong>{t('sotien')}</strong>{' '}
                    <span
                      style={{ color: item.amount < 0 ? 'red' : 'green' }}
                      className='amount_transaction'
                    >
                      {item.amount.toLocaleString('en-US')}
                    </span>
                  </div>
                  <div>
                    <strong>{t('trangthai')}</strong>{' '}
                    {t(statusTranslationMap[item.status] || 'koxacdinh')}
                  </div>
                </div>
              </div>
            ))}
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredTransactions.length}
              onChange={page => setCurrentPage(page)}
              className='custom-pagination'
            />
          </>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory
