import React, { Component } from 'react'
import './AddAtt.css'

import axios from 'axios'
import { CButton } from '@coreui/react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material'
import { Network, Urls } from '../../../api-config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class AddAtt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      attType: '',
      attributes: [
        {
          attributeName: '',
          variations: [],
        },
      ],
      apiData: [],
      editData: null, // Holds data for editing
      attribute: [], // This is where the attributes are stored
    }
  }

  addAttribute = () => {
    this.setState((prevState) => ({
      attributes: [
        ...prevState.attributes,
        { attributeName: '', variations: [] }, // Add a new attribute object
      ],
    }))
  }

  componentDidMount() {
    this.fetchData()
    this.fetchAttributeTypes() // Fetch attribute types for the dropdown
  }

  fetchAttributeTypes = async () => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.get(`${Urls.addAttributeTypes}/${shopId}`)
    if (!response.ok) return console.log(response.data.error)
    this.setState({ attributeTypes: response.data.results })
  }

  fetchData = async () => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.get(`${Urls.variationGroup}${shopId}`)
    if (!response.ok) return console.log(response.data.error)
    this.setState({ apiData: response.data.results })
  }

  // Function to fetch attribute types from the API
  variationGroups = async () => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.get(`${Urls.variationGroup}${shopId}`)
    if (!response.ok) return consoe.log(response.data.error)
    setTypes(response.data)
  }

  handleInputChange = (e, attrIndex = null) => {
    const { name, value } = e.target
    if (name === 'attType') {
      this.setState({ attType: value })
    } else if (name === 'attributeName') {
      console.log(e.target.value)
      const updatedAttributes = [...this.state.attributes]
      console.log(updatedAttributes)
      updatedAttributes[attrIndex].attributeName = value
      console.log({ updatedAttributes })
      this.setState({ attributes: updatedAttributes })
    }
  }

  handleKeyPress = (e, attrIndex) => {
    if (e.key === 'Enter') {
      const updatedAttributes = [...this.state.attributes]
      updatedAttributes[attrIndex].variations.push('')
      this.setState({ attributes: updatedAttributes })
    }
  }

  addVariation = (attrIndex) => {
    const updatedAttributes = [...this.state.attributes]
    updatedAttributes[attrIndex].variations.push('')
    this.setState({ attributes: updatedAttributes })
  }

  removeVariation = (attrIndex, varIndex) => {
    const updatedAttributes = [...this.state.attributes]
    updatedAttributes[attrIndex].variations.splice(varIndex, 1) // Remove the variation
    this.setState({ attributes: updatedAttributes })
  }

  removeAttribute = (attrIndex) => {
    this.setState((prevState) => ({
      attributes: prevState.attributes.filter((_, index) => index !== attrIndex),
    }))
  }

  addAttribute = () => {
    this.setState((prevState) => ({
      attributes: [...prevState.attributes, { attributeName: '', variations: [] }],
    }))
  }

  handleVariationChange = (e, attrIndex, varIndex) => {
    const { value } = e.target
    const updatedAttributes = [...this.state.attributes]
    updatedAttributes[attrIndex].variations[varIndex] = value
    this.setState({ attributes: updatedAttributes })
  }

  handleSubmit = async () => {
    const { attType, attributes } = this.state
    const shopId = localStorage.getItem('shop_id')

    const payload = attributes.map((attribute) => ({
      att_type: attType,
      attribute_name: attribute.attributeName,
      variation: attribute.variations,
      shop: shopId, // Include shop ID
    }))

    try {
      const response = await Network.post(`${Urls.addAttributes}${shopId}`, payload)

      if (!response.ok) {
        // Handle and display backend errors
        const errorData = response.data
        if (errorData && errorData.error) {
          Object.keys(errorData.error).forEach((key) => {
            const errorMessages = errorData.error[key]
            if (Array.isArray(errorMessages)) {
              errorMessages.forEach((message) => {
                toast.error(`${key}: ${message}`)
              })
            } else {
              toast.error(`${key}: ${errorMessages}`)
            }
          })
        } else {
          toast.error('Failed to submit data. Please check your input.')
        }
        return
      }

      // Success case
      toast.success('Data successfully submitted!')
      this.fetchData()
    } catch (error) {
      console.error('Error submitting data:', error)
      toast.error('An error occurred while submitting data.')
    }
    this.setState({
      editData: null,
      attType: '',
      attributes: [{ attributeName: '', variations: [] }],
    })
    this.fetchData()
    this.variationGroups()
  }

  handleEdit = (item) => {
    const attId = item.att_id
    if (!attId) {
      alert('The selected item does not have a valid ID for editing.')
      return
    }

    // Find the ID of the attribute type from the attributeTypes array
    const selectedAttributeType = this.state.attributeTypes.find(
      (type) => type.att_type === item.att_type,
    )

    const attTypeId = selectedAttributeType ? selectedAttributeType.id : ''

    console.log('Editing Item Data:', item) // ✅ Debugging log

    this.setState({
      attType: attTypeId,
      attributes: [
        {
          attributeName: item.attribute_name || '',
          variations:
            Array.isArray(item.variation) && item.variation.length > 0
              ? item.variation //  Now correctly using `variation`
              : [], // Default empty if missing
        },
      ],
      editData: { ...item, att_id: attId },
    })
  }

  handleUpdate = async () => {
    const { editData, attType, attributes } = this.state
    const shopId = localStorage.getItem('shop_id')

    if (!editData || !editData.att_id) {
      alert('No valid item selected for update.')
      return
    }

    // Construct the payload with `att_id` for the attribute
    const payload = {
      att_id: editData.att_id, // The ID of the attribute group to update
      att_type: attType, // Attribute type (e.g., "Automobiles")
      attribute_name: attributes[0].attributeName, // Use `att_id` for the attribute name
      variation:
        Array.isArray(attributes[0].variations) && attributes[0].variations.length > 0
          ? attributes[0].variations // ✅ Ensure variations are included
          : editData.variation || [], // ✅ Preserve existing variations if they exist

      shop: shopId, // Include shop ID
    }
    //console.log("Update Payload:", [attribute_name]);
    console.log('Update Payload:', JSON.stringify(payload))

    const response = await Network.put(
      `${Urls.updateVariationGroup}${shopId}/${editData.att_id}`,
      JSON.stringify(payload),
    )
    if (!response.ok) return consoe.log(response.data.error)
    toast.success('Attribute updated successfully!')

    this.setState({
      editData: null,
      attType: '',
      attributes: [{ attributeName: '', variations: [] }],
    })
    this.fetchData()
    this.variationGroups()
  }

  handleDelete = async (attId) => {
    const shopId = localStorage.getItem('shop_id')
    const response = await Network.delete(`${Urls.updateVariationGroup}${shopId}/${attId}`)
    if (!response.ok) return console.log(response.data.error)
    toast.success('Attribute deleted successfully!')
    this.setState({
      editData: null,
      attType: '',
      attributes: [{ attributeName: '', variations: [] }],
    })
    this.fetchData()
    this.variationGroups()
  }

  render() {
    const { apiData, attributes, attType, editData } = this.state

    return (
      <div className="add-att-container">
        <h2 style={{ textAlign: 'center' }}>
          {this.state.editData ? 'Edit Attributes' : 'Add Attributes '}
        </h2>
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

        {/* Attribute Type Dropdown */}
        <div className="attribute-container">
          <label htmlFor="attType">Attribute Type</label>
          <div className="input-button-container">
            <select
              name="attType"
              id="attType"
              value={attType}
              onChange={(e) => this.setState({ attType: e.target.value })}
              style={{
                marginRight: '10px',
                width: '100%',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              <option value="">Select Attribute Type</option>
              {this.state.attributeTypes?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.att_type}
                </option>
              ))}
            </select>

            <Link to="/Product/AddAttributeType">
              <button style={{ padding: '5px 10px', cursor: 'pointer' }}>+</button>
            </Link>
          </div>
        </div>

        {/* Attribute Groups */}
        {attributes.map((attribute, attrIndex) => (
          <div key={attrIndex} className="attribute-container">
            {/* Attribute Group Label and Input */}
            <label htmlFor={`attributeName-${attrIndex}`}>Attribute Group {attrIndex + 1}</label>
            <div className="input-button-container">
              <input
                type="text"
                name="attributeName"
                id={`attributeName-${attrIndex}`}
                placeholder={`Attribute Group ${attrIndex + 1}`}
                value={attribute.attributeName}
                onChange={(e) => this.handleInputChange(e, attrIndex)}
                onKeyPress={(e) => this.handleKeyPress(e, attrIndex)}
              />

              {/* Buttons for adding and removing attribute groups */}

              {attrIndex === attributes.length - 1 && !editData && (
                <button className="add-attribute-button" onClick={this.addAttribute}>
                  + Add Attribute
                </button>
              )}

              {/* Red Cross Button to Remove Attribute */}
              {attributes.length > 1 && (
                <button
                  className="remove-attribute-button"
                  onClick={() => this.removeAttribute(attrIndex)}
                >
                  &times;
                </button>
              )}
            </div>

            {/* Attribute Variations */}
            <div className="variation-container">
              {attribute.variations.map((variation, varIndex) => (
                <div key={varIndex} className="input-button-container">
                  {/* Variation Input */}

                  <input
                    type="text"
                    id={`variation-${attrIndex}-${varIndex}`}
                    placeholder={`Attribute ${varIndex + 1}`}
                    value={variation}
                    onChange={(e) => this.handleVariationChange(e, attrIndex, varIndex)}
                  />

                  {/* Buttons to Add/Remove Variations */}
                  {attribute.variations.length > 1 && (
                    <button
                      className="remove-variation-button"
                      onClick={() => this.removeVariation(attrIndex, varIndex)}
                    >
                      &times;
                    </button>
                  )}

                  {/* Add Variation Button */}
                  {varIndex === attribute.variations.length - 1 && (
                    <button
                      className="add-variation-button"
                      onClick={() => this.addVariation(attrIndex)}
                    >
                      + Add Attribute
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'left', marginTop: '-20px', marginBottom: '-20px' }}>
          {editData ? (
            <button
              className="Add-button-att"
              onClick={this.handleUpdate}
              style={{ marginTop: '20px' }}
            >
              Update
            </button>
          ) : (
            <button
              className="Add-button-att"
              onClick={this.handleSubmit}
              style={{ marginTop: '20px' }}
            >
              Submit
            </button>
          )}
        </div>

        <h4 style={{ marginTop: '20px', marginBottom: '-5px' }}>Attribute Groups</h4>
        <div className="table-container">
          <table border="1" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Attribute ID</th>
                <th>Attribute Type</th>
                <th>Attribute Group</th>
                <th>Attribute</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiData.map((item, index) => (
                <tr key={index}>
                  <td>{item.att_id}</td>
                  <td>{item.att_type}</td>
                  <td>{item.attribute_name}</td>
                  <td>
                    {console.log('📊 Table Row Data:', item)}
                    {Array.isArray(item.variation) && item.variation.length > 0
                      ? item.variation.join(', ') // Updated to use `variation`
                      : 'No Variations'}
                  </td>

                  <td>
                    <button className="E-button-att" onClick={() => this.handleEdit(item)}>
                      Edit
                    </button>
                    <button className="D-button-att" onClick={() => this.handleDelete(item.att_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default AddAtt
