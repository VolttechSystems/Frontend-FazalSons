import React, { Component } from 'react'
import './AddAtt.css'
import Select from 'react-select'

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
    const response = await Network.get(Urls.addAttributeTypes)
    if (!response.ok) return console.log(response.data.error)
    this.setState({ attributeTypes: response.data })
  }

  fetchData = async () => {
    const response = await Network.get(Urls.variationGroup)
    if (!response.ok) return console.log(response.data.error)
    this.setState({ apiData: response.data })
  }

  // Function to fetch attribute types from the API
  variationGroups = async () => {
    // try {
    //   const response = await axios.get('http://195.26.253.123/pos/products/add_attribute_type');
    //   setTypes(response.data); // Assuming the response data is an array of attribute types
    // } catch (error) {
    //   console.error('Error fetching attribute types:', error);
    // }
    const response = await Network.get(Urls.variationGroup)
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

    const payload = attributes.map((attribute) => ({
      att_type: attType,
      attribute_name: attribute.attributeName,
      variation: attribute.variations,
    }))

    try {
      const response = await Network.post(Urls.addAttributes, payload)

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

    this.setState({
      attType: item.att_type || '',
      attType: attTypeId,
      attributes: [
        {
          attributeName: item.attribute_name || '',
          variations: item.variation || [],
        },
      ],
      editData: { ...item, att_id: attId },
    })
  }

  handleUpdate = async () => {
    const { editData, attType, attributes } = this.state

    if (!editData || !editData.att_id) {
      alert('No valid item selected for update.')
      return
    }

    // Construct the payload with `att_id` for the attribute
    const payload = {
      att_id: editData.att_id, // The ID of the attribute group to update
      att_type: attType, // Attribute type (e.g., "Automobiles")
      attribute_name: attributes[0].attributeName, // Use `att_id` for the attribute name
      variation_name: attributes[0].variations, // List of variations (e.g., ["ABC", "DEF"])
    }
    //console.log("Update Payload:", [attribute_name]);
    console.log('Update Payload:', JSON.stringify(payload))

    // try {
    //   const response = await fetch(
    //     `http://195.26.253.123/pos/products/action_variations_group/${editData.att_id}`,
    //     {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(payload),
    //     },
    //   )

    //   const result = await response.json()
    //   if (response.ok) {
    //     alert('Data successfully updated!')
    //     this.fetchData() // Refresh data after the update
    //     this.setState({
    //       editData: null,
    //       attType: '',
    //       attributes: [{ attributeName: '', variations: [] }],
    //     })
    //     console.log(result)
    //   } else {
    //     alert('Failed to update data')
    //     console.log(result)
    //   }
    // } catch (error) {
    //   alert('Error updating data')
    //   console.log(error)
    // }

    const response = await Network.put(
      `${Urls.updateVariationGroup}${editData.att_id}`,
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
    const response = await Network.delete(`${Urls.updateVariationGroup}${attId}`)
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
      <div style={{ padding: '20px' }}>
        <h1>{editData ? 'Edit Attribute' : 'Add Attributes'}</h1>
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
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="attType" style={{ marginRight: '10px' }}>
            Attribute Type
          </label>
          {/* <select
            name="attType"
            id="attType"
            value={attType}
            onChange={(e) => this.setState({ attType: e.target.value })}
            style={{
              marginRight: '10px',
              width: '30%',
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
          </select> */}

          <Select
            name="attType"
            options={
              this.state.attributeTypes?.map((type) => ({
                value: type.id,
                label: type.att_type,
              })) || []
            } // Convert attributeTypes to value/label pairs
            value={
              this.state.attType
                ? {
                    value: this.state.attType,
                    label: this.state.attributeTypes?.find((type) => type.id === this.state.attType)
                      ?.att_type,
                  }
                : null
            } // Match the selected value
            onChange={
              (selectedOption) => this.setState({ attType: selectedOption?.value }) // Update the state when selection changes
            }
            placeholder="Select Attribute Type"
            styles={{
              container: (base) => ({
                ...base,
                marginRight: '10px',
                width: '30%',
              }),
              control: (base) => ({
                ...base,
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }),
            }}
          />
          <Link to="/Product/AddAttributeType">
            <button style={{ padding: '5px 10px', cursor: 'pointer' }}>+</button>
          </Link>
        </div>

        {/* Attribute Groups */}
        {attributes.map((attribute, attrIndex) => (
          <div key={attrIndex} style={{ marginBottom: '20px' }}>
            {/* Attribute Group Label and Input */}
            <label htmlFor={`attributeName-${attrIndex}`} style={{ marginRight: '10px' }}>
              Attribute Group {attrIndex + 1}
            </label>
            <input
              type="text"
              name="attributeName"
              id={`attributeName-${attrIndex}`}
              placeholder={`Attribute Group ${attrIndex + 1}`}
              value={attribute.attributeName}
              onChange={(e) => this.handleInputChange(e, attrIndex)}
              onKeyPress={(e) => this.handleKeyPress(e, attrIndex)}
              style={{
                marginRight: '10px',
                width: '30%',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />

            {/* Buttons for adding and removing attribute groups */}
            <div style={{ display: 'inline-block', marginLeft: '10px' }}>
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
                  style={{
                    color: 'red',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                  }}
                >
                  &times;
                </button>
              )}
            </div>

            {/* Attribute Variations */}
            <div style={{ marginLeft: '30px', marginTop: '10px' }}>
              {attribute.variations.map((variation, varIndex) => (
                <div
                  key={varIndex}
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {/* Variation Input */}
                  <label
                    htmlFor={`variation-${attrIndex}-${varIndex}`}
                    style={{ marginRight: '10px' }}
                  >
                    Attribute {varIndex + 1}
                  </label>
                  <input
                    type="text"
                    id={`variation-${attrIndex}-${varIndex}`}
                    placeholder={`Attribute ${varIndex + 1}`}
                    value={variation}
                    onChange={(e) => this.handleVariationChange(e, attrIndex, varIndex)}
                    style={{ marginRight: '10px', width: '25%' }}
                  />

                  {/* Buttons to Add/Remove Variations */}
                  <div
                    className="variation-actions-container"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    {/* Remove Variation Button */}
                    {attribute.variations.length > 1 && (
                      <button
                        className="remove-variation-button"
                        onClick={() => this.removeVariation(attrIndex, varIndex)}
                        style={{ marginLeft: '10px' }}
                      >
                        &times;
                      </button>
                    )}

                    {/* Add Variation Button */}
                    {varIndex === attribute.variations.length - 1 && (
                      <button
                        className="add-variation-button"
                        onClick={() => this.addVariation(attrIndex)}
                        style={{ marginLeft: '10px' }}
                      >
                        + Add Attribute
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          {editData ? (
            <button onClick={this.handleUpdate} style={{ marginTop: '20px' }}>
              Update
            </button>
          ) : (
            <button onClick={this.handleSubmit} style={{ marginTop: '20px' }}>
              Submit
            </button>
          )}
        </div>

        <h2 style={{ marginTop: '40px' }}>Attribute Groups</h2>
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
                  {Array.isArray(item.variation) ? item.variation.join(', ') : 'No Variations'}
                </td>

                <td>
                  <button onClick={() => this.handleEdit(item)}>Edit</button>
                  <button onClick={() => this.handleDelete(item.att_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default AddAtt
