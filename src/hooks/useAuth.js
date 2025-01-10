import React, { useContext } from 'react'
import { AuthContext } from '../context'

const useAuth = () => {
  const { token, setToken, systemRoles, setSystemRoles } = useContext(AuthContext)

  const login = (toke, roles) => {
    setToken(toke)
    setSystemRoles(roles)
  }

  const logout = () => {
    setToken(null)
    setSystemRoles([])
  }

  return { token, systemRoles, login, logout }
}

export default useAuth
