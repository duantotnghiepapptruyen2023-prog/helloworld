/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './ModalCapCha.scss'
import { useTranslation } from 'react-i18next'
import { Modal } from 'antd'
import Notify from '../Notify/Notify'

const ModalCapCha = ({ isOpen, onClose, Event }) => {
  const [allImages, setAllImages] = useState([])
  const [displayImages, setDisplayImages] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [answerValues, setAnswerValues] = useState([])
  const [message, setMessage] = useState('')
  const { t } = useTranslation()
  const apiUrl = process.env.REACT_APP_API_URL

  const fetchImages = async () => {
    try {
      const response = await fetch(`${apiUrl}/getimagecapcha2`)
      const data = await response.json()
      if (response.ok) {
        setAllImages(data)
        setupCaptcha(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setupCaptcha = images => {
    const uniqueValues = [...new Set(images.map(img => img.value))]

    const shuffledValues = uniqueValues.sort(() => Math.random() - 0.5)
    const selectedValues = shuffledValues.slice(0, 2)
    setAnswerValues(selectedValues)

    const [valueA, valueB] = selectedValues

    const valueAImages = images.filter(img => img.value === valueA).slice(0, 2)
    const valueBImages = images.filter(img => img.value === valueB).slice(0, 2)

    const distractors = images.filter(
      img => img.value !== valueA && img.value !== valueB
    )

    const shuffledDistractors = distractors
      .sort(() => Math.random() - 0.5)
      .slice(0, 9)

    const finalImages = [
      ...valueAImages,
      ...valueBImages,
      ...shuffledDistractors
    ].sort(() => Math.random() - 0.5)

    setDisplayImages(finalImages)
    setSelectedImages([])
  }

  useEffect(() => {
    if (isOpen) {
      fetchImages()
    }
  }, [isOpen])

  const handleImageClick = image => {
    setSelectedImages(prev =>
      prev.includes(image)
        ? prev.filter(img => img !== image)
        : prev.length < 2
        ? [...prev, image]
        : prev
    )
  }

  const handleConfirm = () => {
    if (selectedImages.length !== 2) {
      setMessage(t('chonitnhat2anh'))
      return
    }

    const selectedValues = selectedImages.map(img => img.value)
    const isValid = selectedValues.every(val => answerValues.includes(val))

    if (isValid) {
      onClose()
      Event()
      setSelectedImages([])
    } else {
      setMessage(t('chonanhkodung'))
      setSelectedImages([])
      setupCaptcha(allImages) // làm mới ảnh
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={handleConfirm}
      centered
      wrapClassName='captcha'
      okText={t('xacnhan')}
      cancelText={t('huybo')}
    >
      <div className='captcha-title'>
        🔐 {t('chonhagiongnhau')}: {answerValues.join('  &  ')}
      </div>

      <div className='captcha-grid'>
        {displayImages.map((src, index) => (
          <img
            key={index}
            src={`${apiUrl}/${src.url}`}
            alt={`captcha-${index}`}
            className={`captcha-image ${
              selectedImages.includes(src) ? 'selected' : ''
            }`}
            onClick={() => handleImageClick(src)}
            loading='lazy'
          />
        ))}
      </div>

      {message && (
        <Notify message={message} type='error' setcontent={setMessage} />
      )}
    </Modal>
  )
}

export default ModalCapCha
