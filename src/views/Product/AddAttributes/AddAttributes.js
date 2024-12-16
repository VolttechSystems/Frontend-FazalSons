

// import React, { useState, useEffect } from 'react';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CForm,
//   CFormCheck,
//   CFormInput,
//   CFormLabel,
//   CRow,
//   CFormSelect,
// } from '@coreui/react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import axios from 'axios';

// const AddAttribute = () => {
//   const [attributeTypes, setAttributeTypes] = useState([]);
//   const [attribute, setAttribute] = useState({
//     attribute_name: '',
//     symbol: '',
//     description: '',
//     status: 'active',
//     att_type: '',
//   });
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchAttributeTypes = async () => {
//       try {
//         const response = await axios.get('http://16.170.232.76/pos/products/add_attribute_type');
//         setAttributeTypes(response.data);
//       } catch (error) {
//         console.error('Error fetching attribute types:', error);
//         setErrorMessage('Failed to fetch attribute types.');
//       }
//     };

//     const fetchAttributeDetails = async () => {
//       if (id) {
//         try {
//           const response = await axios.get(`http://16.170.232.76/pos/products/action_attributes/${id}/`);
//           setAttribute(response.data);
//         } catch (error) {
//           console.error('Error fetching attribute details:', error);
//           setErrorMessage('Failed to fetch attribute details.');
//         }
//       }
//     };

//     fetchAttributeTypes();
//     fetchAttributeDetails();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (id) {
//         await axios.put(`http://16.170.232.76/pos/products/action_attributes/${id}/`, attribute);
//         alert('Attribute updated successfully!');
//       } else {
//         await axios.post('http://16.170.232.76/pos/products/add_attribute', attribute);
//         alert('Attribute added successfully!');
//       }
//       navigate('/Product/Attributes');
//     } catch (error) {
//       console.error('Error saving attribute:', error);
//       setErrorMessage('Error saving attribute. Please try again.');
//     }
//   };

//   const handleCreateAttributeType = () => {
//     navigate('/Product/AddAttributeType');
//   };

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>{id ? 'Edit Attribute' : 'Add Attribute'}</strong>
//             <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//               <Link to="/Product/Attributes">
//                 <CButton color="primary">Attributes</CButton>
//               </Link>
//             </div>
//           </CCardHeader>
//           <CCardBody>
//             {errorMessage && <p className="text-danger">{errorMessage}</p>}
//             <CForm onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <CFormLabel htmlFor="attribute_name">Attribute Name</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   id="attribute_name"
//                   value={attribute.attribute_name}
//                   onChange={(e) => setAttribute({ ...attribute, attribute_name: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel htmlFor="symbol">Short Form/Symbol</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   id="symbol"
//                   value={attribute.symbol}
//                   onChange={(e) => setAttribute({ ...attribute, symbol: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel htmlFor="description">Description</CFormLabel>
//                 <CFormInput
//                   type="text"
//                   id="description"
//                   value={attribute.description}
//                   onChange={(e) => setAttribute({ ...attribute, description: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <CFormLabel htmlFor="att_type">Attribute Type</CFormLabel>
//                 <CFormSelect
//                   id="att_type"
//                   value={attribute.att_type}
//                   onChange={(e) => setAttribute({ ...attribute, att_type: e.target.value })}
//                   required
//                 >
//                   <option value="">Select Attribute Type</option>
//                   {attributeTypes.map((type) => (
//                     <option key={type.id} value={type.type_name}>
//                       {type.type_name}
//                     </option>
//                   ))}
//                 </CFormSelect>
//                 <CButton color="info" className="ms-2" onClick={handleCreateAttributeType}>
//                   +
//                 </CButton>
//               </div>
//               <div className="mb-3">
//                 <CFormLabel>Status</CFormLabel>
//                 <div>
//                   <CFormCheck
//                     type="radio"
//                     name="status"
//                     id="status-active"
//                     label="Active"
//                     value="active"
//                     checked={attribute.status === 'active'}
//                     onChange={() => setAttribute({ ...attribute, status: 'active' })}
//                   />
//                   <CFormCheck
//                     type="radio"
//                     name="status"
//                     id="status-inactive"
//                     label="Inactive"
//                     value="inactive"
//                     checked={attribute.status === 'inactive'}
//                     onChange={() => setAttribute({ ...attribute, status: 'inactive' })}
//                   />
//                   <CFormCheck
//                     type="radio"
//                     name="status"
//                     id="status-pending"
//                     label="Pending"
//                     value="pending"
//                     checked={attribute.status === 'pending'}
//                     onChange={() => setAttribute({ ...attribute, status: 'pending' })}
//                   />
//                 </div>
//               </div>
//               <CButton type="submit" color="primary">
//                 {id ? 'Update Attribute' : 'Add Attribute'}
//               </CButton>
//               <Link to="/Product/Attributes" className="btn btn-secondary ms-2">
//                 Cancel
//               </Link>
//             </CForm>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   );
// };

// export default AddAttribute;


import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
} from '@coreui/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
const Loader = () => {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

const AddAttribute = () => {
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [attributeName, setAttributeName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [attType, setAttType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchAttributeTypes = async () => {
      try {
        const response = await axios.get('http://195.26.253.123/pos/products/add_attribute_type');
        setAttributeTypes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attribute types:', error);
        setErrorMessage('Failed to fetch attribute types.');
        setLoading(false);
      }
    };

    const fetchAttributeDetails = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://195.26.253.123/pos/products/action_attributes/${id}/`);
          const data = response.data;
          setAttributeName(data.attribute_name);
          setSymbol(data.symbol);
          setDescription(data.description);
          setStatus(data.status);
          setAttType(data.att_type);
        } catch (error) {
          console.error('Error fetching attribute details:', error);
          setErrorMessage('Failed to fetch attribute details.');
        }
      }
    };

    fetchAttributeTypes();
    fetchAttributeDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const attributeData = {
      attribute_name: attributeName,
      symbol: symbol,
      description: description,
      status: status,
      att_type: attType,
    };

    try {
      if (id) {
        await axios.put(`http://195.26.253.123/pos/products/action_attributes/${id}/`, attributeData);
        alert('Attribute updated successfully!');
      } else {
        await axios.post('http://195.26.253.123/pos/products/add_attribute', attributeData);
        alert('Attribute added successfully!');
      }

      navigate('/Product/Attributes');
    } catch (error) {
      console.error('There was an error saving the attribute!', error);
      setErrorMessage('Error saving attribute. Please try again.');
    }
  };


  const handleAddAttributeType = () => {
    navigate('/Product/AddAttributeType');
  };


  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{id ? 'Edit Attribute' : 'Add Attribute'}</strong>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/Product/Attributes">
                <CButton color="primary">Attributes</CButton>
              </Link>
            </div>
          </CCardHeader>
          <CCardBody>
            {loading && <Loader/>}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="attribute_name">Attribute Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="attribute_name"
                  value={attributeName}
                  onChange={(e) => setAttributeName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="symbol">Short Form/Symbol</CFormLabel>
                <CFormInput
                  type="text"
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormInput
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="att_type">Attribute Type</CFormLabel>
                <CFormSelect
                  id="att_type"
                  value={attType}
                  onChange={(e) => setAttType(e.target.value)}
                  required
                >
                  <option value="">Select Attribute Type</option>
                  {attributeTypes.map((type) => (
                    <option key={type.id} value={type.att_type}>
                      {type.att_type}
                    </option>
                  ))}
                </CFormSelect>
                <CButton color="primary" onClick={handleAddAttributeType} className="ms-2"> + </CButton>
              </div>
              <div className="mb-3">
                <CFormLabel>Status</CFormLabel>
                <div>
                  <CFormCheck
                    type="radio"
                    name="status"
                    id="status-active"
                    label="Active"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                  />
                  <CFormCheck
                    type="radio"
                    name="status"
                    id="status-inactive"
                    label="Inactive"
                    value="inactive"
                    checked={status === 'inactive'}
                    onChange={() => setStatus('inactive')}
                  />
                  <CFormCheck
                    type="radio"
                    name="status"
                    id="status-pending"
                    label="Pending"
                    value="pending"
                    checked={status === 'pending'}
                    onChange={() => setStatus('pending')}
                  />
                </div>
              </div>
              <CButton type="submit" color="primary">
                {id ? 'Update Attribute' : 'Add Attribute'}
              </CButton>
              <Link to="/Product/Attributes" className="btn btn-secondary ms-2">
                Cancel
              </Link>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddAttribute;
