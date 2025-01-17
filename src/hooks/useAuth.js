import React, { useContext } from 'react'
import { AuthContext } from '../context'

const useAuth = () => {
  const { token, setToken, systemRoles, setSystemRoles, userOutlets, setuserOutlets } =
    useContext(AuthContext)

  const login = (toke, roles, outlets) => {
    setToken(toke)
    setSystemRoles(roles)
    setuserOutlets(outlets)
  }

  const logout = () => {
    setToken(null)
    setSystemRoles([])
    setuserOutlets([])
    localStorage.clear() // Clear localStorage on logout
  }

  return { token, systemRoles, userOutlets, login, logout }
}

export default useAuth
