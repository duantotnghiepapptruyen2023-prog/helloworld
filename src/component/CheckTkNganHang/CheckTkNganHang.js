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
      if (result.tknh === 'คุณยังไม่ได้อัปเดตข้อมูลบัญชีธนาคารของคุณ') {
        return { success: false, redirect: '/member/security-bank' }
      } else if (result.mkrt === 'คุณยังไม่ได้อัปเดตรหัสผ่านสำหรับการถอนเงิน') {
        return {
          success: false,
          redirect: '/member/security/security-password-withdrawal'
        }
      }
    } else if (response.ok && result.success === 'ความสำเร็จ') {
      return { success: true }
    }

    return { success: false, message: 'การตอบสนอง API ไม่ถูกต้อง' }
  } catch (error) {
    return { success: false, message: 'การตอบสนอง API ไม่ถูกต้อง' }
  }
}

export default CheckRutTien
  