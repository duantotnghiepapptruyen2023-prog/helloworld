/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { React, useState, useEffect, useRef } from 'react'

import './DaiLyLayout.scss'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../component/MaHoaDuLieu'
import { Loading } from '../../component/Loading'
import { useTranslation } from 'react-i18next'
import Notify from '../../component/Notify/Notify'
import { BangXepHang } from '../BangXepHang'

const copyToClipboard = async text => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch (err) {
      document.body.removeChild(ta)
      return false
    }
  }
}

function IconCopy () {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='9'
        y='9'
        width='10'
        height='10'
        rx='2'
        stroke='currentColor'
        strokeWidth='1.6'
      />
      <rect
        x='5'
        y='5'
        width='10'
        height='10'
        rx='2'
        stroke='currentColor'
        strokeWidth='1.6'
      />
    </svg>
  )
}

function IconQR () {
  return (
    <svg
      width='64'
      height='64'
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='4'
        y='4'
        width='12'
        height='12'
        rx='1.5'
        fill='#111'
        stroke='#ffb84d'
        strokeWidth='1'
      />
      <rect
        x='4'
        y='20'
        width='12'
        height='12'
        rx='1.5'
        fill='#111'
        stroke='#ffb84d'
        strokeWidth='1'
      />
      <rect
        x='20'
        y='4'
        width='12'
        height='12'
        rx='1.5'
        fill='#111'
        stroke='#ffb84d'
        strokeWidth='1'
      />
      <rect
        x='34'
        y='34'
        width='10'
        height='10'
        rx='1'
        fill='#111'
        stroke='#ffb84d'
        strokeWidth='1'
      />
      <rect x='20' y='20' width='6' height='6' rx='1' fill='#ffb84d' />
    </svg>
  )
}

const DaiLyLayout = () => {
  const { t } = useTranslation()
  const [userdata, setUserdata] = useState(null)
  const [dataHoahong, setDataHoahong] = useState({})
  const [datanguoi, setDatanguoi] = useState({})
  const [loading, setLoading] = useState(false)
  const [notify, setNotify] = useState(null)
  const apiUrl = process.env.REACT_APP_API_URL
  const hasFetched = useRef(false)
  useEffect(() => {
    const data =
      JSON.parse(getFromsessionstorage('data_u')) ||
      JSON.parse(getFromlocalstorage('data_u'))
    setUserdata(data)
  }, [])

  useEffect(() => {
    if (!userdata || hasFetched.current) return
    hasFetched.current = true
    const controller = new AbortController()
    const fetchRefData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${apiUrl}/referred/${userdata.id}`, {
          signal: controller.signal
        })
        if (!res.ok) throw new Error('failed')
        const d = await res.json()
        setDataHoahong(d)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const fetchNguoi = async () => {
      try {
        const r = await fetch(`${apiUrl}/getsoluongf123/${userdata.id}`)
        if (!r.ok) throw new Error('failed')
        const dd = await r.json()
        setDatanguoi(dd)
      } catch (err) {
        console.error(err)
      }
    }

    fetchRefData()
    fetchNguoi()

    return () => controller.abort()
  }, [userdata, apiUrl])

  const referralLink = `${window.location.origin}/login?code=${
    userdata?.code || ''
  }`

  const handleCopy = async (v, label) => {
    const ok = await copyToClipboard(v)
    setNotify(ok ? label || 'Đã sao chép' : 'Không sao chép được')
    setTimeout(() => setNotify(null), 3000)
  }

  return (
    <div className='rx-container'>
      <header className='rx-header'>
        <div className='rx-brand'>
          <div className='rx-title'>{t('quanlydaily') || 'Quản lý đại lý'}</div>
        </div>
      </header>
      <main className='rx-main'>
        <section className='rx-profile'>
          <div className='rx-avatar-wrap'>
            <div className='rx-avatar'>
              {(userdata?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div className='rx-username'>
              {t('xinchao') || 'Xin chào'},{' '}
              <strong>{userdata?.username || 'User'}</strong>
            </div>
          </div>

          <div className='rx-ref'>

            <div className='rx-ref-body'>
              <div className='rx-ref-row'>
                <div className='rx-ref-text'>
                  {t('magioithieu') || 'Mã giới thiệu'}{' '}
                  <span className='rx-code'>{userdata?.code || '—'}</span>
                </div>
                <button
                  className='rx-copy'
                  onClick={() =>
                    handleCopy(userdata?.code || '', userdata?.code)
                  }
                  aria-label='copy code'
                >
                  <IconCopy />
                </button>
              </div>

              <div className='rx-ref-row small'>
                <div className='rx-link-box'>{referralLink}</div>
                <button
                  className='rx-copy'
                  onClick={() => handleCopy(referralLink, 'Link')}
                  aria-label='copy link'
                >
                  <IconCopy />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className='rx-f123'>
          <div className='rx-f123-head'>
            <h4>{t('doicuatoi') || 'Đội của tôi'}</h4>
            <a className='rx-small-link' href='/agent/team'>
              {t('xemtatca') || 'Xem tất cả'}
            </a>
          </div>

          <div className='rx-f123-grid'>
            {['lv1', 'lv2', 'lv3'].map((lvl, i) => {
              const colors = [
                'linear-gradient(135deg,#ff6b6b,#ff9a6b)',
                'linear-gradient(135deg,#4ecdc4,#6bf0c8)',
                'linear-gradient(135deg,#ffc857,#ff9f1c)'
              ]
              return (
                <div
                  className='rx-card'
                  key={lvl}
                  style={{ background: colors[i] }}
                >
                  <div className='rx-card-inner'>
                    <div className='rx-card-count'>{datanguoi?.[lvl] ?? 0}</div>
                    <div className='rx-card-sub'>{t('user') || 'Users'}</div>
                    <div className='rx-card-level'>
                      {t('lv') || 'LV'} {i + 1}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <BangXepHang userId={userdata?.id} />

        <div style={{ height: 70 }} />

        {notify && <div className='rx-toast'>{notify}</div>}
      </main>

      {loading && <div className='rx-loading'>Loading…</div>}
    </div>
  )
}

export default DaiLyLayout
