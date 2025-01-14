import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './login.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { Network, Urls } from '../../../api-config'
import useAuth from '../../../hooks/useAuth'
import 'font-awesome/css/font-awesome.min.css' // Import Font Awesome CSS

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false) // State for toggling password visibility

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    const response = await Network.post(Urls.login, {
      username,
      password,
    })

    if (!response.ok) return setError(response.data.error)

    const { token, System_role } = response.data

    localStorage.setItem('authToken', token)
    const sysRoles = JSON.stringify(response.data.System_role || [])

    login(token, System_role)

    // Store in localStorage
    localStorage.setItem('SysRoles', sysRoles)
    navigate('/dashboard/')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword) // Toggle the visibility of the password
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: '#f4f4f4', // Set a light gray background
        backgroundImage: 'url(/path-to-your-image.jpg)', // Optional: background image
        backgroundSize: 'cover', // Make sure the background image covers the full area
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 shadow-lg rounded">
                <CCardBody>
                  {/* Add Fazal Sons branding */}
                  <div className="text-center mb-3">
                    <h1
                      style={{
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: 'bold',
                        color: '#1c5b8b',
                      }}
                    >
                      Fazal Sons
                    </h1>
                    <p className="text-muted">Your trusted partner in POS solutions</p>
                  </div>
                  <CForm>
                    <h2 className="text-center">Login</h2>
                    <p className="text-body-secondary text-center">
                      Sign in to access your account
                    </p>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <i className="fa fa-user" /> {/* Font Awesome User Icon */}
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border-primary" // Custom border color
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <i className="fa fa-lock" /> {/* Font Awesome Lock Icon */}
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'} // Conditionally show password
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-primary"
                      />
                      <CInputGroupText
                        onClick={togglePasswordVisibility}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>{' '}
                        {/* Font Awesome Eye Icon */}
                      </CInputGroupText>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12}>
                        <CButton
                          color="primary"
                          className="px-4 w-100"
                          onClick={handleLogin}
                          style={{
                            backgroundColor: '#1c5b8b',
                            borderColor: '#1c5b8b',
                          }}
                        >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={12} className="text-center mt-3">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
