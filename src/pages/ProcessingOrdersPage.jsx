import React from 'react'
import OrdersTable from '../components/OrdersTable'

const ProcessingOrdersPage = () => {
  return (
    <div className='min-h-screen'>
      <OrdersTable status={'processing'} allowActions={true} allowPaid={true} />
    </div>
  )
}

export default ProcessingOrdersPage
