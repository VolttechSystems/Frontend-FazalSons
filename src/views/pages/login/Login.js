
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardGroup,
//   CCol,
//   CContainer,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilLockLocked, cilUser } from '@coreui/icons';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     // Validate fields
//     if (!username || !password) {
//       setError('Please enter both username and password');
//       return;
//     }
//     try {
//       const response = await axios.post('http://195.26.253.123/pos/accounts/login', {
//         username,
//         password,
//       });
//       console.log(response.data); // Handle success (e.g., save token, redirect user)
//       // alert('Login successful!');
//       // Redirect or perform other actions here
//        // Check for success and store token
//        if (response.data.token) {
//         localStorage.setItem('authToken', response.data.token); // Save token
//         alert('Login successful!');
//         navigate('/dashboard/'); // Redirect to dashboard
//       } else {
//         setError('Unexpected response from the server');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Invalid username or password');
//     }
//   };

//   return (
//     <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={8}>
//             <CCardGroup>
//               <CCard className="p-4">
//                 <CCardBody>
//                   <CForm>
//                     <h1>Login</h1>
//                     <p className="text-body-secondary">Sign In to your account</p>
//                     {error && <p className="text-danger">{error}</p>}
//                     <CInputGroup className="mb-3">
//                       <CInputGroupText>
//                         <CIcon icon={cilUser} />
//                       </CInputGroupText>
//                       <CFormInput
//                         placeholder="Username"
//                         autoComplete="username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                       />
//                     </CInputGroup>
//                     <CInputGroup className="mb-4">
//                       <CInputGroupText>
//                         <CIcon icon={cilLockLocked} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="password"
//                         placeholder="Password"
//                         autoComplete="current-password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                       />
//                     </CInputGroup>
//                     <CRow>
//                       <CCol xs={6}>
//                         <CButton color="primary" className="px-4" onClick={handleLogin}>
//                           Login
//                         </CButton>
//                       </CCol>
//                       <CCol xs={6} className="text-right">
//                         <CButton color="link" className="px-0">
//                           Forgot password?
//                         </CButton>
//                       </CCol>
//                     </CRow>
//                   </CForm>
//                 </CCardBody>
//               </CCard>
//               <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
//                 <CCardBody className="text-center">
//                   <div>
//                     <h2>Sign up</h2>
//                     <p>Create your account to access more features.</p>
//                     <Link to="/register">
//                       <CButton color="primary" className="mt-3" active tabIndex={-1}>
//                         Register Now!
//                       </CButton>
//                     </Link>
//                   </div>
//                 </CCardBody>
//               </CCard>
//             </CCardGroup>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    try {
      const response = await axios.post('http://195.26.253.123/pos/accounts/login', {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        alert('Login successful!');
        navigate('/dashboard/');
      } else {
        setError('Unexpected response from the server');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

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
                    <h1 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#1c5b8b' }}>
                      Fazal Sons
                    </h1>
                    <p className="text-muted">Your trusted partner in POS solutions</p>
                  </div>
                  <CForm>
                    <h2 className="text-center">Login</h2>
                    <p className="text-body-secondary text-center">Sign in to access your account</p>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
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
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-primary"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
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
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Create your account to access more features.</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
