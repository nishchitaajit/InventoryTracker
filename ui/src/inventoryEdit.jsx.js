import React from 'react';
import { Link } from 'react-router-dom';
import NumInput from './NumInput.jsx';
import graphQLFetch from './graphQLFetch.js';
import TextInput from './TextInput.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';
import Toast from './Toast.jsx';

export default class InventoryEdit extends React.Component {
  constructor() {
    super();
    this.state = {
        product : [],
        invalidFields: {},
        showingValidation: false,
        toastVisible: false,
        toastMessage: '',
        toastType: 'success',
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      product: { ...prevState.product, [name]: value },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { product } = this.state;
    const query = `mutation productUpdate(
      $id: Int!
      $changes: productUpdateInputs!
    ) {
      productUpdate(
        id: $id
        changes: $changes
      ) {
        id product_category product_name product_price product_image
      }
    }`;

    const { id, ...changes } = product;
    const data = await graphQLFetch(query, { changes, id });
    if (data) {
      this.setState({ product: data.productUpdate });
      alert('Updated product successfully'); // eslint-disable-line no-alert
    }
  }


  async loadData() {
    const query = `query product($id: Int!) {
      product(id: $id) {
        id product_category product_name product_price product_image
      }
    }`;
    const { match: { params: { id } } } = this.props;
    const data = await graphQLFetch(query, { id });
    this.setState({ product: data ? data.product : {}, invalidFields: {} });
  }

  showSuccess(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'success',
    });
  }

  showError(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'danger',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { product: { id } } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Product with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { invalidFields, showingValidation } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting.
        </Alert>
      );
    }

    const { product: {  product_category, product_name, product_price, product_image } } = this.state;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>
            {`Editing product: ${id}`}
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit = {this.handleSubmit}>
            <FormGroup>
              <ControlLabel htmlFor="category">Category</ControlLabel>
                <select name="product_category" value={product_category} onChange={this.onChange}>
                  <option >Shirt</option>
                  <option >Jeans</option>
                  <option >Sweaters</option>
                  <option >Jackets</option>
                  <option >Accessories</option>
                </select>
            </FormGroup>

            <FormGroup>
              <ControlLabel htmlFor="price">Price</ControlLabel>
              <NumInput name="product_price" value={product_price} onChange={this.onChange} key={id} />
            </FormGroup>

          <FormGroup>
            <ControlLabel htmlFor="product">Product</ControlLabel>
            <TextInput name="product_name" value={product_name} onChange={this.onChange} key={id} />
          </FormGroup>
          <FormGroup>
            <ControlLabel htmlFor="image">Image</ControlLabel>
            <TextInput name="product_image" value={product_image} onChange={this.onChange} key={id} />
          </FormGroup>
            <Button bsStyle="primary" type="submit">Submit</Button>
          </Form>
      </Panel.Body>
      <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
    </Panel>
      );
    }
  }
