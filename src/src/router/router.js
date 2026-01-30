import { TrangChuLayout } from '../Layout/TrangChuLayout'
import { DangKyDangNhap } from '../Layout/DangKyDangNhap'
import { TransactionHistory } from '../Layout/TransactionHistory'
import { KhuyenMaiLayout } from '../Layout/KhuyenMaiLayout'
import { Bettinghistory } from '../Layout/BettingHistory'
import { CSKHLayout } from '../Layout/CSKHLayout'
import { BangXepHang } from '../Layout/BangXepHang'
import { QuenMatkhau } from '../Layout/QuenMatkhau'
import { QuenMatKhauRutTien } from '../Layout/QuenMatKhauRutTien'
import DownloadApp from '../Layout/TaiXuong/TaiXuong'
import KhuyenMaiDetail from '../Layout/KhuyenMaiLayout/KhuyenMaiDetail/KhuyenMaiDetail'
import PhanTySoScreen from '../Layout/PhanTySoScreen/PhanTySoScreen'
import DepositPage from '../Layout/DepositPage/DepositPage'
import TaiKhoanLayout from '../Layout/TaiKhoanLayout/TaiKhoanLayout'
import QrNapTien from '../Layout/DepositPage/QuetQr/QrNapTien'
import QuetUsdt from '../Layout/DepositPage/QuetUsdt/QuetUsdt'
import DaiLyLayout from '../Layout/DaiLyLayout/DaiLyLayout'
import TrucThuoc from '../Layout/DaiLyLayout/TrucThuoc/TrucThuoc'
import Team from '../Layout/DaiLyLayout/Team/Team'
import HoaHong from '../Layout/DaiLyLayout/HoaHong/HoaHong'
import MatchDetails from '../Layout/MatchDetails/MatchDetails'
import Setting from '../Layout/TaiKhoanLayout/Setting/Setting'
import AboutMe from '../Layout/TaiKhoanLayout/Setting/VeChungToi/VeChungToi'
import ChinhSach from '../Layout/TaiKhoanLayout/Setting/ChinhSach/ChinhSach'
import TroGiup from '../Layout/TaiKhoanLayout/Setting/TroGiup/TroGiup'
import BankInfoUpdate from '../Layout/TaiKhoanLayout/BankInfoUpdate/BankInfoUpdate'
import SecurityAccount from '../Layout/TaiKhoanLayout/SecurityAccount/SecurityAccount'
import UpdatePhone from '../Layout/TaiKhoanLayout/SecurityAccount/UpdatePhone/UpdatePhone'
import UpdateVi from '../Layout/TaiKhoanLayout/SecurityAccount/UpdateVi/UpdateVi'
import UpdatePass from '../Layout/TaiKhoanLayout/SecurityAccount/UpdatePass/UpdatePass'
import UpdatePassMoney from '../Layout/TaiKhoanLayout/SecurityAccount/UpdatePassMoney/UpdatePassMoney'
import WithDraw from '../Layout/WithDraw/WithDraw'
import DanhSachGame from '../component/DanhSachGame/DanhSachGame'

const publicRoutes = [
  { path: '/', component: TrangChuLayout },
  { path: '/phantyso', component: PhanTySoScreen },
  { path: '/login', component: DangKyDangNhap },
  {
    path: '/member/deposit',
    component: DepositPage
  },
  {
    path: '/member/withdraw',
    component: WithDraw
  },
  {
    path: '/member',
    component: TaiKhoanLayout
  },
  {
    path: '/qr-nap-tien/:amount',
    component: QrNapTien
  },
  {
    path: '/usdt-nap-tien/:amount',
    component: QuetUsdt
  },
  {
    path: '/daily',
    component: DaiLyLayout
  },
  {
    path: 'agent/direct',
    component: TrucThuoc
  },
  {
    path: 'agent/team',
    component: Team
  },
  {
    path: 'agent/bonus-direct',
    component: HoaHong
  },
  {
    path: '/game/detailmatch/:gameID',
    component: MatchDetails
  },

  {
    path: '/member/setting',
    component: Setting
  },
  {
    path: '/member/setting/aboutme',
    component: AboutMe
  },
  {
    path: '/member/setting/policy',
    component: ChinhSach
  },
  {
    path: '/member/setting/help',
    component: TroGiup
  },
  {
    path: '/member/security-bank',
    component: BankInfoUpdate
  },
  {
    path: '/member/security',
    component: SecurityAccount
  },
  {
    path: '/member/security/security-phone',
    component: UpdatePhone
  },
  {
    path: '/member/security/security-bep',
    component: UpdateVi
  },
  {
    path: '/member/security/security-pass',
    component: UpdatePass
  },
  {
    path: '/member/security/security-password-withdrawal',
    component: UpdatePassMoney
  },
  {
    path: '/member/transactionhistory',
    component: TransactionHistory
  },
  {
    path: '/khuyenmai',
    component: KhuyenMaiLayout
  },
  {
    path: '/khuyenmai/:id',
    component: KhuyenMaiDetail
  },
  {
    path: '/member/bettinghistory',
    component: Bettinghistory
  },
  {
    path: '/cskh',
    component: CSKHLayout
  },
  {
    path: '/bangxephang',
    component: BangXepHang
  },
  {
    path: '/quenmatkhau',
    component: QuenMatkhau
  }
  ,
  {
    path: '/quemkruttien',
    component: QuenMatKhauRutTien
  },
  {
    path: '/download',
    component: DownloadApp
  },
  {
    path: '/game_list_mobile',
    component: DanhSachGame
  }
]
const privateRoutes = []
export { publicRoutes, privateRoutes }
