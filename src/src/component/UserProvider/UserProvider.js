// src/contexts/UserContext.js
import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext()

const apiUrl = process.env.REACT_APP_API_URL

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const fetchUser = async id => {
    try {
      const response = await fetch(`${apiUrl}/getchitietuser/${id}`)
      const data = await response.json()
      if (response.ok) {
        setUser(data)
      }
    } catch (error) {
      console.error('Lỗi fetch user:', error)
    }
  }

  return (
    <UserContext.Provider value={{ user, fetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
