/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './Carousel.scss'

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const apiUrl = process.env.REACT_APP_API_URL;
  const nextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  useEffect(() => {
    if (images.length === 0) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [images.length]) // Theo dõi sự thay đổi của images

  if (!images || images.length === 0) {
    return <div>Không có ảnh nào để hiển thị</div>
  }

  return (
    <div className='carousel'>
      <div
        className='carousel-inner'
        style={{
          transform: `translateX(-${(currentIndex % images.length) * 100}%)`
        }}
      >
        {images.map((image, index) => (
          <div key={index} className='carousel-item'>
            <img
              src={`${apiUrl}/${image.banner}`}
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <button className='carousel-control prev' onClick={prevSlide}>
        ❮
      </button>
      <button className='carousel-control next' onClick={nextSlide}>
        ❯
      </button>
    </div>
  )
}

export default Carousel
