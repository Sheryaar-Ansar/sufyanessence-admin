import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { AppstoreOutlined, ShoppingOutlined, TagsOutlined, StarOutlined, OrderedListOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const { Sider, Content, Header } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Define menu items using the new 'items' prop
  const menuItems = [
    {
      key: '1',
      icon: <AppstoreOutlined />,
      label: <Link to="/admin">Dashboard</Link>
    },

    {
      key: '2',
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Products</Link>
    },

    {
      key: '3',
      icon: <TagsOutlined />,
      label: <Link to="/admin/categories">Categories</Link>
    },

    // ---- REVIEWS WITH SUBMENU ----
    {
      key: 'reviews',
      icon: <StarOutlined />,
      label: 'Reviews',
      children: [
        {
          key: 'total-reviews',
          label: <Link to="/admin/reviews/total">Total Reviews</Link>
        },
        {
          key: 'pending-reviews',
          label: <Link to="/admin/reviews/pending">Pending Reviews</Link>
        }
      ]
    },

    // ---- ORDERS WITH SUBMENU ----
    {
      key: 'orders',
      icon: <OrderedListOutlined />,
      label: 'Orders',
      children: [
        {
          key: 'pending-orders',
          label: <Link to="/admin/orders/pending">Pending Orders</Link>
        },
        {
          key: 'processing-orders',
          label: <Link to="/admin/orders/processing">Processing Orders</Link>
        },
        {
          key: 'shipped-orders',
          label: <Link to="/admin/orders/shipped">Shipped Orders</Link>
        },
        {
          key: 'delivered-orders',
          label: <Link to="/admin/orders/delivered">Delivered Orders</Link>
        },
        {
          key: 'cancelled-orders',
          label: <Link to="/admin/orders/cancelled">Cancelled Orders</Link>
        }
      ]
    },
  ];


  return (
    <Layout className="min-h-screen">
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="text-white text-center py-4 text-xl font-bold font-mono">
          {collapsed ? 'SE' : 'Sufiyan Essense'}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={menuItems} />
      </Sider>

      <Layout>
        <Header className="bg-white shadow px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
        </Header>

        <Content className="m-6 p-6 bg-white rounded shadow min-h-[80vh]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
