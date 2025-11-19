import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Descriptions, message } from 'antd';
import * as orderService from '../services/orderService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders();
      setOrders(res.data.orders || res.data);
    } catch (err) {
      message.error('Failed to load orders');
    }
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, []);

  const openDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedOrder(null);
  };
  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      message.success(`Order status updated to "${newStatus}"`);
      closeDrawer();
      loadOrders();
    } catch (err) {
      message.error('Failed to update status');
    }
  };

  // Mark order as paid
  const markPaid = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, { isPaid: true, paidAt: new Date() });
      message.success('Order marked as paid');
      closeDrawer();
      loadOrders();
    } catch (err) {
      message.error('Failed to mark as paid');
    }
  };


  const downloadCSV = async () => {
    try {
      const csv = await orderService.exportOrdersCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      message.error('CSV export failed');
    }
  };

  const columns = [
    { title: 'Order #', dataIndex: '_id', key: '_id', render: id => <code>{id.slice(-6)}</code> },
    { title: 'Name', dataIndex: ['shippingAddress', 'fullName'], key: 'name' },
    { title: 'Total', dataIndex: 'totalPrice', key: 'totalPrice', render: t => `$${t}` },
    { title: 'Payment', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions', key: 'actions', render: (_, record) => (
        <Button size="small" onClick={() => openDrawer(record)}>View</Button>
      )
    }
  ];
  console.log("order detail: ", selectedOrder)

  return (
    <div className='min-h-screen'>
      <div className="mb-4 flex justify-end">
        <Button type="primary" onClick={downloadCSV}>Export CSV</Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={orders}
        loading={loading}
      />

      <Drawer
        title={`Order Details #${selectedOrder?._id?.slice(-6)}`}
        placement="right"
        width={480}
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        {selectedOrder && (
          <>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Full Name">{selectedOrder.shippingAddress.fullName}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedOrder.shippingAddress.addressLine1}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrder.shippingAddress.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedOrder.shippingAddress.phone}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">{selectedOrder.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Status">{selectedOrder.status}</Descriptions.Item>
              <Descriptions.Item label="Delivered">{selectedOrder.isDelivered ? "Yes" : "No"}</Descriptions.Item>
              <Descriptions.Item label="Paid">{selectedOrder.isPaid ? `Yes (${new Date(selectedOrder.paidAt).toLocaleString()})` : "No"}</Descriptions.Item>
              <Descriptions.Item label="Delivery Date">{selectedOrder.deliveredAt}</Descriptions.Item>
              <Descriptions.Item label="Items">
                {selectedOrder.orderItems.map(item => (
                  <div key={item._id} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>PKR{item.price}</span>
                  </div>
                ))}
              </Descriptions.Item>

              <Descriptions.Item label="Shipping Price">PKR{selectedOrder.shippingPrice}</Descriptions.Item>
              <Descriptions.Item label="Total Price">PKR{selectedOrder.totalPrice}</Descriptions.Item>

            </Descriptions>
            <div className="mt-4 flex flex-wrap gap-2">
              {/* Status buttons */}
              {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                <Button
                  key={s}
                  type={selectedOrder.status === s ? "primary" : "default"}
                  onClick={() => updateStatus(selectedOrder._id, s)}
                >
                  {s}
                </Button>
              ))}

              {/* Mark as paid */}
              {!selectedOrder.isPaid && (
                <Button type="success" onClick={() => markPaid(selectedOrder._id)}>
                  Mark as Paid
                </Button>

              )}
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}