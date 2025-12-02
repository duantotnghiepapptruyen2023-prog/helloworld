import { ListGameMobile } from '../../../component/ListGameMobile'
import { useNavigate } from 'react-router-dom'

function NoHu () {
  const navigate = useNavigate()

  const data_b = sessionStorage.getItem('data_u')

  const data = [
    {
      logo: '/mobile/nohu/logopg.png',
      img: '/mobile/nohu/anhpg.webp',
      first: 'lifirst',
      classimage: 'anh_item_first',
      firm_logo: 'firm_logo2',
      name: 'PG'
    },
    {
      logo: '/mobile/nohu/logojili.png',
      img: '/mobile/nohu/anhjili.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'JILI'
    },
    {
      logo: '/mobile/nohu/logocq9.png',
      img: '/mobile/nohu/anhcq9.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'CQ9'
    },
    {
      logo: '/mobile/nohu/logomw.png',
      img: '/mobile/nohu/anhmw.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'MW'
    },
    {
      logo: '/mobile/nohu/logons.png',
      img: '/mobile/nohu/anhns.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'NS'
    },
    {
      logo: '/mobile/nohu/logofc.png',
      img: '/mobile/nohu/anhfc.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'FC'
    },
    {
      logo: '/mobile/nohu/logopp.png',
      img: '/mobile/nohu/anhpp.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'PP'
    },
    {
      logo: '/mobile/nohu/logojdb.png',
      img: '/mobile/nohu/anhjdb.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'JDB'
    },
    {
      logo: '/mobile/nohu/logosmg.png',
      img: '/mobile/nohu/anhsmg.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'MG'
    },

    {
      logo: '/mobile/nohu/logofs.png',
      img: '/mobile/nohu/anhfs.webp',
      first: '',
      classimage: '',
      firm_logo: 'FS'
    },
    {
      logo: '/mobile/nohu/logops.png',
      img: '/mobile/nohu/anhps.webp',
      first: '',
      classimage: '',
      firm_logo: 'PS'
    },
    {
      logo: '/mobile/nohu/logoyb.png',
      img: '/mobile/nohu/anhyb.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'YB'
    },
    {
      logo: '/mobile/nohu/logova.png',
      img: '/mobile/nohu/anhva.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'VA'
    },
    {
      logo: '/mobile/nohu/logoslots.png',
      img: '/mobile/nohu/anhslots.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'PA'
    },
    {
      logo: '/mobile/nohu/logohb.png',
      img: '/mobile/nohu/anhhb.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'HB'
    },
    {
      logo: '/mobile/nohu/logoap.png',
      img: '/mobile/nohu/anhap.webp',
      first: '',
      classimage: '',
      firm_logo: '',
      name: 'AP'
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
              style={{ background: 'url(/mobile/nohu/backnohu.png)' }}
              onClick={() => {
                if (!data_b) {
                  navigate('/login')
                } else {
                  navigate(`/game_list_mobile?tab=${item.name}&game=nohu`)
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

export default NoHu
