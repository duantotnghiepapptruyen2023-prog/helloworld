import React, { useState, useEffect, useRef } from 'react'
import './BankInfoUpdate.scss'
import { Link } from 'react-router-dom'
import { ModalCapCha } from '../../../component/ModalCapCha'
import { Loading } from '../../../component/Loading'
import {
  getFromsessionstorage,
  getFromlocalstorage
} from '../../../component/MaHoaDuLieu'
import { useTranslation } from 'react-i18next'
import { useUser } from '../../../component/UserProvider/UserProvider'
import { Notify } from '../../../component/Notify'
import { Select } from 'antd'
const { Option } = Select

const BankInfoUpdate = () => {
  const hasFetched = useRef(false)
  const data =
    JSON.parse(getFromsessionstorage('data_u')) ||
    JSON.parse(getFromlocalstorage('data_u'))
  // const [bankList, setBankList] = useState([])
  const [bank, setBank] = useState('')
  const [code, setcode] = useState('')
  const [accountOwner, setAccountOwner] = useState('')
  const [modalCapcha, setisModalCapcha] = useState(false)
  const [loading, setloading] = useState(false)
  const [typenoti, settypenoti] = useState('error')
  const [message, setMessage] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL
  const { user, fetchUser } = useUser()

  const bankList = [
    {
      code: 'BAAC',
      shortName: 'Bank for Agriculture and Agricultural Cooperatives'
    },
    {
      code: 'BBL',
      shortName: 'Bangkok Bank'
    },
    {
      code: 'BOA',
      shortName: 'Bank of Ayudhya (Krungsri)'
    },
    {
      code: 'CIMBT',
      shortName: 'CIMB Thai'
    },
    {
      code: 'GHB',
      shortName: 'GH Bank'
    },
    {
      code: 'GSB',
      shortName: 'Government Savings Bank'
    },
    {
      code: 'KNK',
      shortName: 'Kiatnakin Bank'
    },
    {
      code: 'KSKB',
      shortName: 'KASIKORN BANK'
    },
    {
      code: 'KTB',
      shortName: 'KTB Bank'
    },
    {
      code: 'LHB',
      shortName: 'LH Bank (Land and House Bank)'
    },
    {
      code: 'SCB',
      shortName: 'Siam Commercial Bank'
    },
    {
      code: 'TISC',
      shortName: 'TISCO Bank'
    },
    {
      code: 'TMB',
      shortName: 'TMB Bank'
    },
    {
      code: 'UOBT',
      shortName: 'UOB Thai'
    }
  ]

  useEffect(() => {
    if (data && !hasFetched.current) {
      fetchUser(data._id)
      hasFetched.current = true
    }
  }, [data])

  useEffect(() => {
    if (user) {
      setBank(user.bank_name)
    }
  }, [user])

  // useEffect(() => {
  //   const fetchBanks = async () => {
  //     try {
  //       const response = await fetch('https://api.vietqr.io/v2/banks')
  //       const result = await response.json()
  //       if (response.ok && result.data) {
  //         setBankList(result.data)
  //         // console.log(result)
  //       } else {
  //         console.error(t('loiketnoi'), result)
  //       }
  //     } catch (error) {
  //       console.error(t('loiketnoi'), error)
  //     }
  //   }

  //   fetchBanks()
  // }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!bank || !accountNumber) {
      setMessage(t('vuilongdienbankvastk'))
      settypenoti('error')
      return
    }
    if (!user.bank_account_name && !accountOwner) {
      setMessage(t('vuilongnhapctk'))
      settypenoti('error')
      return
    }
    setisModalCapcha(true)
  }

  const handleCapchaSubmit = async () => {
    setloading(true)
    try {
      const response = await fetch(`${apiUrl}/postbank/${data._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bank_account_name:
            accountOwner || user.bank_account_name || data.username,
          bank_name: bank,
          bank_account_number: accountNumber,
          bank_swift_code: code
        })
      })

      const result = await response.json()
      setloading(false)
      if (response.ok) {
        setMessage(t('capnhatthanhcong'))
        await fetchUser(data._id)
        setAccountNumber('') // Reset số tài khoản
        setBank('') // Reset ngân hàng
        setAccountOwner('') // Reset tên tài khoản (nếu cần)
        settypenoti('success')
      } else {
        setMessage(result.message || t('capnhatthatbaicryto'))
        settypenoti('error')
      }
    } catch (error) {
      setloading(false)
      setMessage(t('loiupdatebank'))
      settypenoti('error')
    }
  }
  useEffect(() => {
    if (user?.bank_account_number) {
      setAccountNumber(user.bank_account_number)
    }
  }, [user])

  return (
    <>
      <div className='security-bank-container'>
        <div className='security-bank-header'>
          <Link to='/member'>
            <div className='security-bank-icback'>
              <img src='/back.png' alt='Quay lại' />
            </div>
          </Link>
          <div className='security-bank-title'>{t('capnhatthongtinbank')}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='security-bank-input'>
            <div className='bank-form-group'>
              <Select
                id='select-bank'
                showSearch={false}
                value={bank || ''}
                onChange={value => {
                  const selectedBank = bankList.find(b => b.shortName === value)
                  setBank(value)
                  setcode(selectedBank?.code || '')
                }}
                optionFilterProp='children'
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
                style={{ width: '100%', fontSize: '16px' }}
                placeholder={t('chonnganhang')}
              >
                <Option value='' disabled >
                  {t('chonnganhang')}
                </Option>
                {bankList.map(b => (
                  <Option key={b.id} value={b.shortName} >
                    {/* <img src={b.logo} alt={b.name} style={{ width: 50, marginRight: 8 }} /> */}
                    {`${b.code} - ${b.shortName}`}
                  </Option>
                ))}

              </Select>
            </div>
            <div className='bank-form-group1'>
              <input
                type='text'
                id='number-account'
                placeholder={user?.bank_account_number || t('stknhantien')}
                required
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
              />
            </div>
            <div className='bank-form-group1'>
              <input
                type='text'
                id='owner-acc'
                placeholder={user?.bank_account_name || t('tenctk')}
                required={!user?.bank_account_name}
                value={accountOwner || user?.bank_account_name || ''}
                onChange={e => setAccountOwner(e.target.value)}
                disabled={!!user?.bank_account_name}
              />
            </div>
            <div>
              {user?.bank_account_name && (
                <div className="luuy-box">
                  <div className="luuy-title">
                    <img src="/vnd.webp" alt="warning" />
                    <span>บันทึก</span>
                  </div>

                  <ul className="luuy-list">
                    <li>คุณไม่สามารถแก้ไขข้อมูลชื่อธนาคารได้</li>

                  </ul>
                </div>
              )}
            </div>
            <button type='submit' className='bank-submit-button'>
              {t('capnhat')}
            </button>
          </div>
        </form>
      </div>

      {message && (
        <Notify message={message} type={typenoti} setcontent={setMessage} />
      )}

      <ModalCapCha
        isOpen={modalCapcha}
        onClose={() => setisModalCapcha(false)}
        loading={loading}
        setloading={setloading}
        Event={handleCapchaSubmit}
      />

      <Loading isLoading={loading} />
    </>
  )
}

export default BankInfoUpdate
