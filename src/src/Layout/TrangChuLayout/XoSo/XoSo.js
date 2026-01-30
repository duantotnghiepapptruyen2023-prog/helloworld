import { ListGameMobile } from '../../../component/ListGameMobile'
import { useNavigate } from 'react-router-dom'

function XoSo () {
  const navigate = useNavigate()

  const data_b = sessionStorage.getItem('data_u')

  const data = [
    {
      logo: '/mobile/xoso/logotc.png',
      img: '/mobile/xoso/anhtc.png',
      first: 'lifirst',
      classimage: 'anh_item_first',
      firm_logo: 'firm_logo2',
      name: 'TC'
    }
  ]

  return (
    <>
      <ListGameMobile>
        <ul className='ulthethao'>
          {data.map((item, index) => (
            <li
              className={`thethao_item ${item.first}`}
              key={index}
              style={{ background: 'url(/mobile/xoso/backxoso.png)' }}
              onClick={() => {
                if (!data_b) {
                  navigate('/login')
                } else {
                  navigate(`/game_list_mobile?tab=${item.name}&game=xoso`)
                }
              }}
            >
              <div className='gameitem'>
                <div className={`firm_logo ${item.firm_logo}`}>
                  <i>
                    <img src={item.logo} alt='' />
                  </i>
                </div>
                <div
                  style={{ backgroundImage: `url(${item.img})` }}
                  className={`anhgame ${item.classimage}`}
                ></div>
                <div className='gametag'></div>
              </div>
            </li>
          ))}
        </ul>
      </ListGameMobile>
    </>
  )
}

export default XoSo
