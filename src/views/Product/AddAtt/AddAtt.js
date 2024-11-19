

// import React, { Component } from "react";
// import "./AddAtt.css";

// class AddAtt extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       attType: "",
//       attributes: [
//         {
//           attributeName: "",
//           variations: [],
//         },
//       ],
//       apiData: [], // State to store fetched data from the API
//     };
//   }

//   componentDidMount() {
//     this.fetchData();
//   }

//   fetchData = async () => {
//     try {
//       const response = await fetch(
//         "http://16.171.145.107/pos/products/variation_group/"
//       );
//       const result = await response.json();
//       if (response.ok) {
//         this.setState({ apiData: result });
//       } else {
//         alert("Failed to fetch data from the API");
//         console.log(result);
//       }
//     } catch (error) {
//       alert("Error fetching data from the API");
//       console.log(error);
//     }
//   };

//   handleInputChange = (e, attrIndex = null) => {
//     const { name, value } = e.target;
//     if (name === "attType") {
//       this.setState({ attType: value });
//     } else if (name === "attributeName") {
//       const updatedAttributes = [...this.state.attributes];
//       updatedAttributes[attrIndex].attributeName = value;
//       this.setState({ attributes: updatedAttributes });
//     }
//   };

//   handleKeyPress = (e, attrIndex) => {
//     if (e.key === "Enter") {
//       const updatedAttributes = [...this.state.attributes];
//       updatedAttributes[attrIndex].variations.push(""); // Add an empty variation
//       this.setState({ attributes: updatedAttributes });
//     }
//   };

//   addVariation = (attrIndex) => {
//     const updatedAttributes = [...this.state.attributes];
//     updatedAttributes[attrIndex].variations.push(""); // Add an empty variation
//     this.setState({ attributes: updatedAttributes });
//   };

//   addAttribute = () => {
//     this.setState((prevState) => ({
//       attributes: [
//         ...prevState.attributes,
//         { attributeName: "", variations: [] }, // New attribute with no variations
//       ],
//     }));
//   };

//   handleVariationChange = (e, attrIndex, varIndex) => {
//     const { value } = e.target;
//     const updatedAttributes = [...this.state.attributes];
//     updatedAttributes[attrIndex].variations[varIndex] = value; // Update specific variation
//     this.setState({ attributes: updatedAttributes });
//   };

//   handleSubmit = async () => {
//     const { attType, attributes } = this.state;

//     const payload = attributes.map((attribute) => ({
//       att_type: attType,
//       attribute_name: attribute.attributeName,
//       variation: attribute.variations,
//     }));

//     try {
//       const response = await fetch(
//         "http://16.171.145.107/pos/products/variation_group/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );
//       const result = await response.json();
//       if (response.ok) {
//         alert("Data successfully submitted!");
//         this.fetchData(); // Refresh the data after submission
//         console.log(result);
//       } else {
//         alert("Failed to submit data");
//         console.log(result);
//       }
//     } catch (error) {
//       alert("Error submitting data");
//       console.log(error);
//     }
//   };

//   render() {
//     const { apiData, attributes, attType } = this.state;

//     return (
//       <div style={{ padding: "20px" }}>
//         <h1>Add Attributes</h1>

//         <div style={{ marginBottom: "20px" }}>
//           <label htmlFor="attType" style={{ marginRight: "10px" }}>
//             Attribute Type
//           </label>
//           <input
//             type="text"
//             name="attType"
//             id="attType"
//             placeholder="Attribute Type (e.g., Groceries)"
//             value={attType}
//             onChange={this.handleInputChange}
//             style={{ marginRight: "10px", width: "30%" }}
//           />
//         </div>

//         {attributes.map((attribute, attrIndex) => (
//           <div key={attrIndex} style={{ marginBottom: "20px" }}>
//             <label htmlFor={`attributeName-${attrIndex}`} style={{ marginRight: "10px" }}>
//               Attribute Group {attrIndex + 1}
//             </label>
//             <input
//               type="text"
//               name="attributeName"
//               id={`attributeName-${attrIndex}`}
//               placeholder={`Attribute Group ${attrIndex + 1}`}
//               value={attribute.attributeName}
//               onChange={(e) => this.handleInputChange(e, attrIndex)}
//               onKeyPress={(e) => this.handleKeyPress(e, attrIndex)}
//               style={{ marginRight: "10px", width: "30%" }}
//             />

//             {attrIndex === attributes.length - 1 && (
//               <button onClick={this.addAttribute}>+ Add Attribute</button>
//             )}

//             <div style={{ marginLeft: "30px", marginTop: "10px" }}>
//               {attribute.variations.map((variation, varIndex) => (
//                 <div key={varIndex} style={{ marginBottom: "10px" }}>
//                   <label
//                     htmlFor={`variation-${attrIndex}-${varIndex}`}
//                     style={{ marginRight: "10px" }}
//                   >
//                     Attribute {varIndex + 1}
//                   </label>
//                   <input
//                     type="text"
//                     id={`variation-${attrIndex}-${varIndex}`}
//                     placeholder={`Attribute ${varIndex + 1}`}
//                     value={variation}
//                     onChange={(e) =>
//                       this.handleVariationChange(e, attrIndex, varIndex)
//                     }
//                     style={{ marginRight: "10px", width: "25%" }}
//                   />
//                   {varIndex === attribute.variations.length - 1 && (
//                     <button onClick={() => this.addVariation(attrIndex)}>
//                       + Add Variation
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}

