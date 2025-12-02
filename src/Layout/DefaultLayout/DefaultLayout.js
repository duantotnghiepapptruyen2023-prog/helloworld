import { Header } from './Header'
import { Footer } from './Footer'
import './DefaultLayout.scss'
import { useLocation } from 'react-router-dom'

function DefaultLayout ({ children }) {
  const location = useLocation()

  const hiddenHeaderRoutes = [
    '/khuyenmai',
    '/cskh',
    '/daily',
    '/member',
    '/deposit',
    '/transactionhistory',
    '/member/bettinghistory',
    '/game/detailmatch',
    '/member/security-bank',
    '/agent',
    '/qr-nap-tien',
    '/usdt-nap-tien'
  ]
  const hiddenFooterRoutes = [
    '/member/bettinghistory',
    '/member/withdraw',
    '/member/setting',
    '/member/deposit',
    '/member/security-bank',
    '/member/security',
    '/agent',
    '/qr-nap-tien',
    '/usdt-nap-tien',
    '/member/transactionhistory'
  ]
  // Kiểm tra nếu đường dẫn hiện tại có trong danh sách
  const shouldHideHeader = hiddenHeaderRoutes.some(route =>
    location.pathname.includes(route)
  )
  const shouldHideFooter = hiddenFooterRoutes.some(route =>
    location.pathname.includes(route)
  )

  return (
    <div className='default-layout'>
      {!shouldHideHeader && <Header />}
      {children}
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default DefaultLayout
