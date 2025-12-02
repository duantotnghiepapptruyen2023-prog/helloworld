/* eslint-disable no-mixed-operators */
import { getFromsessionstorage,getFromlocalstorage } from '../../component/MaHoaDuLieu'

const CheckRutTien = async navigate => {
  const data = JSON.parse(getFromsessionstorage('data_u')) || JSON.parse(getFromlocalstorage('data_u'))
  const apiUrl = process.env.REACT_APP_API_URL;

  try {
    const response = await fetch(
      `${apiUrl}/kiemtramkbank/${data._id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: data._id })
      }
    )

    const result = await response.json()

    if (response.status === 400) {
      if (result.tknh === 'Bạn chưa cập nhật tài khoản ngân hàng') {
        navigate('/member/security-bank')
      } else if (result.mkrt === 'Bạn chưa cập nhật mật khẩu rút tiền') {
        navigate('/member/security/security-password-withdrawal')
      }
    } else if (
      response.ok &&
      (result.success === 'thành công' ||
        result.crypto === 'Bạn chưa cập nhật ví crypto')
    ) {
      navigate('/member/withdraw')
    } else {
      console.error('Phản hồi API không hợp lệ:', result)
    }
  } catch (error) {
    console.error('Lỗi API kiểm tra tài khoản:', error)
  }
}

export default CheckRutTien
