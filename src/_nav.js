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
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  // {
  //   component: CNavTitle,
  //   name: 'Components',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
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
      //   name: 'Cards',
      //   to: '/base/cards',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Carousel',
      //   to: '/base/carousels',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Collapse',
      //   to: '/base/collapses',
      // },
      // {
      //   component: CNavItem,
      //   name: 'List group',
      //   to: '/base/list-groups',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Navs & Tabs',
      //   to: '/base/navs',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Pagination',
      //   to: '/base/paginations',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Placeholders',
      //   to: '/base/placeholders',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Popovers',
      //   to: '/base/popovers',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Progress',
      //   to: '/base/progress',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Spinners',
      //   to: '/base/spinners',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tables',
      //   to: '/base/tables',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tabs',
      //   to: '/base/tabs',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tooltips',
      //   to: '/base/tooltips',
      // },
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
    name: 'Customers',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Customer',
        to: '/forms/form-control',
      },
      // {
      //   component: CNavItem,
      //   name: 'Select',
      //   to: '/forms/select',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Checks & Radios',
      //   to: '/forms/checks-radios',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Range',
      //   to: '/forms/range',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Input Group',
      //   to: '/forms/input-group',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Floating Labels',
      //   to: '/forms/floating-labels',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Layout',
      //   to: '/forms/layout',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Validation',
      //   to: '/forms/validation',
      // },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  {
    component: CNavGroup,
    name: 'Product',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Product',
        to: '/Product/AllProducts',
        // badge: {
        //   color: 'success',
        //   text: 'NEW',
        // },
      },
      {
        component: CNavItem,
        name: 'Add Product',
        to: '/icons/flags',
      },
      {
        component: CNavItem,
        name: 'Parent Category',
        to: '/Product/ParentCategory',
      },
      {
        component: CNavItem,
        name: 'Categories',
        to: '/Product/Categories',
      },
      {
        component: CNavItem,
        name: 'Sub-Categories',
        to: '/icons/brands',
      },
      {
        component: CNavItem,
        name: 'Brands',
        to: '/Product/Brands',
      },
      // {
      //   component: CNavItem,
      //   name: 'AddBrands',
      //   to: '/Product/AddBrands',
      // },
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
        to: '/notifications/alerts',
      },
      // {
      //   component: CNavItem,
      //   name: 'Badges',
      //   to: '/notifications/badges',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Modal',
      //   to: '/notifications/modals',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Toasts',
      //   to: '/notifications/toasts',
      // },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
