import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    // key:"doashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'Point of Sale',
    to: '/base',
    key: 'Transaction',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'POS',
        to: '/base/POS',
        key: 'Transaction', // Permission key for this item
      },
      {
        component: CNavItem,
        name: 'Salesman',
        to: '/Admin/Salesman',
        key: 'Admin',
      },
      {
        component: CNavItem,
        name: 'Additional Fee',
        to: '/Admin/AdditionalFee',
        key: 'Admin',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Super Admin',
    key: 'SuperAdmin',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Shops',
        to: '/SuperAdmin/Shops',
        key: 'SuperAdmin',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Admin',
    key: 'Admin',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'System Roles',
        to: '/Admin/SysRoles',
        key: 'Admin',
      },
      {
        component: CNavItem,
        name: 'Register User',
        to: '/Admin/RegisterUser',
        key: 'Admin',
      },
      {
        component: CNavItem,
        name: 'Outlet',
        to: '/Admin/AddOutlet',
        key: 'Admin',
      },

      {
        component: CNavItem,
        name: 'Payment Methods',
        to: '/Admin/Payment',
        key: 'Admin',
      },
    ],
  },

  //Reports
  {
    component: CNavGroup,
    name: 'Reports',
    key: 'Reports',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Profit Sale Report',
        to: '/Reports/ProfitReport',
        key: 'Reports',
      },
      {
        component: CNavItem,
        name: 'Sales Commission Report',
        to: '/Reports/CommissionReport',
        key: 'Reports',
      },
      {
        component: CNavItem,
        name: 'Sales Report',
        to: '/Reports/SaleReport',
        key: 'Reports',
      },
      {
        component: CNavItem,
        name: 'Sale by Day Report',
        to: '/Reports/DaySale',
        key: 'Reports',
      },
      {
        component: CNavItem,
        name: 'Product wise Sale Report',
        to: '/Reports/ProductReport',
        key: 'Reports',
      },
      {
        component: CNavItem,
        name: 'Payment Method Report',
        to: '/Reports/PaymentReport',
        key: 'Reports',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Customer',
    key: 'Customer',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Customer',
        to: '/Customer/AddCustomer',
        key: 'Customer',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Stock',
    key: 'stock',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Stock',
        to: '/Stock/AddStock',
        key: 'stock',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Product',
    key: 'product',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Product',
        to: 'base/POSTable2',
        key: 'product',
      },
      {
        component: CNavItem,
        name: 'Add Product',
        to: '/Product/AddProduct',
        key: 'product',
      },
      {
        component: CNavItem,
        name: 'Parent Category',
        to: '/Product/ParentCategory',
        key: 'product',
      },
      {
        component: CNavItem,
        name: 'Add Category',
        to: '/Product/Category',
        key: 'product',
      },
      {
        component: CNavItem,
        name: 'Add Sub-Category',
        to: '/Product/SubCategory',
        key: 'product',
      },
      {
        component: CNavItem,
        name: 'Brands',
        to: '/Product/Brands',
        key: 'product',
      },

      {
        component: CNavItem,
        name: 'Add Attribute',
        to: '/Product/AddAtt',
        key: 'product',
      },
    ],
  },
]

export default _nav
