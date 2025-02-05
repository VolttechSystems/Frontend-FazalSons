import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AuthGuard from './guards/AuthGuard'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { AuthContext } from './context'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const NewBarcode = React.lazy(() => import('./views/pages/barcode/NewBarcode'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const [token, setToken] = useState(null)
  const [systemRoles, setSystemRoles] = useState([])
  const [userOutlets, setuserOutlets] = useState([])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const sysRoles = localStorage.getItem('SysRoles')
    const outlet_user = localStorage.getItem('outlets')

    if (token) {
      setToken(token)
      setSystemRoles(JSON.parse(sysRoles))
      setuserOutlets(JSON.parse(outlet_user))
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ token, setToken, systemRoles, setSystemRoles, userOutlets, setuserOutlets }}
    >
      <HashRouter>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/barcode:sku" name="barcode" element={<NewBarcode />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
            {/* <Route
              path="*"
              name="Home"
              element={<AuthGuard element={<DefaultLayout />} requiredPermission="Admin" />}
            /> */}
          </Routes>
        </Suspense>
      </HashRouter>
    </AuthContext.Provider>
  )
}

export default App

// import React, { Suspense, useEffect } from 'react';
// import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { CSpinner, useColorModes } from '@coreui/react';
// import './scss/style.scss';

// // Containers
// const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// // Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'));
// const Register = React.lazy(() => import('./views/pages/register/Register'));
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

// // Helper: Check Authentication
// const isAuthenticated = () => {
//   return localStorage.getItem('isAuthenticated') === 'true';
// };

// // Private Route Component
// const PrivateRoute = ({ element: Component }) => {
//   return isAuthenticated() ? Component : <Navigate to="/login" />;
// };

// const App = () => {
//   const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
//   const storedTheme = useSelector((state) => state.theme);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
//     const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
//     if (theme) {
//       setColorMode(theme);
//     }

//     if (isColorModeSet()) {
//       return;
//     }

//     setColorMode(storedTheme);
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   return (
//     <HashRouter>
//       <Suspense
//         fallback={
//           <div className="pt-3 text-center">
//             <CSpinner color="primary" variant="grow" />
//           </div>
//         }
//       >
//         <Routes>
//           <Route path="/login" name="Login Page" element={<Login />} />
//           <Route path="/register" name="Register Page" element={<Register />} />
//           <Route path="/404" name="Page 404" element={<Page404 />} />
//           <Route path="/500" name="Page 500" element={<Page500 />} />
//           <Route
//             path="*"
//             name="Home"
//             element={
//               <PrivateRoute element={<DefaultLayout />} />
//             }
//           />
//         </Routes>
//       </Suspense>
//     </HashRouter>
//   );
// };

// export default App;
