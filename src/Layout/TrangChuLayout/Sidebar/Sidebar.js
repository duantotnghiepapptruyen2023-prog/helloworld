import './Sidebar.scss'

function Sidebar ({ tab, settab }) {
  const data = [
    {
      name: 'Phản Tỷ Số',
      icon: 'nav_icons_hot'
    },
    {
      name: 'Casino',
      icon: 'nav_icons_live'
    },
    {
      name: 'Thể Thao',
      icon: 'nav_icons_thethao'
    },
    {
      name: 'Slot',
      icon: 'nav_icons_xoso'
    },
    {
      name: 'Lô đề',
      icon: 'nav_icons_nohu'
    },
    {
      name: 'Đá Gà',
      icon: 'nav_icons_daga'
    }
  ]
  return (
    <div className='home_globby_nav'>
      <div className='gallery not-sticky hide-scrollbar scrollY'>
        {data.map((item, index) => (
          <div
            className={`navs_slider  slider_sidebar ${
              tab === item.name ? 'tab_act' : ''
            }`}
            onClick={() => settab(item.name)}
            key={index}
          >
            <i className={`nav_icon_sidebar games_sidebar ${item.icon}`}></i>
            <div className='nav_icon_shadow'></div>
            <span className='nav_name_sidebar'>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
