import React, { useState, useEffect, useContext } from 'react';
import Loader from '../../components/Loader/Loader';
import ItemList from '../../components/ItemList/ItemList';
import { CartContext } from '../../context/cartContext';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthenticatedLayout as Layout } from "../_layout/authenticated/index";
import "../OrderHistory/OrderHistory.css";

const { getItems } = require('../../sevices/utils');

export default function NewOrder() {
  const [data, setData] = useState();
  const { cart, totalPrice } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await getItems()
      .then(res => {
        let filteredData = res.filter(x => x.active);
        setData(filteredData);
      });
    setIsLoading(false);
  };

  return (
    <Layout>
      <div>
        <h1 className='order-title'>Nuevo pedido</h1>
      </div>
      <Container>
        {isLoading && <Loader />}
        {!isLoading && data?.length > 0 ?
          <ItemList data={data} cart={cart} totalPrice={totalPrice} />
          :
          <h3 className='no-data'>No hay productos disponibles</h3>
        }
      </Container>
    </Layout>
  );
}