//         <div>
//           <button onClick={this.handleSubmit} style={{ marginTop: "20px" }}>
//             Submit
//           </button>
//         </div>

//         {/* Table to display data */}
//         <h2 style={{ marginTop: "40px" }}>Added Data</h2>
// <table border="1" style={{ width: "100%", textAlign: "left" }}>
//   <thead>
//     <tr>
//       <th>Attribute Type</th>
//       <th>Attribute Name</th>
//       <th>Variations</th>
//     </tr>
//   </thead>
//   <tbody>
//     {/* Group rows by att_type */}
//     {apiData.reduce((acc, item) => {
//       const lastGroup = acc[acc.length - 1];
//       if (lastGroup && lastGroup.att_type === item.att_type) {
//         lastGroup.items.push(item);
//       } else {
//         acc.push({ att_type: item.att_type, items: [item] });
//       }
//       return acc;
//     }, []).map((group, groupIndex) => (
//       group.items.map((item, itemIndex) => (
//         <tr key={`${groupIndex}-${itemIndex}`}>
//           {/* Add rowspan only for the first item in the group */}
//           {itemIndex === 0 && (
//             <td rowSpan={group.items.length}>{group.att_type || "N/A"}</td>
//           )}
//           <td>{item.attribute_name || "N/A"}</td>
//           <td>
//             {Array.isArray(item.variation_name) ? item.variation_name.join(", ") : "No Variations"}
//           </td>
//         </tr>
//       ))
//     ))}
//   </tbody>
// </table>

//       </div>
//     );
//   }
// }

// export default AddAtt;


import React, { Component } from "react";
import "./AddAtt.css";

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
  }

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

    this.setState({
      attType: item.att_type || "",
      attributes: [
        {
          attributeName: item.attribute_name || "",
          variations: item.variation_name || [],
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
  
    // Construct the payload to match API expectations
    const payload = {
      att_id: editData.att_id,  // The ID of the item to update
      att_type: attType,  // Attribute type (e.g., "Clothes")
      attribute_name: attributes[0].attributeName,  // Attribute name (e.g., "Mens Wear")
      variation_name: attributes[0].variations  // List of variations (e.g., ["shirt", "Coat"])
    };
  
    console.log("Update Payload:", payload);
  
    try {
      const response = await fetch(
        `http://16.171.145.107/pos/products/action_variations_group/${editData.att_id}/`,
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
        this.fetchData();  // Refresh the data after the update
        this.setState({ editData: null, attType: "", attributes: [{ attributeName: "", variations: [] }] });
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
        `http://16.171.145.107/pos/products/action_variations_group/${attId}/`,
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

  render() {
    const { apiData, attributes, attType, editData } = this.state;

    return (
      <div style={{ padding: "20px" }}>
        <h1>{editData ? "Edit Attribute" : "Add Attributes"}</h1>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="attType" style={{ marginRight: "10px" }}>
            Attribute Type
          </label>
          <input
            type="text"
            name="attType"
            id="attType"
            placeholder="Attribute Type (e.g., Groceries)"
            value={attType}
            onChange={this.handleInputChange}
            style={{ marginRight: "10px", width: "30%" }}
          />
        </div>

        {attributes.map((attribute, attrIndex) => (
          <div key={attrIndex} style={{ marginBottom: "20px" }}>
            <label htmlFor={`attributeName-${attrIndex}`} style={{ marginRight: "10px" }}>
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

            {attrIndex === attributes.length - 1 && !editData && (
              <button onClick={this.addAttribute}>+ Add Attribute</button>
            )}

            <div style={{ marginLeft: "30px", marginTop: "10px" }}>
              {attribute.variations.map((variation, varIndex) => (
                <div key={varIndex} style={{ marginBottom: "10px" }}>
                  <label
                    htmlFor={`variation-${attrIndex}-${varIndex}`}
                    style={{ marginRight: "10px" }}
                  >
                    Variation {varIndex + 1}
                  </label>
                  <input
                    type="text"
                    id={`variation-${attrIndex}-${varIndex}`}
                    placeholder={`Variation ${varIndex + 1}`}
                    value={variation}
                    onChange={(e) =>
                      this.handleVariationChange(e, attrIndex, varIndex)
                    }
                    style={{ marginRight: "10px", width: "25%" }}
                  />
                  {varIndex === attribute.variations.length - 1 && (
                    <button onClick={() => this.addVariation(attrIndex)}>
                      + Add Variation
                    </button>
                  )}
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
              <th>Attribute Name</th>
              <th>Variations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiData.map((item, index) => (
              <tr key={index}>
                <td>{item.att_id}</td>
                <td>{item.att_type}</td>
                <td>{item.attribute_name}</td>
                <td>{item.variation_name.join(", ")}</td>
                <td>
                  <button onClick={() => this.handleEdit(item)}>Edit</button>
                  <button onClick={() => this.handleDelete(item.att_id)} style={{ marginLeft: "10px" }}>
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
