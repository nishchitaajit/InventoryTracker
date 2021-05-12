import React from 'react';
import { Route } from 'react-router-dom';
import { Label, Panel, Button } from 'react-bootstrap';
import ProductTable from './inventoryTable.jsx';
import ProductAdd from './inventoryAdd.jsx';
import graphQLFetch from './graphQLFetch.js';
import Toast from './Toast.jsx';
import withToast from './withToast.jsx';

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { myProducts: [],
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
    };
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
        productList {
          id product_category product_name product_price product_image
        }
      }`;

    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    }).then(response => {
      response.json().then(result => {
        this.setState({ myProducts: result.data.productList });
      })
    }).catch(err => {
      alert("Error in sending data to server: " + err.message);
    });
  }

  async productCount() {
    const query  = 'query{productCounts{count}}';
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    if (result.data.productCounts.length > 0) {
      this.setState({ count: result.data.productCounts[0].count });
    } else {
      this.setState({ count: 0 });
    }
  }

  async createProduct(myProduct) {
    const query = `mutation productAdd($myProduct: productInputs!) {
    productAdd(product: $myProduct) {
      _id
    }
  }`;
    const variables = {myProduct}
    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    }).then(response => {
      this.loadData()
    }).catch(err => {
      alert("Error in sending data to server: " + err.message);
    });
  }

  async deleteProduct(id) {
      const query = `mutation productDelete($id: Int!) {
        productDelete(id: $id)
      }`;
      console.log(id);
    const variables =  { id };
    const { showSuccess, showError } = this.props;
      await fetch(window.ENV.UI_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query,  variables  }),
      });
      const undoMessage = (
          <span>
            { `Deleted product ${id} successfully.` }
            <Button bsStyle="link" onClick={() => this.restoreProduct(id)}>
              UNDO
            </Button>
          </span>
      );
      showSuccess(undoMessage);
      this.loadData();
      this.productCount();
  }

  async restoreProduct(id) {
    const query = `mutation productRestore($id: Int!) {
      productRestore(id: $id)
    }`;
    console.log(id);
    const variables = { id };
    const { showSuccess, showError } = this.props;
    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const newMessage = (
      <span>
        { `Product ${id} restored successfully.` }
      </span>
    )
    showSuccess(newMessage);
    this.loadData();
    this.productCount();
  }

  render() {
      const { myProducts } = this.state;
      const { count } = this.state;
      return (
        <React.Fragment>
        <Panel>
           <Panel.Heading className = "listPanel">
             <Panel.Title toggle>Product List</Panel.Title>
           </Panel.Heading>
           <Panel.Body >
            <h4>Showing { count } available products </h4>
            <ProductTable myProducts={myProducts} deleteProduct={this.deleteProduct} />
           </Panel.Body>
         </Panel>
         <Panel>
           <Panel.Heading className = "listPanel">
             <Panel.Title >Add a new product</Panel.Title>
           </Panel.Heading>
           <Panel.Body >
             <ProductAdd createProduct={this.createProduct} />
           </Panel.Body>
         </Panel>
        </React.Fragment>
      );
    }
  }

  const ProductListWithToast = withToast(ProductList);
  ProductListWithToast.fetchData = ProductList.fetchData;

  export default ProductListWithToast;
