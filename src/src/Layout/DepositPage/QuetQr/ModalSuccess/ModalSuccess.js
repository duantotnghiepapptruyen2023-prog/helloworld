import React from 'react'
import { Link } from 'react-router-dom'
import './ModalSuccess.scss'
import { ModalUser } from '../../../../component/ModalUser'

function ModalSuccess ({ isOpen, OnClose }) {
  return (
    <ModalUser isOpen={isOpen} onClose={OnClose}>
      <div className='modal-success-content'>
        <div className='icon-success'>
          <img src='/success.png' alt='Success' />
        </div>
        <h2 className='modal-success-title'>Chuyển khoản thành công!</h2>
        <p className='modal-success-description'>
          Giao dịch của bạn đã được xác nhận
        </p>
        <div className='modal-success-actions'>
          <Link to='/' className='btn-go-home'>
            Về trang chủ
          </Link>
        </div>
      </div>
    </ModalUser>
  )
}

export default ModalSuccess
