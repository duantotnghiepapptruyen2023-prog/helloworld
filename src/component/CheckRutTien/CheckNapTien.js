import { getFromsessionstorage,getFromlocalstorage } from '../../component/MaHoaDuLieu'

const CheckNapTien = async navigate => {
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
      if (result.tknh === 'คุณยังไม่ได้อัปเดตข้อมูลบัญชีธนาคารของคุณ') {
        navigate('/member/security-bank')
      } else if (result.mkrt === 'คุณยังไม่ได้อัปเดตรหัสผ่านสำหรับการถอนเงิน') {
        navigate('/member/security/security-password-withdrawal')
      }
    } else if (
      response.ok &&
      (result.success === 'ความสำเร็จ' ||
        result.crypto === 'คุณยังไม่ได้อัปเดตกระเป๋าเงินดิจิทัลของเว็บไซต์')
    ) {
      navigate('/member/deposit')
    } else {
      console.error('การตอบสนอง API ไม่ถูกต้อง:', result)
    }
  } catch (error) {
    console.error('Lỗi API kiểm tra tài khoản:', error)
  }
}

export default CheckNapTien
