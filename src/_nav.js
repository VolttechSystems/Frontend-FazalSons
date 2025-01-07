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
      // {
      //   component: CNavItem,
      //   name: 'Login',
      //   to: '/pages/Login',
      // },
      
     
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
        name: 'System Roles',
        to: '/Admin/SysRoles',
      },
      {
        component: CNavItem,
        name: 'Register User',
        to: '/Admin/RegisterUser',
      },
      {
        component: CNavItem,
        name: 'Outlet',
        to: '/Admin/AddOutlet',
      },
      {
        component: CNavItem,
        name: 'Additional Fee',
        to: '/Admin/AdditionalFee',
      },
      {
        component: CNavItem,
        name: 'Payment Methods',
        to: '/Admin/Payment',
      },
      
     
    ],
  },

  //Reports
  {
    component: CNavGroup,
    name: 'Reports',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Profit Sale Report',
        to: '/Reports/ProfitReport',
        
      },
      {
        component: CNavItem,
        name: 'Sales Commission Report',
        to: '/Reports/CommissionReport',
      },
      {
        component: CNavItem,
        name: 'Sales Report',
        to: '/Reports/SaleReport',
      },
      {
        component: CNavItem,
        name: 'Sale by Day Report',
        to: '/Reports/DaySale',
      },
      {
        component: CNavItem,
        name: 'Product wise Sale Report',
        to: '/Reports/ProductReport',
      },
      {
        component: CNavItem,
        name: 'Payment Method Report',
        to: '/Reports/PaymentReport',
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
    name: 'Product',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Product',
        to: 'base/POSTable2',
        
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
        name: 'Add Category',
        to: '/Product/Category',
      },
      {
        component: CNavItem,
        name: 'Add Sub-Category',
        to: '/Product/SubCategory',
      },
      {
        component: CNavItem,
        name: 'Brands',
        to: '/Product/Brands',
      },
      
      // {
      //   component: CNavItem,
      //   name: 'Attributes',
      //   to: '/Product/Attributes',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Variations',
      //   to: '/Product/Variations',
      // },
      {
        component: CNavItem,
        name: 'Add Attribute',
        to: '/Product/AddAtt',
      },
      
    ],
  },
  // {
  //   component: CNavGroup,
  //   name: 'Stock',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Add Stock',
  //       to: '/Stock/AddStock',
  //     },
      
  //   ],
  // },
  
  
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
