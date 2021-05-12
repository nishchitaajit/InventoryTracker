import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table
} from 'react-bootstrap';

const deleteTooltip = (
  <Tooltip id="delete-tooltip" placement="top">Delete Product</Tooltip>
);

const editTooltip = (
  <Tooltip id="edit-tooltip" placement="top">Edit Product</Tooltip>
);

const viewTooltip = (
  <Tooltip id="view-tooltip" placement="top">View Product</Tooltip>
);

function onClose(e) {
  e.preventDefault();
  closeIssue(index);
}

function onDelete(e) {
  e.preventDefault();
  deleteIssue(index);
}

const ProductRow = withRouter(({ myProducts, deleteProduct, index }) => (
  <tr>
    <td>{myProducts.product_name}</td>
    <td>${myProducts.product_price}</td>
    <td>{myProducts.product_category}</td>
    <td>
      <LinkContainer to={`/img/${myProducts.id}`}>
        <OverlayTrigger delayShow={1000} overlay={viewTooltip}>
          <Button bsStyle="primary">
            <Glyphicon glyph="eye-open" />
          </Button>
        </OverlayTrigger>
      </LinkContainer>
    </td>
    <td>
      <LinkContainer to={`/edit/${myProducts.id}`}>
        <OverlayTrigger delayShow={1000} overlay={editTooltip}>
          <Button bsStyle="primary">
            <Glyphicon glyph="edit" />
          </Button>
        </OverlayTrigger>
      </LinkContainer>
    </td>
    <td>
      <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
        <Button bsStyle="primary" type="button" onClick={() => { deleteProduct(index); }}>
          <Glyphicon glyph="trash" />
        </Button>
      </OverlayTrigger>
    </td>
  </tr>
));

export default function ProductTable({myProducts, deleteProduct}) {
    const productRows = myProducts.map((myProducts) =>
        <ProductRow key={myProducts.id} myProducts={myProducts}
         deleteProduct={deleteProduct} index={myProducts.id} />
    );

    return (
        <div >
            <Table bordered condensed hover responsive>
                <thead>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Image</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </thead>
                <tbody>
                    {productRows}
                </tbody>
            </Table>
        </div>
    );
  }
