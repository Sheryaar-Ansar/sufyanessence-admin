import React from 'react'
import OrdersTable from '../components/OrdersTable'

const DeliveredOrdersPage = () => {
  return (
    <div className='min-h-screen'>
      <OrdersTable status={'delivered'} allowActions={true} allowPaid={false} />
    </div>
  )
}

export default DeliveredOrdersPage
