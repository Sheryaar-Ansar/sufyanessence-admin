import React from 'react'
import OrdersTable from '../components/OrdersTable'

const ShippingOrdersPage = () => {
  return (
    <div className='min-h-screen'>
        <OrdersTable status={'shipped'} allowActions={true} allowPaid={true} />
    </div>
  )
}

export default ShippingOrdersPage
