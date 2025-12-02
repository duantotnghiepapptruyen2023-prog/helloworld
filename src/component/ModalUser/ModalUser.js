import React from 'react'
import ReactDOM from 'react-dom'
import './ModalUser.scss'

const ModalUser = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className='modal-component-overlay-user'>
      <div
        className='modal-component-content-user'
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export default ModalUser
