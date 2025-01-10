import React from 'react'
import AuthGuard from './guards/AuthGuard'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const Login = React.lazy(() => import('./views/pages/login/Login'))

//Product

const POS = React.lazy(() => import('./views/base/POS/POSTable'))
const POSTable2 = React.lazy(() => import('./views/base/POSTable2/POSTable2'))
const Salesman = React.lazy(() => import('./views/Admin/Salesman/Salesman'))
const RegisterSystem = React.lazy(() => import('./views/base/RegisterSystem/Register'))
const Transections = React.lazy(() => import('./views/base/Transections/Transections'))
const AllProducts = React.lazy(() => import('./views/Product/AllProducts/AllProducts'))
const ProductEdit = React.lazy(() => import('./views/Product/ProductEdit/ProductEdit'))
const Brands = React.lazy(() => import('./views/Product/Brands/Brands'))
const AddBrands = React.lazy(() => import('./views/Product/AddBrands/AddBrands'))
const AddProduct = React.lazy(() => import('./views/Product/AddProduct/AddProduct'))
const ParentCategory = React.lazy(() => import('./views/Product/ParentCategory/ParentCategory'))
const AddParentCategory = React.lazy(
  () => import('./views/Product/AddParentCategory/AddParentCategory'),
)
const Attributes = React.lazy(() => import('./views/Product/Attributes/Attributes'))
const AddAttributes = React.lazy(() => import('./views/Product/AddAttributes/AddAttributes'))
const AddAttributeType = React.lazy(
  () => import('./views/Product/AddAttributeType/AddAttributeType'),
)
const Variations = React.lazy(() => import('./views/Product/Variations/Variations'))
const AddVariations = React.lazy(() => import('./views/Product/AddVariations/AddVariations'))
const Category = React.lazy(() => import('./views/Product/Category/Category'))
const AddCategory = React.lazy(() => import('./views/Product/AddCategory/AddCategory'))
const SubCategory = React.lazy(() => import('./views/Product/SubCategory/SubCategory'))
const AddSubCategory = React.lazy(() => import('./views/Product/AddSubCategory/AddSubCategory'))
const AddHeadCategory = React.lazy(() => import('./views/Product/AddHeadCategory/AddHeadCategory'))
const AddStock = React.lazy(() => import('./views/Stock/AddStock/AddStock'))
const AddCustomer = React.lazy(() => import('./views/Customer/AddCustomer/AddCustomer'))
const CustomerChannel = React.lazy(() => import('./views/Customer/CustomerChannel/CustomerChannel'))
const CustomerType = React.lazy(() => import('./views/Customer/CustomerType/CustomerType'))
const AddOutlet = React.lazy(() => import('./views/Admin/AddOutlet/AddOutlet'))
const FetchAttributes = React.lazy(() => import('./views/Product/FetchAttributes/FetchAttributes'))
const AddAtt = React.lazy(() => import('./views/Product/AddAtt/AddAtt'))
const AddCategories = React.lazy(() => import('./views/Category/AddCategories/AddCategories'))
const AddSubCat = React.lazy(() => import('./views/SubCat/AddSubCat/AddSubCat'))
const AdditionalFee = React.lazy(() => import('./views/Admin/AdditionalFee/AdditionalFee'))
const Barcodes = React.lazy(() => import('./views/Product/AllProducts/Barcodes'))
const NewBarcode = React.lazy(() => import('./views/pages/barcode/NewBarcode'))
const unauthorized = React.lazy(() => import('./views/pages/unauthorized/unauthorized'))

//Reports
const DaySale = React.lazy(() => import('./views/Reports/DaySale/DaySale'))
const SaleReport = React.lazy(() => import('./views/Reports/SaleReport/SaleReport'))
const ProfitReport = React.lazy(() => import('./views/Reports/ProfitReport/ProfitReport'))
const CommissionReport = React.lazy(
  () => import('./views/Reports/CommissionReport/CommissionReport'),
)
const ProductReport = React.lazy(() => import('./views/Reports/ProductReport/ProductReport'))
const PaymentReport = React.lazy(() => import('./views/Reports/PaymentReport/PaymentReport'))

//System Roles
const SysRoles = React.lazy(() => import('./views/Admin/SysRoles/SysRoles'))
const RegisterUser = React.lazy(() => import('./views/Admin/RegisterUser/RegisterUser'))

