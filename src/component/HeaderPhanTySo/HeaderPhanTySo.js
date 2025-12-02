/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getFromlocalstorage, getFromsessionstorage } from '../../component/MaHoaDuLieu'
import './HeaderPhanTySo.scss'
import { useUser } from '../UserProvider/UserProvider'
function HeaderPhanTySo () {
  const hasFetched = useRef(false)
  const data_user = JSON.parse(getFromlocalstorage('data_u')) ||JSON.parse(getFromsessionstorage('data_u'))

  const { user, fetchUser } = useUser()

  useEffect(() => {
    if (data_user && !hasFetched.current) {
      fetchUser(data_user._id)
      hasFetched.current = true
    }
  }, [data_user])

  return (
    <>
      <div className='header-phantyso'>
        <div className='logo'>
          <Link to='/'>
            <img src='/back.png' alt='Logo' style={{width:30}}/>
          </Link>
          <img src='/logo.png' alt='Logo' />
          <div className='div_sotien_text'>
            <div className='div_sotien'>
              {' '}
              {user?.coins === 0
                ? '0.00'
                : Number((user?.coins || 0).toFixed(0)).toLocaleString(
                    'en-US'
                  ) || 0}
                  {' '}đ
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeaderPhanTySo
