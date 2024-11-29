

import React, { Component } from "react";
import "./AddAtt.css";
import {
  CButton,
} from '@coreui/react';
import { Link } from 'react-router-dom';

class AddAtt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attType: "",
      attributes: [
        {
          attributeName: "",
          variations: [],
        },
      ],
      apiData: [],
      editData: null, // Holds data for editing
    };
  }

  componentDidMount() {
    this.fetchData();
    this.fetchAttributeTypes(); // Fetch attribute types for the dropdown
  }
  
  fetchAttributeTypes = async () => {
    try {
      const response = await fetch(
        "http://16.171.145.107/pos/products/add_attribute_type"
      );
      const result = await response.json();
      if (response.ok) {
        this.setState({ attributeTypes: result }); // Store the attribute types
      } else {
        alert("Failed to fetch attribute types");
        console.log(result);
      }
    } catch (error) {
      alert("Error fetching attribute types");
      console.log(error);
    }
  };
  

  fetchData = async () => {
    try {
      const response = await fetch(
        "http://16.171.145.107/pos/products/variation_group/"
      );
      const result = await response.json();
      if (response.ok) {
        this.setState({ apiData: result });
      } else {
        alert("Failed to fetch data from the API");
        console.log(result);
      }
    } catch (error) {
      alert("Error fetching data from the API");
      console.log(error);
    }
  };

  handleInputChange = (e, attrIndex = null) => {
    const { name, value } = e.target;
    if (name === "attType") {
      this.setState({ attType: value });
    } else if (name === "attributeName") {
      const updatedAttributes = [...this.state.attributes];
      updatedAttributes[attrIndex].attributeName = value;
      this.setState({ attributes: updatedAttributes });
    }
  };

  handleKeyPress = (e, attrIndex) => {
    if (e.key === "Enter") {
      const updatedAttributes = [...this.state.attributes];
      updatedAttributes[attrIndex].variations.push("");
      this.setState({ attributes: updatedAttributes });
    }
  };

  addVariation = (attrIndex) => {
    const updatedAttributes = [...this.state.attributes];
    updatedAttributes[attrIndex].variations.push("");
    this.setState({ attributes: updatedAttributes });
  };

  removeVariation = (attrIndex, varIndex) => {
    const updatedAttributes = [...this.state.attributes];
    updatedAttributes[attrIndex].variations.splice(varIndex, 1); // Remove the variation
    this.setState({ attributes: updatedAttributes });
  };
  
  removeAttribute = (attrIndex) => {
    this.setState((prevState) => ({
      attributes: prevState.attributes.filter((_, index) => index !== attrIndex),
    }));
  };
  

  addAttribute = () => {
    this.setState((prevState) => ({
      attributes: [
        ...prevState.attributes,
        { attributeName: "", variations: [] },
      ],
    }));
  };

  handleVariationChange = (e, attrIndex, varIndex) => {
    const { value } = e.target;
    const updatedAttributes = [...this.state.attributes];
    updatedAttributes[attrIndex].variations[varIndex] = value;
    this.setState({ attributes: updatedAttributes });
  };

  handleSubmit = async () => {
    const { attType, attributes } = this.state;

    const payload = attributes.map((attribute) => ({
      att_type: attType,
      attribute_name: attribute.attributeName,
      variation: attribute.variations,
    }));

    try {
      const response = await fetch(
        "http://16.171.145.107/pos/products/variation_group/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Data successfully submitted!");
        this.fetchData();
        console.log(result);
      } else {
        alert("Failed to submit data");
        console.log(result);
      }
    } catch (error) {
      alert("Error submitting data");
      console.log(error);
    }
  };

  handleEdit = (item) => {
    const attId = item.att_id;
    if (!attId) {
      alert("The selected item does not have a valid ID for editing.");
      return;
    }

    // Find the ID of the attribute type from the attributeTypes array
  const selectedAttributeType = this.state.attributeTypes.find(
    (type) => type.att_type === item.att_type
  );

  const attTypeId = selectedAttributeType ? selectedAttributeType.id : "";


    this.setState({
      attType: item.att_type || "",
      attType: attTypeId,
      attributes: [
        {
          attributeName: item.attribute_name || "",
          variations: item.variation || [],
        },
      ],
      editData: { ...item, att_id: attId },
    });
  };

  

  handleUpdate = async () => {
    const { editData, attType, attributes } = this.state;
  
    if (!editData || !editData.att_id) {
      alert("No valid item selected for update.");
      return;
    }
  
    // Construct the payload with `att_id` for the attribute
    const payload = {
      att_id: editData.att_id, // The ID of the attribute group to update
      att_type: attType,       // Attribute type (e.g., "Automobiles")
      attribute_name: editData.attribute_name, // Use `att_id` for the attribute name
      variation_name: attributes[0].variations, // List of variations (e.g., ["ABC", "DEF"])
    };
  
    console.log("Update Payload:", JSON.stringify(payload));
  
    try {
      const response = await fetch(
        `http://16.171.145.107/pos/products/action_variations_group/${editData.att_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      const result = await response.json();
      if (response.ok) {
        alert("Data successfully updated!");
        this.fetchData(); // Refresh data after the update
        this.setState({
          editData: null,
          attType: "",
          attributes: [{ attributeName: "", variations: [] }],
        });
        console.log(result);
      } else {
        alert("Failed to update data");
        console.log(result);
      }
    } catch (error) {
      alert("Error updating data");
      console.log(error);
    }
  };
  

  handleDelete = async (attId) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://16.171.145.107/pos/products/action_variations_group/${attId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Data successfully deleted!");
        // Remove the deleted item from the apiData state
        this.setState((prevState) => ({
          apiData: prevState.apiData.filter(item => item.att_id !== attId)
        }));
        console.log(result);
      } else {
        alert("Failed to delete data");
        console.log(result);
      }
    } catch (error) {
      alert("Error deleting data");
      console.log(error);
    }
  };

  // handleAddAttributeType = () => {
  //   navigate('/Product/AddAttributeType');
  // };

  

  render() {
    const { apiData, attributes, attType, editData } = this.state;

    return (
      <div style={{ padding: "20px" }}>
        <h1>{editData ? "Edit Attribute" : "Add Attributes"}</h1>

        <div style={{ marginBottom: "20px" }}>
  <label htmlFor="attType" style={{ marginRight: "10px" }}>
    Attribute Type
  </label>
  <select
    name="attType"
    id="attType"
    value={attType}
    onChange={(e) => this.setState({ attType: e.target.value })}
    style={{ marginRight: "10px", width: "30%" }}
  >
    <option value="">Select Attribute Type</option>
    {this.state.attributeTypes?.map((type) => (
      <option key={type.id} value={type.id}>
        {type.att_type}
      </option>
    ))}
  </select>
  
  <Link to="/Product/AddAttributeType">
        <button>+</button>
      </Link>
</div>


{attributes.map((attribute, attrIndex) => (
  <div key={attrIndex} style={{ marginBottom: "20px" }}>
    {/* Attribute Group Label and Input */}
    <label
      htmlFor={`attributeName-${attrIndex}`}
      style={{ marginRight: "10px" }}
    >
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
      style={{ marginRight: "10px", width: "30%" }}
    />

    {/* Buttons for adding and removing attribute groups */}
    <div style={{ display: "inline-block", marginLeft: "10px" }}>
      {attrIndex === attributes.length - 1 && !editData && (
        <button
          className="add-attribute-button"
          onClick={this.addAttribute}
          style={{ marginRight: "5px" }}
        >
          + Add Attribute
        </button>
      )}

      {/* Red Cross Button to Remove Attribute */}
      {attributes.length > 1 && (
        <button
          className="remove-attribute-button"
          onClick={() => this.removeAttribute(attrIndex)}
          style={{
            color: "red",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          &times;
        </button>
      )}
    </div>

    {/* Attribute Variations */}
    <div style={{ marginLeft: "30px", marginTop: "10px" }}>
      {attribute.variations.map((variation, varIndex) => (
        <div
          key={varIndex}
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Variation Input */}
          <label
            htmlFor={`variation-${attrIndex}-${varIndex}`}
            style={{ marginRight: "10px" }}
          >
            Attribute {varIndex + 1}
          </label>
          <input
            type="text"
            id={`variation-${attrIndex}-${varIndex}`}
            placeholder={`Attribute ${varIndex + 1}`}
            value={variation}
            onChange={(e) =>
              this.handleVariationChange(e, attrIndex, varIndex)
            }
            style={{ marginRight: "10px", width: "25%" }}
          />

          {/* Buttons to Add/Remove Variations */}
          <div
            className="variation-actions-container"
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* Remove Variation Button */}
            {attribute.variations.length > 1 && (
              <button
                className="remove-variation-button"
                onClick={() => this.removeVariation(attrIndex, varIndex)}
                style={{ marginLeft: "10px" }}
              >
                &times;
              </button>
            )}

            {/* Add Variation Button */}
            {varIndex === attribute.variations.length - 1 && (
              <button
                className="add-variation-button"
                onClick={() => this.addVariation(attrIndex)}
                style={{ marginLeft: "10px" }}
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
            <button onClick={this.handleUpdate} style={{ marginTop: "20px" }}>
              Update
            </button>
          ) : (
            <button onClick={this.handleSubmit} style={{ marginTop: "20px" }}>
              Submit
            </button>
          )}
        </div>

        <h2 style={{ marginTop: "40px" }}>Attribute Groups</h2>
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
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
  {Array.isArray(item.variation) ? item.variation.join(", ") : "No Variations"}
</td>

                <td>
                  <button onClick={() => this.handleEdit(item)}>Edit</button>
                  <button
                    onClick={() => this.handleDelete(item.att_id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default AddAtt;
