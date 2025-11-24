import React, { useEffect, useState } from "react";
import { message, Typography } from "antd";
import * as dashboardService from '../services/dashboardService'
const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, reviews: 0, pendingReviews: 0, pendingOrders: 0, processingOrders: 0, completedOrders: 0 });

  const loadStats = async() =>{
    try {
      const res = await  dashboardService.getStats()
      // console.log(res)
      setStats(res.data)
    } catch (error) {
      message.error("Failed to load Stats")
    }
  }

  useEffect(()=>{
    loadStats()
  },[])

  return (
    <div className="p-4 space-y-6 min-h-screen">

      {/* Page Header Replacement */}
      <div className="bg-white p-4 rounded shadow flex items-center justify-between">
        <Title level={3} className="!mb-0">
          Dashboard
        </Title>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded shadow bg-white">
          <h3 className="text-sm text-gray-500">Products</h3>
          <div className="text-2xl font-bold">{stats.products}</div>
        </div>

        <div className="p-4 rounded shadow bg-white">
          <h3 className="text-sm text-gray-500">Orders</h3>
          <div className="text-2xl font-bold">{stats.orders}</div>
        </div>

        <div className="p-4 rounded shadow bg-white">
          <h3 className="text-sm text-gray-500">Reviews</h3>
          <div className="text-2xl font-bold">{stats.reviews}</div>
        </div>
        <div className="p-4 rounded shadow bg-white">
          <h3 className="text-sm text-gray-500">Pending Orders</h3>
          <div className="text-2xl font-bold">{stats.pendingOrders}</div>
        </div>
        <div className="p-4 rounded shadow bg-white">
          <h3 className="text-sm text-gray-500">Pending Reviews</h3>
          <div className="text-2xl font-bold">{stats.pendingReviews}</div>
        </div>
        <div className="p-4 rounded shadow bg-white">
          <h3 className="text-sm text-gray-500">Processing Orders</h3>
          <div className="text-2xl font-bold">{stats.processingOrders}</div>
        </div>
        <div className="p-4 rounded shadow bg-white">
          <h3 className="text-sm text-gray-500">Completed Orders</h3>
          <div className="text-2xl font-bold">{stats.completedOrders}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
