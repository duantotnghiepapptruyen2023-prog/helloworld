import './ListGameMobile.scss'

function ListGameMobile ({ children }) {
  return (
    <div className='home_lobby_content pull-to-box'>
      <div className='pull-to pull-bottom'>
        <div className='home_lobby_box home_games_box'>{children}</div>
      </div>
    </div>
  )
}

export default ListGameMobile
