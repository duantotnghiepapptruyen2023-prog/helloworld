import './Marquee.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn } from '@fortawesome/free-solid-svg-icons'

function Marquee() {
  return (
    <div className="marquee_container">
      <FontAwesomeIcon icon={faBullhorn} className="marquee_icon" />

      <div className="marquee_text_wrapper">
        <div className="marquee_text">
          JDT,... Khuyến mãi ngập tràn theo tháng, thỏa sức cá cược. CSKH !
        </div>
      </div>
    </div>
  )
}

export default Marquee
