import React from 'react'
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
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'
import { Link } from 'react-router-dom'; // Import Link here

const AddBrands = () => {
  return (
    <CRow>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
      
      <Link to="/Product/Brands">
      <CButton href="#" color="primary" className="me-md-2">Brands</CButton>
      </Link>
    
            </div>
      
      <CCol xs={12}>
        <CCard className="mb-3">
          <CCardHeader>
            <strong>Brand Information</strong>
          </CCardHeader>
          <CCardBody>
            
            
            <CForm>
  <CRow className="mb-3">
    <CFormLabel htmlFor="inputEmail3" className="col-sm-2 col-form-label">Brand *</CFormLabel>
    <CCol sm={8} >
      <CFormInput type="email" id="inputEmail3"/>
    </CCol>
  </CRow>
  <CRow className="mb-3">
    <CFormLabel htmlFor="inputPassword3" className="col-sm-2 col-form-label">Short Form/Symbol</CFormLabel>
    <CCol sm={8} >
      <CFormInput type="password" id="inputPassword3"/>
    </CCol>
  </CRow>
  <CRow className="mb-3">
    <CFormLabel htmlFor="inputDescription3" className="col-sm-2 col-form-label">Decsription</CFormLabel>
    <CCol sm={8} >
      <CFormInput type="text" id="description3"/>
    </CCol>
  </CRow>
  <fieldset className="row mb-3">
    <legend className="col-form-label col-sm-2 pt-0">Status</legend>
    <CCol sm={8} >
      <CFormCheck type="radio" name="gridRadios" id="gridRadios1" value="option1" label="Active" defaultChecked/>
      <CFormCheck type="radio" name="gridRadios" id="gridRadios2" value="option2" label="Pending"/>
      <CFormCheck type="radio" name="gridRadios" id="gridRadios3" value="option3" label="Inactive" disabled/>
    </CCol>
  </fieldset>
  
  {/* <CButton color="primary" type="submit">Save</CButton> */}
  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton color="primary" className="me-md-2">Save</CButton>
            </div>
</CForm>
          </CCardBody>
        </CCard>
      </CCol>
      
    </CRow>
  )
}

export default AddBrands
