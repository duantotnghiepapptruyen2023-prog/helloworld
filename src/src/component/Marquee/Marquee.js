import './Marquee.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

function Marquee () {
  const { t } = useTranslation()

  return (
    <div className='marquee_container'>
      <FontAwesomeIcon icon={faBullhorn} className='marquee_icon' />

      <div className='marquee_text_wrapper'>
        <div className='marquee_text'>
          {/* BT66 – Game Giải Trí Phản Tỷ Số Kịch Tính Nhất Hiện Nay! Khuyến mãi ngập tràn theo tháng, thỏa sức cá cược. Nạp tiền ngay ! */}
          {t('marquee')}
        </div>
      </div>
    </div>
  )
}

export default Marquee
