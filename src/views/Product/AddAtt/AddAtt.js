// import React, { Component } from "react";
// import "./AddAtt.css";

// class AddAtt extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       attType: "", 
//       attributes: [
//         {
//           attributeName: "", // Attribute name (e.g., Attribute 1, Attribute 2)
//           variations: [], // Variations for the specific attribute
//         },
//       ],
//     };
//   }

//   // Handle input change for Attribute Type or Attribute Name
//   handleInputChange = (e, attrIndex = null) => {
//     const { name, value } = e.target;
//     if (name === "attType") {
//       // Update Attribute Type
//       this.setState({ attType: value });
//     } else if (name === "attributeName") {
//       // Update Attribute Name
//       const updatedAttributes = [...this.state.attributes];
//       updatedAttributes[attrIndex].attributeName = value;
//       this.setState({ attributes: updatedAttributes });
//     }
//   };

//   // Handle Enter Key to add the first variation
//   handleKeyPress = (e, attrIndex) => {
//     if (e.key === "Enter") {
//       const updatedAttributes = [...this.state.attributes];
//       updatedAttributes[attrIndex].variations.push(""); // Add an empty variation
//       this.setState({ attributes: updatedAttributes });
//     }
//   };

//   // Add a new variation for a specific attribute
//   addVariation = (attrIndex) => {
//     const updatedAttributes = [...this.state.attributes];
//     updatedAttributes[attrIndex].variations.push(""); // Add an empty variation
//     this.setState({ attributes: updatedAttributes });
//   };

//   // Add a new attribute
//   addAttribute = () => {
//     this.setState((prevState) => ({
//       attributes: [
//         ...prevState.attributes,
//         { attributeName: "", variations: [] }, // New attribute with no variations
//       ],
//     }));
//   };

//   // Handle input change for variations
//   handleVariationChange = (e, attrIndex, varIndex) => {
//     const { value } = e.target;
//     const updatedAttributes = [...this.state.attributes];
//     updatedAttributes[attrIndex].variations[varIndex] = value; // Update specific variation
//     this.setState({ attributes: updatedAttributes });
//   };

//   render() {
//     return (
//       <div style={{ padding: "20px" }}>
//         <h1>Add Attributes</h1>

//         {/* Attribute Type */}
//         <div style={{ marginBottom: "20px" }}>
//           <input
//             type="text"
//             name="attType"
//             placeholder="Attribute Type (e.g., Groceries)"
//             value={this.state.attType}
//             onChange={this.handleInputChange}
//             style={{ marginRight: "10px", width: "30%" }}
//           />
//         </div>

//         {/* Attributes */}
//         {this.state.attributes.map((attribute, attrIndex) => (
//           <div key={attrIndex} style={{ marginBottom: "20px" }}>
//             {/* Attribute Name */}
//             <input
//               type="text"
//               name="attributeName"
//               placeholder={`Attribute ${attrIndex + 1}`}
//               value={attribute.attributeName}
//               onChange={(e) => this.handleInputChange(e, attrIndex)}
//               onKeyPress={(e) => this.handleKeyPress(e, attrIndex)}
//               style={{ marginRight: "10px", width: "30%" }}
//             />

//             {/* Add New Attribute Button */}
//             {attrIndex === this.state.attributes.length - 1 && (
//               <button onClick={this.addAttribute}>+ Add Attribute</button>
//             )}

