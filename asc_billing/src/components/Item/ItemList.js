import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import billing from '../../api/billing';
import { Table, Spinner } from 'reactstrap';
import FullLayout from '../Layouts/FullLayout';

export default function ItemList() {
  const [items, setItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function cb() {
      setIsLoading(true);
      try {
        const response = await billing.get('fix-item');
        setItem(response.data.items);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    cb();
  }, []);

  function renderTableBody() {
    if (isLoading)
      return (
        <Spinner
          color='dark'
          style={{ display: 'flex', justifyContent: 'center' }}
        />
      );
    return (
      <>
        <tbody>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>
                  {item.full_image_path && (
                    <img
                      className='img-thumbnail'
                      src={item.full_image_path}
                      style={{ width: '20%' }}
                      alt=''
                    />
                  )}
                </td>
                <td>{item.product_code}</td>
                <td>{item.product_name}</td>
                <td>{item.hsn}</td>
                <td>{item.brand}</td>
                <td>{item.ws_margin}</td>
                <td>{item.r_margin}</td>
                <td>{item.gst}</td>
                <th>
                  <Link to={`/edit-item/${item.id}`}>Edit</Link>
                </th>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='9' className='text-center'>
                No Item
              </td>
            </tr>
          )}
        </tbody>
      </>
    );
  }

  return (
    <FullLayout>
      <aside key='sidebar'>
        <h1>All Items</h1>
      </aside>
      <main key='main' className='card'>
        <div className='card-body'>
          <Table bordered striped>
            <thead>
              <tr>
                <th>SNo.</th>
                <th>Image</th>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>HSN</th>
                <th>Brand</th>
                <th>WS Margin</th>
                <th>R Margin</th>
                <th>GST</th>
                <th>Action</th>
              </tr>
            </thead>
            {renderTableBody()}
          </Table>
        </div>
      </main>
    </FullLayout>
  );
}
