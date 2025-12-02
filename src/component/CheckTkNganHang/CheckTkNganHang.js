const CheckRutTien = async userId => {
  const apiUrl = process.env.REACT_APP_API_URL

  try {
    const response = await fetch(`${apiUrl}/kiemtramkbank/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    })

    const result = await response.json()

    if (response.status === 400) {
      if (result.tknh === 'Bạn chưa cập nhật tài khoản ngân hàng') {
        return { success: false, redirect: '/member/security-bank' }
      } else if (result.mkrt === 'Bạn chưa cập nhật mật khẩu rút tiền') {
        return {
          success: false,
          redirect: '/member/security/security-password-withdrawal'
        }
      }
    } else if (response.ok && result.success === 'thành công') {
      return { success: true }
    }

    return { success: false, message: 'Phản hồi không hợp lệ' }
  } catch (error) {
    return { success: false, message: 'Lỗi kết nối server' }
  }
}

export default CheckRutTien
  