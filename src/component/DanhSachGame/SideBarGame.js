import './Sidebar.scss'
import { useNavigate } from 'react-router-dom'

function Sidebar ({ tab, data, gamefromurl, settab }) {
  const navigate = useNavigate()
  return (
    <div className='home_globby_nav'>
      <div className='nav_mask'></div>
      <div className='gallery not-sticky hide-scrollbar scrollY'>
        {data.map((item, index) => (
          <div
            className={`navs_slider  slider_sidebar ${
              tab === item.name ? 'active-tab' : ''
            } bgr${item.name} nomgtop`}
            onClick={() => {
              settab(item.name)
              navigate(`/game_list_mobile?tab=${item.name}&game=${gamefromurl}`)
            }}
            key={index}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
