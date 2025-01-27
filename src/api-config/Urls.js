export default {
  login: 'accounts/login',

  logout: 'accounts/logout',
  checkUsernameAvalability: 'accounts/check-username',

  //Salesman
  addSalesman: 'transaction/add_salesman',
  updateSalesman: 'transaction/action_salesman',

  //brands
  addBrand: 'products/add_brand',
  updateBrand: 'products/action_brand',

  //AddProduct
  addProduct: 'products/add_temp_product',
  deleteTempProduct: 'products/all-temp-product-delete',
  actionTempProduct: 'products/action_temp_product',
  publishProduct: 'products/add_product',

  //AddAtt
  addAttributes: 'products/variation_group/',

  //AddHeadCategory
  addHeadCategory: 'products/add_head_category',

  //UpdateHeadCategory
  updateHeadCategory: 'products/action_head_category',

  // //FetchOulets
  // fetchtheOutlets: 'products/fetch_all_outlet/',
  addOutlets: 'products/add_outlet',
  actionOutlet: 'products/action_outlet',

  //FetchAllProducts
  fetchAllProducts: 'products/show_product/',
  getProduct: 'products/get_product',

  //AddStock
  addStock: 'stock/add_stock',

  //ShowAllProductDetails
  ShowAllProductDetails: 'products/shows_all_product_detail/',
  actionProducts: 'products/action_products',
  actionProductsagain: 'products/action_product',

  //FetchBarcodesofproducts
  FetchBarcodesofproducts: 'products/barcode_product_data/',
  fetchSubcategories: 'products/fetch_subcategories',
  fetchCategories: 'products/fetch_categories',
  fetchHeadtoParentCategory: 'products/fetch_head_to_parent_category',
  fetchParenttoCategory: 'products/fetch_parent_to_category/',
  fetchCategorytoSubCategory: 'products/fetch_category_to_sub_category',
  addSubCategories: 'products/add_subcategories',

  //AddHeadCategory
  addParentCategory: 'products/add_parent_category/',

  //UpdateHeadCategory
  updateParentCategory: 'products/action_parent_category',

  //addAttributeType
  addAttributeTypes: 'products/add_attribute_type',

  //UpdateAttributeType
  updateAttributeType: 'products/action_attribute_type',

  //VariationGroup
  variationGroup: 'products/variation_group/',

  updateVariationGroup: 'products/action_variations_group/',

  //AddCategories
  addCategory: 'products/add_categories',

  //UpdateCategories
  updateCategory: 'products/action_categories',
  updateSubCategory: 'products/action_subcategories',

  //fetchVariationGroup
  fetchVariationGroup: 'products/fetch_variations_group',

  //fetchHeadtoPareentCategory

  fetchHeadtoParentCategory: 'products/fetch_head_to_parent_category/',

  //outlet
  outletWiseSalesman: 'report/outlet_wise_salesman/',
  fetchAllOutlets: 'products/fetch_all_outlet/',
  fetchtheOutlets: 'products/fetch_all_outlet/',

  //get All Permissions
  getAllPermissions: 'accounts/get-all-permissions/',
  //system Roles
  addSystemRoles: 'accounts/add-system-role/',
  updateSystemRoles: 'accounts/action-system-role',
  fetchSystemRoles: 'accounts/fetch-system-role/',

  //registerUser
  registerUser: 'accounts/register_user/',
  deleteUser: 'accounts/delete_user',
  //password Change user
  passwordChange: 'accounts/admin-change-password/',

  //addPayment
  addpayment: 'transaction/add_payment',
  actionPayment: 'transaction/action_payment',

  //additional FEE
  addAdditionalFee: 'transaction/add_additional_fee',
  updateAdditionalFee: 'transaction/action_additional_fee',

  //REPORTS
  ProfitReportDates: 'report/all_outlet_dates',
  ProfitReport: 'report/profit_report/',
  commissionReport: 'report/salesman_commission_report/',
  salesReport: 'report/sales_report',
  dailySaleReport: 'report/daily_sale_report',
  dailySaleReportDetail: 'report/daily_sale_report_detail',
  productWiseReturns: 'report/product-wise-returns',
  productWiseReturnsDetail: 'report/product-wise-returns-detail',
  paymentMethodReport: 'report/payment-method-report',

  //Customer
  addCustomer: 'customer/add_customer',
  addCustomerChannel: 'customer/add_customer_channel',
  addCustomerType: 'customer/add_customer_type',
  actionCustomer: 'customer/action_customer',
  actionCustomerChannel: 'customer/action_customer_channel',
  actionCustomerType: 'customer/action_customer_type',

  //shops
  addShops: 'admin/add_shop',
  addShopUser: 'admin/shop-admin-user',
  actionShops: 'admin/action_shop',

  //transections
  fetchSalesman: 'transaction/outlet-wise-salesman',
  fetchCustomer: 'customer/add_customer',
  fetchAllTransectionProduct: 'transaction/all_product',
  fetchDelieveryFee: 'transaction/action_additional_fee',
  fetchDueInoices: 'transaction/get_due_invoices',
  fetchInvoices: 'transaction/get_all_invoices',
  fetchTodaySales: 'transaction/today_sale_report',
  fetchAllProductDetail: 'transaction/products_detail',
  addTransection: 'transaction/add_transaction',
  fetchNewProducts: 'transaction/get_invoice_products',
  fetchAdditionalFee: 'transaction/add_additional_fee',
  getInvoices: 'transaction/get_invoice_products',
  getProductDetail: 'transaction/get_product_detail',
  salesReturn: 'transaction/transactions_return',
}
