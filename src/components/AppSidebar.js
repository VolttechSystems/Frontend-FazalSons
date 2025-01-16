import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
import _nav from '../_nav'
import useAuth from '../hooks/useAuth'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { systemRoles } = useAuth()
  // const { useroutlets } = useAuth()
  // console.log({ systemRoles })
  // console.log({ useroutlets })

  // Function to filter navigation items based on permissions
  const filterNavItems = (navItems) => {
    const permissions = systemRoles.length > 0 ? systemRoles[0].permissions : []
    // const userOutlets = useroutlets.map((outlet) => outlet.outlet_name) // Get an array of outlet names for comparison

    return navItems.filter((item) => {
      if (permissions.some((permission) => permission.permission_name === item.key)) {
        return true
      }
      return false
    })
  }

  const filteredNav = useMemo(() => {
    return filterNavItems(navigation)
  }, [systemRoles])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      {/* <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      
    </CSidebarHeader> */}

      <CSidebarHeader className="border-bottom">
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand to="/" style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
            <span
              className="sidebar-brand-full"
              style={{
                fontFamily: "'Times New Roman', serif",
                fontSize: '1.9rem',
                color: '#ffffff',
                fontWeight: 'bold',
                marginLeft: '10px',
                textDecoration: 'none !important', // Remove underline
              }}
            >
              Fazal Sons
            </span>
            <span
              className="sidebar-brand-narrow"
              style={{
                fontFamily: "'Times New Roman', serif", // Ensure the same font for consistency
                fontSize: '1.2rem',
                color: '#ffffff',
                fontWeight: '600',
                marginLeft: '5px',
                textDecoration: 'none !important', // Remove underline
              }}
            >
              FS
            </span>
          </CSidebarBrand>
        </CSidebarHeader>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={filteredNav} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
