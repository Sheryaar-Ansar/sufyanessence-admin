import React from 'react'
import OrdersTable from '../components/OrdersTable'

const PendingOrdersPage = () => {
  return (
    <div className='min-h-screen'>
      <OrdersTable status={'pending'} allowActions={true} allowPaid={true} />
    </div>
  )
}

export default PendingOrdersPage
