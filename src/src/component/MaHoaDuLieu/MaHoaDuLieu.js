import CryptoJS from 'crypto-js'

const secretKey = 'my-secret-key'

const encryptData = data => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
}

export const saveTosessionstorage = (key, data) => {
  const encryptedData = encryptData(data)
  sessionStorage.setItem(key, encryptedData)
}

const decryptData = encryptedData => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export const getFromsessionstorage = key => {
  const encryptedData = sessionStorage.getItem(key)
  if (!encryptedData) return null

  try {
    return decryptData(encryptedData)
  } catch (error) {
    console.error('Error decrypting data:', error)
    return null
  }
}

export const saveTolocalstorage = (key, data) => {
  const encryptedData = encryptData(data)
  localStorage.setItem(key, encryptedData)
}

export const getFromlocalstorage = key => {
  const encryptedData = localStorage.getItem(key)
  if (!encryptedData) return null

  try {
    return decryptData(encryptedData)
  } catch (error) {
    console.error('Error decrypting data:', error)
    return null
  }
}
