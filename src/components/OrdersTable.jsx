import React, { useState, useEffect } from "react";
import { Table, Button, Drawer, Descriptions, message } from "antd";
import * as orderService from "../services/orderService";

export default function OrdersTable({ status, allowActions = true, allowPaid = true }) {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders(status);
      setOrders(res.data.orders || []);
    } catch (err) {
      message.error("Failed to load orders");
    }
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, [status]);

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
      message.success(`Order updated to ${newStatus}`);
      closeDrawer();
      loadOrders();
    } catch {
      message.error("Update failed");
    }
  };

  // Mark paid
  const markPaid = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, { isPaid: true, paidAt: new Date() });
      message.success("Marked as Paid");
      closeDrawer();
      loadOrders();
    } catch {
      message.error("Mark paid failed");
    }
  };

  const columns = [
    { title: "Order #", dataIndex: "_id", render: id => <code>{id.slice(-6)}</code> },
    { title: "Name", dataIndex: ["shippingAddress", "fullName"] },
    { title: "Total", dataIndex: "totalPrice", render: t => `$${t}` },
    { title: "Payment", dataIndex: "paymentMethod" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Actions",
      render: (_, record) => (
        <Button size="small" onClick={() => openDrawer(record)}>View</Button>
      )
    }
  ];
  console.log("orders: ", orders)

  return (
    <div>
      <Table rowKey="_id" columns={columns} dataSource={orders} loading={loading} />

      <Drawer
        title={`Order #${selectedOrder?._id?.slice(-6)}`}
        width={480}
        visible={drawerVisible}
        onClose={closeDrawer}
      >
        {selectedOrder && (
          <>
            {/* Order Details */}
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Full Name">{selectedOrder.shippingAddress.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrder.shippingAddress.email}</Descriptions.Item>
              <Descriptions.Item label="Address">
                {`${selectedOrder.shippingAddress.addressLine1}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.country}`}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">{selectedOrder.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Status">{selectedOrder.status}</Descriptions.Item>
              <Descriptions.Item label="Paid">
                {selectedOrder.isPaid
                  ? `Yes (${new Date(selectedOrder.paidAt).toLocaleString()})`
                  : "No"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            {/* Order Items List */}
            <h3 className="mt-5 mb-2 font-semibold">Order Items</h3>
            <div className="border rounded p-3 space-y-3">
              {selectedOrder.orderItems?.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">Qty: {item.qty}</div>
                  </div>
                  <div className="text-right">
                    <div>${item.price}</div>
                    <div className="text-sm text-gray-500">
                      Subtotal: ${item.price * item.qty}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <h3 className="mt-5 mb-2 font-semibold">Price Summary</h3>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Items Price">${selectedOrder.itemsPrice}</Descriptions.Item>
              <Descriptions.Item label="Shipping Price">${selectedOrder.shippingPrice}</Descriptions.Item>
              <Descriptions.Item label="Tax">${selectedOrder.taxPrice}</Descriptions.Item>
              <Descriptions.Item label="Total Price">${selectedOrder.totalPrice}</Descriptions.Item>
            </Descriptions>

            {/* Action Buttons */}
            {allowActions && (
              <div className="mt-4 flex flex-wrap gap-2">
                {["pending", "processing", "shipped", "delivered"].map(s => (
                  <Button
                    key={s}
                    type={selectedOrder.status === s ? "primary" : "default"}
                    onClick={() => updateStatus(selectedOrder._id, s)}
                  >
                    {s}
                  </Button>
                ))}

                {allowPaid && !selectedOrder.isPaid && (
                  <Button type="primary" onClick={() => markPaid(selectedOrder._id)}>
                    Mark as Paid
                  </Button>
                )}
              </div>
            )}
          </>
        )}

      </Drawer>
    </div>
  );
}
