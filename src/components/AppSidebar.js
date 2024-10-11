import React from 'react'
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

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

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






      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