//Payment
const Payment = React.lazy(() => import('./views/Admin/Payment/Payment'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/pages/unauthorized', name: 'unauthorized', element: unauthorized },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/pages/Login', name: 'Login', element: Login },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/Product/AllProducts/Barcodes/:sku', name: 'Barcodes', element: Barcodes }, // SKU added here
  { path: '/pages/barcode/NewBarcode/:sku', name: 'NewBarcode', element: NewBarcode }, // SKU added here

  {
    path: '/base/POS',
    name: 'POS',
    element: 'POS',
    element: (props) => <AuthGuard element={POS} requiredPermission="Admin" {...props} />,
  }, // POS
  {
    path: '/base/POSTable2',
    name: 'POSTable2',
    element: 'POSTable2',
    element: (props) => <AuthGuard element={POSTable2} requiredPermission="product" {...props} />,
  }, // POSTable2
  { path: '/base/RegisterSystem', name: 'RegisterSystem', element: RegisterSystem }, // Register
  {
    path: '/Admin/Salesman',
    name: 'Salesman',
    element: 'Salesman',
    element: (props) => <AuthGuard element={Salesman} requiredPermission="Admin" {...props} />,
  }, // Salesman
  {
    path: '/Product/AllProducts/:outletId',
    name: 'AllProducts',
    element: (props) => <AuthGuard element={AllProducts} requiredPermission="product" {...props} />,
  }, //AllProducts
  { path: '/Product/ProductEdit/:id', name: 'ProductEdit', element: ProductEdit }, //ProductEdit
  {
    path: '/Product/Brands',
    name: 'Brands',
    element: 'Brands',
    element: (props) => <AuthGuard element={Brands} requiredPermission="product" {...props} />,
  }, //Brands
  { path: '/Product/AddBrands', name: 'AddBrands', element: AddBrands }, //AddBrands
  {
    path: '/Product/AddProduct',
    name: 'AddProduct',
    element: 'AddProduct',
    element: (props) => <AuthGuard element={AddProduct} requiredPermission="product" {...props} />,
  }, //AddProduct
  { path: '/Product/AddBrands/:id', name: 'EditBrand', element: AddBrands }, // Edit Brand
  {
    path: '/Product/ParentCategory',
    name: 'ParentCategory',
    element: 'ParentCategory',
    element: (props) => (
      <AuthGuard element={ParentCategory} requiredPermission="product" {...props} />
    ),
  }, //ParentCategory
  { path: '/Product/AddParentCategory', name: 'AddParentCategory', element: AddParentCategory }, //AddParentCategory
  {
    path: '/Product/AddParentCategory/:id',
    name: 'EditParentCategory',
    element: AddParentCategory,
  }, // Edit ParentCategory
  { path: '/Product/Attributes', name: 'Attributes', element: Attributes }, //Attributes
  { path: '/Product/AddAttributes', name: 'AddAttributes', element: AddAttributes }, //AddAttributes
  {
    path: '/Product/AddAtt',
    name: 'AddAtt',
    element: 'AddAtt',
    element: (props) => <AuthGuard element={AddAtt} requiredPermission="product" {...props} />,
  }, //AddAtt
  { path: '/Product/AddAttributes/:id', name: 'EditAttributes', element: AddAttributes }, // EditAttributes
  { path: '/Product/Variations', name: 'Variations', element: Variations }, //Variations
  { path: '/Product/AddVariations', name: 'AddVariations', element: AddVariations }, //AddAttributes
  { path: '/Product/AddVariations/:id', name: 'EditVariations', element: AddVariations }, // Edit Variations
  { path: '/Product/AddCategory/:id', name: 'EditCategory', element: AddCategory }, // Edit Category
  { path: '/Product/AddProduct/:id', name: 'EditProduct', element: AddProduct }, // editProduct
  { path: '/Product/AddAttributeType', name: 'AddAttributeType', element: AddAttributeType }, // AddAttributeType
  {
    path: '/Product/Category',
    name: 'Category',
    element: 'Category',
    element: (props) => <AuthGuard element={Category} requiredPermission="product" {...props} />,
  }, //Category
  { path: '/Product/AddCategory', name: 'AddCategory', element: AddCategory }, //AddCategory
  {
    path: '/Product/SubCategory',
    name: 'SubCategory',
    element: 'SubCategory',
    element: (props) => <AuthGuard element={SubCategory} requiredPermission="product" {...props} />,
  }, //SubCategory
  { path: '/Product/AddSubCategory', name: 'AddSubCategory', element: AddSubCategory }, //AddSubCategory
  { path: '/Product/AddHeadCategory', name: 'AddHeadCategory', element: AddHeadCategory }, //AddHeadCategory
  {
    path: '/Stock/AddStock',
    name: 'AddStock',
    element: (props) => <AuthGuard element={AddStock} requiredPermission="stock" {...props} />,
  }, //AddStock
  {
    path: '/Customer/AddCustomer',
    name: 'AddCustomer',
    element: 'AddCustomer',
    element: (props) => (
      <AuthGuard element={AddCustomer} requiredPermission="Customer" {...props} />
    ),
  }, //AddCustomer
  { path: '/Customer/CustomerChannel', name: 'CustomerChannel', element: CustomerChannel }, // CustomerChannel
  { path: '/Customer/CustomerType', name: 'CustomerType', element: CustomerType }, // CustomerType
  {
    path: '/Admin/AddOutlet',
    name: 'AddOutlet',
    element: 'AddOutlet',
    element: (props) => <AuthGuard element={AddOutlet} requiredPermission="Admin" {...props} />,
  }, // AddOutlet
  { path: '/Product/FetchAttributes', name: 'FetchAttributes', element: FetchAttributes }, // FetchAttributes
  { path: '/Product/AddSubCategory/:id', name: 'EditCategory', element: AddSubCategory }, // Edit SubCategory
  { path: '/base/Transections/:outletId', name: 'Transections', element: Transections }, // Transections
  { path: '/Product/AddAtt', name: 'AddAtt', element: AddAtt }, //AddAtt
  { path: '/Category/AddCategories', name: 'AddCategories', element: AddCategories }, //AddCategories
  { path: '/SubCat/AddSubCat', name: 'AddSubCat', element: AddSubCat }, //AddSubCat
  {
    path: '/Admin/AdditionalFee',
    name: 'AdditionalFee',
    element: 'AdditionalFee',
    element: (props) => <AuthGuard element={AdditionalFee} requiredPermission="Admin" {...props} />,
  }, // AdditionalFee

  //Reports
  {
    path: '/Reports/DaySale',
    name: 'DaySale',
    element: 'DaySale',
    element: (props) => <AuthGuard element={DaySale} requiredPermission="Reports" {...props} />,
  }, //DaySale
  {
    path: '/Reports/SaleReport',
    name: 'SaleReport',
    element: 'SaleReport',
    element: (props) => <AuthGuard element={SaleReport} requiredPermission="Reports" {...props} />,
  }, //SaleReport
  {
    path: '/Reports/ProfitReport',
    name: 'ProfitReport',
    element: 'ProfitReport',
    element: (props) => (
      <AuthGuard element={ProfitReport} requiredPermission="Reports" {...props} />
    ),
  }, //ProfitReport
  {
    path: '/Reports/CommissionReport',
    name: 'CommissionReport',
    element: 'CommissionReport',
    element: (props) => (
      <AuthGuard element={CommissionReport} requiredPermission="Reports" {...props} />
    ),
  }, //CommissionReport
  {
    path: '/Reports/ProductReport',
    name: 'ProductReport',
    element: 'ProductReport',
    element: (props) => (
      <AuthGuard element={ProductReport} requiredPermission="Reports" {...props} />
    ),
  }, //ProductReport
  {
    path: '/Reports/PaymentReport',
    name: 'PaymentReport',
    element: 'PaymentReport',
    element: (props) => (
      <AuthGuard element={PaymentReport} requiredPermission="Reports" {...props} />
    ),
  }, //PaymentReport

  //Roles
  {
    path: '/Admin/SysRoles',
    name: 'SysRoles',
    element: 'SysRoles',
    element: (props) => <AuthGuard element={SysRoles} requiredPermission="Admin" {...props} />,
  }, // SysRoles
  {
    path: '/Admin/RegisterUser',
    name: 'RegisterUser',
    element: 'RegisterUser',
    element: (props) => <AuthGuard element={RegisterUser} requiredPermission="Admin" {...props} />,
  }, // RegisterUser

  {
    path: '/Admin/Payment',
    name: 'Payment',
    element: 'Payment',
    element: (props) => <AuthGuard element={Payment} requiredPermission="Admin" {...props} />,
  }, // Payment
]

export default routes
