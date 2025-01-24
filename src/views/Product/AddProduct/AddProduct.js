import React, { useState, useEffect } from 'react'
import './AddProduct.css'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import axios from 'axios'
import Select from 'react-select'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Network, Urls } from '../../../api-config'
import useAuth from '../../../hooks/useAuth'

const AddProduct = () => {
  const initialFormData = {
    product_name: '',
    sku: '',
    season: '',
    description: '',
    notes: '',
    color: [],
    size: [],
    attribute: [],
    variations: [],
    cost_price: '',
    selling_price: '',
    discount_price: '',
    wholesale_price: '',
    retail_price: '',
    token_price: '',
    outlet: '',
    category: '',
    sub_category: '',
    brand: '',
    image: null,
    shop: '',
  }

  const [formData, setFormData] = useState(initialFormData)
  const [activeTab, setActiveTab] = useState(0)
  const { id } = useParams()
  const [headCategories, setHeadCategories] = useState([])
  const [parentCategories, setParentCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubCategories] = useState([])
  const [loading, setIsLoading] = useState(true)
  const [brands, setBrands] = useState([])
  const [productList, setProductList] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editProductId, setEditProductId] = useState(null)
  const [selectedHeadCategory, setSelectedHeadCategory] = useState('')
  const [selectedParentCategory, setSelectedParentCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedsubCategory, setSelectedsubCategory] = useState('')
  const [attributes, setAttributes] = useState([])
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [variations, setVariations] = useState([])
  const [selectedVariations, setSelectedVariations] = useState({})
  //const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedBrand, setSelectedBrand] = useState('')
  const [outlets, setOutlets] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [nextTab, setNextTab] = useState(null)
  const [isCategoryDialogOpen, setCategoryDialogOpen] = React.useState(false)
  const [error, setError] = useState('')
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false)
  const { userOutlets } = useAuth()

  // Function to handle button click and open the dialog

  const handleDialogClose = async (confirmDelete) => {
    const shopId = localStorage.getItem('shop_id')
    if (confirmDelete) {
      try {
        const response = await Network.delete(`${Urls.deleteTempProduct}/${shopId}`) // Updated to use Network.delete
        if (!response.ok) {
          console.log(response.data.error)
          return
        }
        toast.success('All products deleted successfully!') // Notify the user of success
        setProductList([]) // Clear the product list
        setActiveTab(nextTab) // Move to the next tab
      } catch (error) {
        console.error('There was an error deleting the products:', error)
      }
    }
    setIsDialogOpen(false) // Close the dialog
  }

  useEffect(() => {
    if (selectedCategory) {
      fetchAttributes(selectedCategory, selectedsubCategory) // Fetch attributes when category or subcategory is selected
    }
  }, [selectedCategory, selectedsubCategory]) // Re-fetch when either category or subcategory changes

  const fetchAttributes = async (categoryId, subCategoryId) => {
    const shopId = localStorage.getItem('shop_id')
    if (!categoryId) {
      console.error('Category ID is undefined or null')
      return // Prevent making the request if categoryId is invalid
    }

    // Use the appropriate URL based on whether subCategoryId is provided
    const url = subCategoryId
      ? `${Urls.fetchSubcategories}/${shopId}/${encodeURIComponent(subCategoryId)}`
      : `${Urls.fetchCategories}/${shopId}/${encodeURIComponent(categoryId)}`

    try {
      // Use Network.get
      const response = await Network.get(url)
      const data = response.data

      // Transform data for multi-select dropdown
      const options = data.map((item) => ({
        value: item.attribute,
        label: item.attribute,
        variations: item.variation, // Optional: Handle variations if needed
      }))

      setAttributes(options) // Populate attributes dropdown
    } catch (error) {
      console.error('Error fetching attributes:', error)
    }
  }

  const handleTabChange = (tabIndex) => {
    if (tabIndex === 1 && !selectedCategory) {
      openCategoryDialog()
      return
    }

    if (tabIndex === 0 && activeTab === 1) {
      // Open confirmation dialog when going back from "Color" tab to "General"
      setNextTab(tabIndex)
      setIsDialogOpen(true)
    } else {
      // Directly change the tab if no confirmation is needed
      setActiveTab(tabIndex)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
    }
  }

  // Handle attribute selection
  const handleAttributeChange = (selectedOptions) => {
    // Set selected attributes (multi-select options)
    setSelectedAttributes(selectedOptions || [])

    // Extract variations for the selected attributes (assumes `variations` is an array in each option)
    const selectedVariations = selectedOptions
      ? selectedOptions.map((option) => ({
          attribute: option.label, // Store the attribute name
          variations: option.variations, // Store the variations for this attribute
        }))
      : []

    // Update variations state based on the selected attributes
    setVariations(selectedVariations)
    console.log('selectedVariations', selectedVariations)
    console.log('selectedOptions', selectedOptions)
  }

  // Handle variation selection for each attribute
  const handleVariationChange = (e, attribute) => {
    const { value, checked } = e.target // Extract variation and checked state

    // Update selected variations for the corresponding attribute
    setSelectedVariations((prevState) => {
      // Initialize variations for this attribute if not already present
      const updatedVariations = prevState[attribute] || []

      if (checked) {
        // Add variation if it's checked
        updatedVariations.push(value)
      } else {
        // Remove variation if it's unchecked
        const index = updatedVariations.indexOf(value)
        if (index > -1) updatedVariations.splice(index, 1) // Remove from array
      }

      // Return the updated state with variations for this attribute
      return { ...prevState, [attribute]: updatedVariations }
    })
  }

  useEffect(() => {
    fetchHeadCategories()
  }, [])

  const fetchHeadCategories = async () => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.get(`${Urls.addHeadCategory}${shopId}`)
    if (!response.ok) return console.log(response.data.error)
    setHeadCategories(response.data.results)
  }

  const handleHeadCategoryChange = async (e) => {
    const shopId = localStorage.getItem('shop_id')
    const headCategoryId = e.target.value // This will now hold the numeric ID
    console.log('Selected Head Category ID:', headCategoryId) // Logs the correct ID

    setSelectedHeadCategory(headCategoryId) // Save selected head category

    // Reset dependent dropdowns
    setParentCategories([])
    setCategories([])
    setSubCategories([])
    setSelectedCategory('')
    setSelectedParentCategory('')
    setSelectedsubCategory('')

    if (headCategoryId) {
      const response = await Network.get(
        `${Urls.fetchHeadtoParentCategory}${shopId}/${headCategoryId}`,
      )
      console.log('Parent Categories:', response.data.results)
      setParentCategories(response.data) // Populate parent categories
    } else {
      console.error('Head Category ID is missing!')
    }
  }

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const shopId = localStorage.getItem('shop_id') // Get shop_id from local storage

        if (!shopId) {
          console.error('Shop ID is missing. Please log in again.')
          return
        }

        // Include shop_id in the API request URL
        const response = await Network.get(`${Urls.addBrand}/${shopId}/`)

        if (!response.ok) {
          console.error('Failed to fetch brands:', response.data?.error || 'Unknown error')
          return
        }

        const brandsData = response.data.results || []
        setBrands(Array.isArray(brandsData) ? brandsData : [])
      } catch (error) {
        console.error('Error fetching brands:', error)
      }
    }

    fetchBrands()
  }, [])

  // Fetch Categories based on selected Parent Category
  const handleParentCategoryChange = async (e) => {
    const shopId = localStorage.getItem('shop_id')
    const parentCategoryId = e.target.value

    if (!parentCategoryId) {
      console.error('Parent Category ID is missing!')
      return // Prevent making the request if parentCategoryId is invalid
    }

    setSelectedParentCategory(parentCategoryId) // Save selected parent category
    setCategories([]) // Reset categories and subcategories
    setSubCategories([])
    setSelectedCategory('')
    setSelectedsubCategory('')
    setAttributes([]) // Reset attributes

    const response = await Network.get(
      `${Urls.fetchParenttoCategory}${shopId}/${encodeURIComponent(parentCategoryId)}`,
    )
    setCategories(response.data) // Populate categories
  }

  // Fetch Subcategories based on selected Category
  const handleCategoryChange = async (e) => {
    const shopId = localStorage.getItem('shop_id')
    const categoryId = e.target.value
    console.log({ categoryId })
    setFormData((prev) => ({
      ...prev,
      category: categoryId, // Update category in formData
    }))
    // console.log("W",formData )
    // console.log("W")

    if (!categoryId) {
      console.error('Category ID is missing!')
      return
    }

    setSelectedCategory(categoryId) // Save selected category
    setSubCategories([]) // Reset subcategories
    setSelectedsubCategory('')
    setAttributes([]) // Reset attributes

    const response = await Network.get(
      `${Urls.fetchCategorytoSubCategory}/${shopId}/${encodeURIComponent(categoryId)}`,
    )
    const subCategoryData = response.data
    setSubCategories(subCategoryData) // Set the subcategories

    // Check if subcategories are found, and show the subcategory dropdown if they exist
    if (subCategoryData.length > 0) {
      setShowSubCategoryDropdown(true) // Show the dropdown
    } else {
      setShowSubCategoryDropdown(false) // Hide the dropdown if no subcategories are found
    }

    console.log('Subcategories:', subCategoryData) // Debug log for subcategories
    console.log('Show Subcategory Dropdown:', showSubCategoryDropdown) // Debug log

    // Fetch related attributes dynamically for the selected category
    fetchAttributes(categoryId, '') // Pass categoryId and empty subcategoryId to fetch category-specific attributes
  }

  const handleSubCategoryChange = async (e) => {
    const subCategoryId = e.target.value

    if (!subCategoryId) {
      console.error('Subcategory ID is missing!')
      return
    }

    setSelectedsubCategory(subCategoryId) // Save selected subcategory
    console.log()
    setFormData((prevData) => ({
      ...prevData,
      sub_category: subCategoryId,
    }))
    setAttributes([]) // Reset attributes

    // Fetch attributes related to the selected subcategory
    console.log(formData)
    fetchAttributes('', subCategoryId) // Pass empty categoryId and selected subcategoryId to fetch subcategory-specific attributes
  }

  // Helper Function to Reset Dependent Dropdowns
  const resetDependentDropdowns = () => {
    setParentCategories([])
    setCategories([])
    setSubCategories([])
    setSelectedCategory('')
    setSelectedParentCategory('')
    setSelectedsubCategory('')
  }

  const colorOptions = [
    { value: 'Almond', label: 'Almond' },
    { value: 'Angoori', label: 'Angoori' },
    { value: 'Baby blue', label: 'Baby blue' },
    { value: 'Baby pink', label: 'Baby pink' },
    { value: 'Beige', label: 'Beige' },
    { value: 'Biscuit', label: 'Biscuit' },
    { value: 'Black', label: 'Black' },
    { value: 'Bottle green', label: 'Bottle green' },
    { value: 'Bronze brown', label: 'Bronze brown' },
    { value: 'Burgundy', label: 'Burgundy' },
    { value: 'Camel', label: 'Camel' },
    { value: 'Caramel', label: 'Caramel' },
    { value: 'Champagne', label: 'Champagne' },
    { value: 'Violet', label: 'Violet' },
    { value: 'White', label: 'White' },
    { value: 'Emerald green', label: 'Emerald green' },
    { value: 'Fuchsia', label: 'Fuchsia' },
    { value: 'Gold', label: 'Gold' },
    { value: 'Gray', label: 'Gray' },
    { value: 'Indigo', label: 'Indigo' },
    { value: 'Ivory', label: 'Ivory' },
    { value: 'Lavender', label: 'Lavender' },
    { value: 'Lime', label: 'Lime' },
    { value: 'Magenta', label: 'Magenta' },
    { value: 'Maroon', label: 'Maroon' },
    { value: 'Mint green', label: 'Mint green' },
    { value: 'Navy blue', label: 'Navy blue' },
    { value: 'Olive green', label: 'Olive green' },
    { value: 'Orange', label: 'Orange' },
    { value: 'Peach', label: 'Peach' },
    { value: 'Pink', label: 'Pink' },
    { value: 'Plum', label: 'Plum' },
    { value: 'Purple', label: 'Purple' },
    { value: 'Red', label: 'Red' },
    { value: 'Rose', label: 'Rose' },
    { value: 'Silver', label: 'Silver' },
    { value: 'Sky blue', label: 'Sky blue' },
    { value: 'Teal', label: 'Teal' },
    { value: 'Turquoise', label: 'Turquoise' },
    { value: 'Yellow', label: 'Yellow' },
    { value: 'Zinc', label: 'Zinc' },
    { value: 'Aqua', label: 'Aqua' },
    { value: 'Beetroot', label: 'Beetroot' },
    { value: 'Cyan', label: 'Cyan' },
    { value: 'Dark green', label: 'Dark green' },
    { value: 'Dark purple', label: 'Dark purple' },
    { value: 'Fawn', label: 'Fawn' },
    { value: 'Forest green', label: 'Forest green' },
    { value: 'Grape', label: 'Grape' },
    { value: 'Honey', label: 'Honey' },
    { value: 'Ivory', label: 'Ivory' },
    { value: 'Lime green', label: 'Lime green' },
    { value: 'Mauve', label: 'Mauve' },
    { value: 'Midnight blue', label: 'Midnight blue' },
    { value: 'Neon green', label: 'Neon green' },
    { value: 'Olive', label: 'Olive' },
    { value: 'Peach puff', label: 'Peach puff' },
    { value: 'Periwinkle', label: 'Periwinkle' },
    { value: 'Pumpkin', label: 'Pumpkin' },
    { value: 'Salmon', label: 'Salmon' },
    { value: 'Sapphire', label: 'Sapphire' },
    { value: 'Slate gray', label: 'Slate gray' },
    { value: 'Snow', label: 'Snow' },
    { value: 'Steel blue', label: 'Steel blue' },
    { value: 'Tangerine', label: 'Tangerine' },
    { value: 'Thistle', label: 'Thistle' },
    { value: 'Topaz', label: 'Topaz' },
    { value: 'Turquoise blue', label: 'Turquoise blue' },
    { value: 'Wisteria', label: 'Wisteria' },
  ]

  const sizeOptions = [
    { value: 'S', label: 'S' },
    { value: 'XS', label: 'XS' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const shopId = localStorage.getItem('shop_id')
      try {
        const [headResponse, parentResponse] = await Promise.all([
          Network.get(`${Urls.addHeadCategory}${shopId}`),
          Network.get(`${Urls.addParentCategory}${shopId}`),
        ])

        // Set states with fetched data
        setHeadCategories(headResponse.data.results)
        setParentCategories(parentResponse.data.results)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    fetchProductList()
  }, [])

  const fetchProductList = async () => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.get(`${Urls.addProduct}/${shopId}`)
    if (!response.ok) return console.log(response.data.error)
    setProductList(response.data)
  }

  useEffect(() => {
    // Fetch outlets data from the API

    fetchOutlets()
  }, [])

  // Fetch outlets data from the API
  const fetchOutlets = async () => {
    try {
      const shopId = localStorage.getItem('shop_id') // Get shop_id from local storage

      if (!shopId) {
        console.error('Shop ID is missing. Please log in again.')
        return
      }

      // Use the shop_id in the API endpoint
      const response = await Network.get(`${Urls.fetchAllOutlets}${shopId}/`)

      if (!response.ok) {
        console.error('Failed to fetch outlets:', response.data?.error || 'Unknown error')
        return
      }

      const outlets = response.data
        .map((outlet) => {
          if (userOutlets.some((o) => o.id === outlet.id)) {
            return outlet
          }
          return null
        })
        .filter((outlet) => outlet !== null)

      setOutlets(outlets) // Assuming the response data is an array of outlets
    } catch (error) {
      console.error('Error fetching outlets:', error)
    }
  }

  const handleMultiSelectChange = (selectedOptions, name) => {
    const values = selectedOptions ? selectedOptions.map((option) => option.value) : []
    setFormData((prevData) => ({
      ...prevData,
      [name]: values,
    }))
  }

  const handleChange = async (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })

    // Perform validation for Selling Price
    if (name === 'selling_price' && Number(value) <= Number(formData.cost_price)) {
      setError('Selling Price must be greater than Cost Price')
    }
    // Perform validation for Discount Price
    else if (name === 'discount_price') {
      if (Number(value) <= Number(formData.cost_price)) {
        setError('Discount Price must be greater than Cost Price')
      } else if (Number(value) >= Number(formData.selling_price)) {
        setError('Discount Price must be less than Selling Price')
      } else {
        setError('')
      }
    } else {
      setError('')
    }
  }

  const handleBrandChange = (e) => {
    const selectedBrandId = e.target.value // Get selected brand ID
    setSelectedBrand(selectedBrandId) // Update selectedBrand state
    setFormData((prevData) => ({
      ...prevData,
      brand: selectedBrandId, // Store brand ID in formData
    }))
    console.log(selectedBrandId)
  }

  const handleAdd = async (e) => {
    const shopId = localStorage.getItem('shop_id')
    e.preventDefault()

    // Create a new FormData instance
    const formDataPayload = new FormData()

    // Manually format color as a string (e.g., "[ 'Baby pink' ]")
    const colorString = `[ '${formData.color.join("', '")}' ]`

    // Format variations
    const variationsFormatted = Object.keys(selectedVariations).map((attribute) => {
      return selectedVariations[attribute] // Wrap each selection in an array
    })

    // Append all fields to FormData
    formDataPayload.append('product_name', formData.product_name)
    formDataPayload.append('sku', formData.sku)
    formDataPayload.append('season', formData.season)
    formDataPayload.append('description', formData.description)
    formDataPayload.append('notes', formData.notes)
    formDataPayload.append('color', colorString) // color as a string
    formDataPayload.append('attribute', JSON.stringify(formData.attribute)) // Convert attributes to JSON string
    formDataPayload.append('variations', JSON.stringify(variationsFormatted)) // Convert variations to JSON string
    formDataPayload.append('cost_price', formData.cost_price)
    formDataPayload.append('selling_price', formData.selling_price)
    formDataPayload.append('discount_price', formData.discount_price)
    formDataPayload.append('wholesale_price', formData.wholesale_price)
    formDataPayload.append('retail_price', formData.retail_price)
    formDataPayload.append('token_price', formData.token_price)
    formDataPayload.append('outlet', formData.outlet) // Use outlet ID
    formDataPayload.append('category', selectedCategory)
    formDataPayload.append('sub_category', selectedsubCategory)
    formDataPayload.append('brand', selectedBrand)
    formDataPayload.append('shop', shopId) // Add shop ID to payload

    // Append image if available
    if (formData.image) {
      formDataPayload.append('image', formData.image)
    }
    console.log(formData.image) // Check if the image is selected

    try {
      const response = await axios.post(
        'http://195.26.253.123/pos/products/add_temp_product/${shopId}',
        formDataPayload, // Use formDataPayload here
      )

      if (response.status === 200 || response.status === 201) {
        toast.success('Product added successfully!')
        fetchProductList()
        resetForm()
      } else {
        alert('Failed to add the product. Please try again.')
      }
    } catch (error) {
      console.error('Error adding product:', error)

      // Check if the error contains response data
      if (error.response && error.response.data) {
        // Handle specific field errors
        Object.keys(error.response.data).forEach((key) => {
          const errorMessages = error.response.data[key]
          if (Array.isArray(errorMessages)) {
            errorMessages.forEach((message) => {
              toast.error(`${key}: ${message}`)
            })
          } else {
            toast.error(`${key}: ${errorMessages}`)
          }
        })
      } else {
        // Handle general errors
        toast.error('An error occurred while adding the product.')
      }
    }

    fetchProductList()
    resetForm()
  }

  const handleDelete = async (id) => {
    const shopId = localStorage.getItem('shop_id')
    try {
      const response = await Network.delete(`${Urls.actionTempProduct}/${shopId}/${id}`) // Updated to use Network.delete
      if (response.ok) {
        // Check if the response is successful
        setProductList((prevList) => prevList.filter((product) => product.id !== id)) // Remove the deleted product from the list
        toast.success('Product deleted successfully!')
      } else {
        console.error('Failed to delete the product')
        toast.error('Failed to delete the product. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete the product. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData((prevData) => ({
      ...prevData, // Retain existing product_name and outlet
      color: [],
      cost_price: '',
      selling_price: '',
      discount_price: '',
      wholesale_price: '',
      retail_price: '',
      token_price: '',
      brand_name: '',
      variations: '',
      notes: '',
    }))
    setSelectedVariations({})
    setEditMode(false)
    setEditProductId(null)
  }

  const handlePublish = async () => {
    const shopId = localStorage.getItem('shop_id')
    console.log('Publishing with data:', formData)

    try {
      const url = `${Urls.publishProduct}/${shopId}`
      const response = await Network.post(url) // Assuming `formData` contains the product data

      if (response.status === 201 || response.status === 200) {
        toast.success('Product published successfully!')
        // history.push('/Product/AllProducts')
      } else {
        toast.error('Failed to publish the product. Please try again.')
      }
    } catch (error) {
      console.error('Error publishing product:', error)
      toast.error('An error occurred while publishing the product. Please try again later.')
    }
    fetchProductList()
  }

  const openCategoryDialog = () => setCategoryDialogOpen(true)
  const closeCategoryDialog = () => setCategoryDialogOpen(false)

  return (
    <div className="add-product-form">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <h2>Product Information</h2>

      <div style={{ marginBottom: '16px' }}>
        {' '}
        {/* Add space below the label and input */}
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          Product Name *
        </label>
        <input
          type="text"
          name="product_name"
          value={formData.product_name}
          onChange={handleChange}
          required
          style={{
            width: '100%', // Make input full width (optional)
            padding: '8px', // Add padding for better UX
            fontSize: '16px', // Adjust font size
            border: '1px solid #ccc', // Add a border
            borderRadius: '4px', // Add slight rounding to corners
          }}
        />
      </div>

      {/* Tabs */}
      <Paper square>
        <Tabs
          value={activeTab}
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, newValue) => handleTabChange(newValue)}
          centered
        >
          <Tab label="General" />
          <Tab label="Color, Sizes & Pricing" />
        </Tabs>
      </Paper>

      {/* Confirmation Dialog */}
      {/* Dialog Box */}
      {setProductList.length > 0 && ( // Check if table has data */}
        <Dialog open={isDialogOpen} onClose={() => handleDialogClose(false)}>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete all products? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogClose(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={() => handleDialogClose(true)} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Category Dialog */}
      {isCategoryDialogOpen && (
        <Dialog open={isCategoryDialogOpen} onClose={closeCategoryDialog}>
          <DialogTitle>Category Required</DialogTitle>
          <DialogContent>
            {' '}
            <DialogContentText>
              Please select a category or subcategory before proceeding.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCategoryDialog} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <div className="form-container">
        <form>
          {activeTab === 0 && (
            <div className="form-column">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <label style={{ flex: 1, fontWeight: 'bold' }}>
                  Outlet Name:
                  {/* <select
                    name="outlet"
                    value={formData.outlet}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px' }} // Full width and some padding
                  >
                    <option value="" disabled>
                      Select Outlet
                    </option>
                    {Array.isArray(outlets) && outlets.length > 0 ? (
                      outlets.map((outlet) => (
                        <option key={outlet.id} value={outlet.id}>
                          {outlet.outlet_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading outlets...</option>
                    )}
                  </select> */}
                  <Select
                    options={
                      Array.isArray(outlets) && outlets.length > 0
                        ? outlets.map((outlet) => ({
                            value: outlet.id,
                            label: outlet.outlet_name,
                          }))
                        : []
                    } // Map options to value-label pairs
                    value={
                      formData.outlet
                        ? {
                            value: formData.outlet,
                            label: outlets.find((o) => o.id === formData.outlet)?.outlet_name,
                          }
                        : null
                    } // Set the selected value
                    onChange={(selectedOption) => {
                      handleChange({ target: { name: 'outlet', value: selectedOption?.value } })
                    }} // Update formData using handleChange
                    isClearable
                    placeholder={
                      Array.isArray(outlets) && outlets.length > 0
                        ? 'Select Outlet'
                        : 'Loading outlets...' // Show "Loading outlets..." when data is unavailable
                    }
                    styles={{
                      container: (base) => ({ ...base, width: '100%' }), // Full width
                    }}
                  />
                </label>

                <Link to="/Admin/AddOutlet">
                  <button style={{ height: '100%', padding: '8px' }}>+</button>{' '}
                  {/* Matches dropdown height */}
                </Link>
              </div>

              <label>
                {/* SKU: */}
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  style={{ display: 'none' }} // Corrected style syntax
                />
              </label>

              {/* Head Category Dropdown */}

              {/* <select
                    onChange={handleHeadCategoryChange}
                    style={{ width: '100%', padding: '8px' }} // Full width for dropdown
                  >
                    <option value="">Select Head Category</option>
                    {headCategories.map((headCategory) => (
                      <option key={headCategory.id} value={headCategory.id}>
                        {headCategory.hc_name} {/* Display the name but pass the ID */}
              {/* </option>
                    ))}
                  </select>  */}

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <label style={{ flex: 1, fontWeight: 'bold' }}>
                  Head Category *
                  <Select
                    options={headCategories.map((headCategory) => ({
                      value: headCategory.id,
                      label: headCategory.hc_name,
                    }))} // Map headCategories to value-label pairs
                    value={
                      headCategories.find((hc) => hc.id === selectedHeadCategory)
                        ? {
                            value: selectedHeadCategory,
                            label: headCategories.find((hc) => hc.id === selectedHeadCategory)
                              ?.hc_name,
                          }
                        : null
                    } // Set the selected value
                    onChange={(selectedOption) =>
                      handleHeadCategoryChange({ target: { value: selectedOption?.value } })
                    } // Simulate native event for existing logic
                    isClearable
                    placeholder="Select Head Category"
                    styles={{
                      container: (base) => ({ ...base, width: '100%' }), // Full width for dropdown
                    }}
                  />
                </label>
                <Link to="/Product/AddHeadCategory">
                  <button style={{ height: '100%', padding: '8px' }}>+</button>{' '}
                  {/* Matches dropdown height */}
                </Link>
              </div>

              {/* Parent Category Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <label style={{ flex: 1, fontWeight: 'bold' }}>
                  Parent Category *
                  {/* <select
                    value={selectedParentCategory}
                    onChange={handleParentCategoryChange}
                    disabled={!selectedHeadCategory}
                    style={{ width: '100%', padding: '8px' }} // Full width and padding
                  >
                    <option value="">Select Parent Category</option>
                    {Array.isArray(parentCategories) &&
                      parentCategories.map((parentCategory) => (
                        <option key={parentCategory.id} value={parentCategory.id}>
                          {parentCategory.pc_name}
                        </option>
                      ))}
                  </select> */}
                  <Select
                    options={
                      Array.isArray(parentCategories)
                        ? parentCategories.map((parentCategory) => ({
                            value: parentCategory.id,
                            label: parentCategory.pc_name,
                          }))
                        : []
                    } // Map parentCategories to value-label pairs
                    value={
                      parentCategories.find((pc) => pc.id === selectedParentCategory)
                        ? {
                            value: selectedParentCategory,
                            label: parentCategories.find((pc) => pc.id === selectedParentCategory)
                              ?.pc_name,
                          }
                        : null
                    } // Set the selected value
                    onChange={(selectedOption) =>
                      handleParentCategoryChange({ target: { value: selectedOption?.value } })
                    } // Simulate native event for existing logic
                    isClearable
                    isDisabled={!selectedHeadCategory} // Disable if no head category is selected
                    placeholder="Select Parent Category"
                    styles={{
                      container: (base) => ({ ...base, width: '100%' }), // Full width for dropdown
                    }}
                  />
                </label>
                <Link to="/Product/AddParentCategory">
                  <button style={{ height: '100%', padding: '8px' }}>+</button>
                </Link>
              </div>

              {/* Category Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <label style={{ flex: 1, fontWeight: 'bold' }}>
                  Category *
                  {/* <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    disabled={!selectedParentCategory}
                    style={{ width: '100%', padding: '8px' }}
                  >
                    <option value="">Select Category</option>
                    {Array.isArray(categories) &&
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.category_name}
                        </option>
                      ))}
                  </select> */}
                  <Select
                    options={
                      Array.isArray(categories)
                        ? categories.map((category) => ({
                            value: category.id,
                            label: category.category_name,
                          }))
                        : []
                    } // Map categories to value-label pairs
                    value={
                      categories.find((cat) => cat.id === selectedCategory)
                        ? {
                            value: selectedCategory,
                            label: categories.find((cat) => cat.id === selectedCategory)
                              ?.category_name,
                          }
                        : null
                    } // Set the selected value
                    onChange={(selectedOption) =>
                      handleCategoryChange({ target: { value: selectedOption?.value } })
                    } // Simulate native event for existing logic
                    isClearable
                    isDisabled={!selectedParentCategory} // Disable if no parent category is selected
                    placeholder="Select Category"
                    styles={{
                      container: (base) => ({ ...base, width: '100%' }), // Full width for dropdown
                    }}
                  />
                </label>
                <Link to="/Product/Category">
                  <button style={{ height: '100%', padding: '8px' }}>+</button>
                </Link>
              </div>

              {/* Subcategory Dropdown */}
              {showSubCategoryDropdown && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                  <label style={{ flex: 1, fontWeight: 'bold' }}>
                    Subcategory
                    {/* <select
                      value={selectedsubCategory}
                      onChange={handleSubCategoryChange}
                      disabled={!selectedCategory}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="">Select Subcategory</option>
                      {Array.isArray(subcategories) &&
                        subcategories.map((subCategory) => (
                          <option key={subCategory.id} value={subCategory.id}>
                            {subCategory.sub_category_name}
                          </option>
                        ))}
                    </select> */}
                    <Select
                      options={
                        Array.isArray(subcategories)
                          ? subcategories.map((subCategory) => ({
                              value: subCategory.id,
                              label: subCategory.sub_category_name,
                            }))
                          : []
                      } // Map subcategories to value-label pairs
                      value={
                        subcategories.find((sub) => sub.id === selectedsubCategory)
                          ? {
                              value: selectedsubCategory,
                              label: subcategories.find((sub) => sub.id === selectedsubCategory)
                                ?.sub_category_name,
                            }
                          : null
                      } // Set the selected value
                      onChange={(selectedOption) =>
                        handleSubCategoryChange({ target: { value: selectedOption?.value } })
                      } // Simulate native event for existing logic
                      isClearable
                      isDisabled={!selectedCategory} // Disable if no category is selected
                      placeholder="Select Subcategory"
                      styles={{
                        container: (base) => ({ ...base, width: '100%' }), // Full width for dropdown
                      }}
                    />
                  </label>
                  <Link to="/SubCat/AddSubCat">
                    <button style={{ height: '100%', padding: '8px' }}>+</button>
                  </Link>
                </div>
              )}

              {/* Brands Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <label style={{ flex: 1, fontWeight: 'bold' }}>
                  Brands (optional)
                  {/* <select
                    value={selectedBrand}
                    onChange={handleBrandChange}
                    style={{ width: '100%', padding: '8px' }}
                  >
                    <option value="">Select a Brand</option>
                    {Array.isArray(brands) &&
                      brands.map((branddata) => (
                        <option key={branddata.id} value={branddata.id}>
                          {branddata.brand_name}
                        </option>
                      ))}
                  </select> */}
                  <Select
                    options={
                      Array.isArray(brands)
                        ? brands.map((branddata) => ({
                            value: branddata.id,
                            label: branddata.brand_name,
                          }))
                        : []
                    } // Map brands to value-label pairs
                    value={
                      brands.find((brand) => brand.id === selectedBrand)
                        ? {
                            value: selectedBrand,
                            label: brands.find((brand) => brand.id === selectedBrand)?.brand_name,
                          }
                        : null
                    } // Set the selected value
                    onChange={(selectedOption) =>
                      handleBrandChange({ target: { value: selectedOption?.value } })
                    } // Simulate native event for existing logic
                    isClearable
                    placeholder="Select a Brand"
                    styles={{
                      container: (base) => ({ ...base, width: '100%' }), // Full width for dropdown
                    }}
                  />
                </label>
                <Link to="/Product/AddBrands">
                  <button style={{ height: '100%', padding: '8px' }}>+</button>
                </Link>
              </div>

              <label style={{ fontWeight: 'bold' }}>
                Season (optional)
                <select name="season" value={formData.season} onChange={handleChange}>
                  <option value="">Select Season</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                  <option value="Spring">Spring</option>
                  <option value="Autumn">Autumn</option>
                </select>
              </label>
            </div>
          )}

          {activeTab === 1 && (
            <div className="form-column">
              <label style={{ fontWeight: 'bold' }}>
                Notes (optional)
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  required
                />
              </label>
              {/* Color and Size Inputs */}
              <label style={{ fontWeight: 'bold' }}>
                Color (optional)
                <Select
                  isMulti
                  options={colorOptions}
                  value={formData.color.map((c) => ({ value: c, label: c }))} // Pre-fill the select with the selected values
                  onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'color')}
                />
              </label>

              <label style={{ fontWeight: 'bold' }}>Select Attributes * </label>
              <Select
                isMulti
                options={attributes}
                onChange={handleAttributeChange}
                placeholder="Select attributes..."
              />

              {/* Display Variations */}
              {variations.length > 0 && (
                <div>
                  <h3>Variations</h3>
                  {variations?.map(({ attribute, variations }) => (
                    <div key={attribute} style={{ marginTop: '20px' }}>
                      <h5>{attribute}</h5>
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {variations?.map((variations) => (
                          <label
                            key={variations}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            <input
                              type="checkbox"
                              name={attribute}
                              value={variations}
                              checked={selectedVariations[attribute]?.includes(variations) || false} // Controlled by state
                              onChange={(e) => handleVariationChange(e, attribute)}
                            />
                            {variations}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <label style={{ fontWeight: 'bold' }}>
                Cost Price *
                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  required
                />
              </label>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <label style={{ fontWeight: 'bold' }}>
                Selling Price *
                <input
                  type="number"
                  name="selling_price"
                  value={formData.selling_price}
                  onChange={handleChange}
                  required
                />
              </label>
              <label style={{ fontWeight: 'bold' }}>
                Discount Price (Optional)
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                />
              </label>
              <label style={{ fontWeight: 'bold' }}>
                Wholesale Price (Optional)
                <input
                  type="number"
                  name="wholesale_price"
                  value={formData.wholesale_price}
                  onChange={handleChange}
                />
              </label>
              <label style={{ fontWeight: 'bold' }}>
                Retail Price (Optional)
                <input
                  type="number"
                  name="retail_price"
                  value={formData.retail_price}
                  onChange={handleChange}
                />
              </label>
              <label style={{ fontWeight: 'bold' }}>
                Token Price (Optional)
                <input
                  type="number"
                  name="token_price"
                  value={formData.token_price}
                  onChange={handleChange}
                />
              </label>
              <label style={{ fontWeight: 'bold' }}>
                Add Image (Optional)
                <input type="file" name="image" onChange={handleImageChange} />
              </label>

              {/* <button type="button" onClick={handleAdd}>Add Product</button> */}

              <button
                type="button"
                disabled={!!error}
                onClick={editMode ? handleUpdate : handleAdd}
              >
                {editMode ? 'Update Product' : 'Add Product'}
              </button>

              {/* Product List Table */}
              <table className="product-list-table">
                <thead>
                  <tr>
                    <th>Sr.#</th>
                    <th>Item</th>
                    <th>Color</th>
                    <th>Cost</th>
                    <th>Selling</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.description}</td>
                      <td>{product.color || '-'}</td>
                      <td>{product.cost_price}</td>
                      <td>{product.selling_price}</td>

                      <td>
                        <button
                          onClick={() => handleDelete(product.id)}
                          style={{ marginRight: '8px' }}
                        >
                          {' '}
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <button type="button" onClick={handlePublish}>
                  Publish
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default AddProduct
