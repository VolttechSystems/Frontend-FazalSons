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
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'POS',
        to: '/base/POS',
      },
      {
        component: CNavItem,
        name: 'Register Systems',
        to: '/base/RegisterSystem',
      },
      
     
    ],
  },
  {
    component: CNavGroup,
    name: 'Admin',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Salesman',
        to: '/Admin/Salesman',
      },
      {
        component: CNavItem,
        name: 'Outlet',
        to: '/Admin/AddOutlet',
      },
      
     
    ],
  },
  {
    component: CNavGroup,
    name: 'Reports',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Profit Report',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Sales Commission Report',
        to: '/buttons/button-groups',
      },
      {
        component: CNavItem,
        name: 'Sales Report',
        to: '/buttons/dropdowns',
      },
      {
        component: CNavItem,
        name: 'Sale by Day',
        to: '/buttons/dropdowns',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Customer',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Add Customer',
        to: '/Customer/AddCustomer',
      },
     
    ],
  },
  
  {
    component: CNavGroup,
    name: 'Product',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Product',
        to: '/Product/AllProducts',
        
      },
      {
        component: CNavItem,
        name: 'Add Product',
        to: '/Product/AddProduct',
      },
      {
        component: CNavItem,
        name: 'Parent Category',
        to: '/Product/ParentCategory',
      },
      {
        component: CNavItem,
        name: 'Category',
        to: '/Product/Category',
      },
      {
        component: CNavItem,
        name: 'Sub-Categories',
        to: '/Product/SubCategory',
      },
      {
        component: CNavItem,
        name: 'Brands',
        to: '/Product/Brands',
      },
      
      {
        component: CNavItem,
        name: 'Attributes',
        to: '/Product/Attributes',
      },
      {
        component: CNavItem,
        name: 'Variations',
        to: '/Product/Variations',
      },
      {
        component: CNavItem,
        name: 'Add Attribute',
        to: '/Product/AddAtt',
      },
      
    ],
  },
  {
    component: CNavGroup,
    name: 'Stock',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Stock',
        to: '/Stock/AddStock',
      },
      
    ],
  },
  {
    component: CNavGroup,
    name: 'Category',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Category',
        to: '/Category/AddCategories',
      },
      
    ],
  },

  
  
//   {
//     component: CNavTitle,
//     name: 'Extras',
//   },
//   {
//     component: CNavGroup,
//     name: 'Pages',
//     icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Login',
//         to: '/login',
//       },
//       {
//         component: CNavItem,
//         name: 'Register',
//         to: '/register',
//       },
//       {
//         component: CNavItem,
//         name: 'Error 404',
//         to: '/404',
//       },
//       {
//         component: CNavItem,
//         name: 'Error 500',
//         to: '/500',
//       },
//     ],
//   },
  
]

export default _nav
