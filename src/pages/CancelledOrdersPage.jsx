import React from 'react'
import OrdersTable from '../components/OrdersTable'

const CancelledOrdersPage = () => {
  return (
    <div className='min-h-screen'>
      <OrdersTable status={'cancelled'} allowActions={false} allowPaid={false} />
    </div>
  )
}

export default CancelledOrdersPage
