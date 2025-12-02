import { getFromsessionstorage, getFromlocalstorage } from '../../component/MaHoaDuLieu'

const CheckCrypto = async (navigate, setMethod) => {
  const data = JSON.parse(getFromsessionstorage('data_u')) || JSON.parse(getFromlocalstorage('data_u'))
  const apiUrl = process.env.REACT_APP_API_URL

  try {
    const response = await fetch(
      `${apiUrl}/kiemtramkbankcrypto/${data._id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: data._id })
      }
    )

    const result = await response.json()

    if (result.crypto) {
      navigate('/member/security/security-bep')
    } else if (response.ok && result.success === 'thành công') {
      setMethod('usdt')
    }
  } catch (error) {
    console.error('Lỗi API kiểm tra tài khoản:', error)
  }
}

export default CheckCrypto