//             {/* Variations */}
//             <div style={{ marginLeft: "30px", marginTop: "10px" }}>
//               {attribute.variations.map((variation, varIndex) => (
//                 <div key={varIndex} style={{ marginBottom: "10px" }}>
//                   <input
//                     type="text"
//                     placeholder={`Variation ${varIndex + 1}`}
//                     value={variation}
//                     onChange={(e) =>
//                       this.handleVariationChange(e, attrIndex, varIndex)
//                     }
//                     style={{ marginRight: "10px", width: "25%" }}
//                   />
//                   {/* Add Variation Button */}
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
      attType: "", // Attribute Type input
      attributes: [ // List of attributes with variations
        {
          attributeName: "",
          variations: [],
        },
      ],
      tableData: [], // Data to be displayed in the table
    };
  }

  // Fetch existing attribute variations on component mount
  componentDidMount() {
    this.handleGetData();
  }

  // Fetch data from API and update table
  handleGetData = async () => {
    try {
      const response = await fetch('http://16.171.145.107/pos/products/variation_group/');
      const result = await response.json();
      if (response.ok) {
        this.setState({ tableData: result });
      } else {
        alert("Failed to fetch data");
        console.log(result);
      }
    } catch (error) {
      alert("Error fetching data");
      console.log(error);
    }
  };

  // Handle input change for Attribute Type or Attribute Name
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

  // Handle pressing Enter to add new variations
  handleKeyPress = (e, attrIndex) => {
    if (e.key === "Enter") {
      const updatedAttributes = [...this.state.attributes];
      updatedAttributes[attrIndex].variations.push(""); // Add an empty variation
      this.setState({ attributes: updatedAttributes });
    }
  };

  // Add a new variation for a specific attribute
  addVariation = (attrIndex) => {
    const updatedAttributes = [...this.state.attributes];
    updatedAttributes[attrIndex].variations.push(""); // Add an empty variation
    this.setState({ attributes: updatedAttributes });
  };

  // Add new attribute to the list
  addAttribute = () => {
    this.setState((prevState) => ({
      attributes: [
        ...prevState.attributes,
        { attributeName: "", variations: [] }, // New attribute with no variations
      ],
    }));
  };

  // Handle input change for variations
  handleVariationChange = (e, attrIndex, varIndex) => {
    const { value } = e.target;
    const updatedAttributes = [...this.state.attributes];
    updatedAttributes[attrIndex].variations[varIndex] = value; // Update specific variation
    this.setState({ attributes: updatedAttributes });
  };

  // Handle form submission to send data to API
  handleSubmit = async () => {
    console.log("Submitting data...");  // Add this to verify if the method is triggered
    const { attType, attributes } = this.state;

    // Prepare payload data for the API
    const payload = attributes.flatMap(attribute =>
      attribute.variations.map(variation => ({
        att_type: attType,
        attribute_name: attribute.attributeName,
        variation_name: variation,
      }))
    );

    console.log(payload);  // Log the payload to ensure it's correctly prepared

    try {
      const response = await fetch('http://16.171.145.107/pos/products/variation_group/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Data successfully submitted!");
        console.log(result);

        // Add the newly submitted data to the table
        const updatedTableData = [...this.state.tableData, ...payload];
        this.setState({ tableData: updatedTableData });
      } else {
        alert("Failed to submit data");
        console.log(result);
      }
    } catch (error) {
      alert("Error submitting data");
      console.log(error);
    }
  };

  render() {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Add Attributes</h1>

        {/* Attribute Type */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="attType" style={{ marginRight: "10px" }}>Attribute Type</label>
          <input
            type="text"
            name="attType"
            id="attType"
            placeholder="Attribute Type (e.g., Groceries)"
            value={this.state.attType}
            onChange={this.handleInputChange}
            style={{ marginRight: "10px", width: "30%" }}
          />
        </div>

        {/* Attributes */}
        {this.state.attributes.map((attribute, attrIndex) => (
          <div key={attrIndex} style={{ marginBottom: "20px" }}>
            {/* Attribute Name */}
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

            {/* Add New Attribute Button */}
            {attrIndex === this.state.attributes.length - 1 && (
              <button onClick={this.addAttribute}>+ Add Attribute Group</button>
            )}

            {/* Variations */}
            <div style={{ marginLeft: "30px", marginTop: "10px" }}>
              {attribute.variations.map((variation, varIndex) => (
                <div key={varIndex} style={{ marginBottom: "10px" }}>
                  <label htmlFor={`variation-${attrIndex}-${varIndex}`} style={{ marginRight: "10px" }}>
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
                  {/* Add Variation Button */}
                  {varIndex === attribute.variations.length - 1 && (
                    <button onClick={() => this.addVariation(attrIndex)}>
                      + Add Attribute
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div>
          <button onClick={this.handleSubmit} style={{ marginTop: "20px" }}>
            Submit
          </button>
        </div>

        {/* Table to display the data */}
        <div style={{ marginTop: "30px" }}>
          <h2>Attribute Variations</h2>
          <table border="1" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Attribute Type</th>
                <th>Attribute Name</th>
                <th>Variation Name</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tableData.map((data, index) => (
                <tr key={index}>
                  <td>{data.att_type}</td>
                  <td>{data.attribute_name}</td>
                  <td>{data.variation_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    );
  }
}

export default AddAtt;
