import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';

const { Option } = Select;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // ⭐ Fix: Cloudinary + old images support
  const getImageUrl = (url) => {
    if (!url) return "/placeholder.jpg";

    // Cloudinary URL
    if (url.startsWith("http")) {
      return url;
    }

    // Old local image path (Render)
    return `${import.meta.env.VITE_IMAGE_API}/${url}`;
  };

  // Load products from backend
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts();
      setProducts(res.data.products || res.data);
      console.log(res)
    } catch (err) {
      message.error('Failed to load products');
    }
    setLoading(false);
  };

  // Load categories for Select dropdown
  const loadCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data.categories || res.data);
    } catch (err) {
      message.error('Failed to load categories');
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const openModal = (product = null) => {
    setEditingProduct(product);

    if (product) {
      form.setFieldsValue({
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice,
        bio: product.bio,
        description: product.description,
        format: product.format,
        stock: product.stock ?? 0,
        subcategory: product.subcategory,
        category: product.category,

        // ⭐ Cloudinary or old path: Upload auto handles it
        images: product.images?.map((url, index) => ({
          uid: String(index + 1),
          name: `image-${index + 1}.jpg`,
          status: "done",
          url: getImageUrl(url)
        })) || [],

        hover: product.hover
          ? [{
              uid: "-1",
              name: "hover.jpg",
              status: "done",
              url: getImageUrl(product.hover)
            }]
          : []
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ stock: 0 });
    }

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      message.success('Product deleted');
      loadProducts();
    } catch (err) {
      message.error('Delete failed');
    }
  };

  const handleFinish = async (values) => {
    try {
      const payload = { ...values };

      // --- MULTIPLE IMAGES ---
      if (values.images?.length) {
        const files = values.images
          .filter(f => f.originFileObj)
          .map(f => f.originFileObj);

        if (files.length > 0) {
          const res = await productService.uploadImages(files);
          payload.images = res.data.urls;
        }
      }

      // --- HOVER IMAGE ---
      if (values.hover?.length && values.hover[0].originFileObj) {
        const file = values.hover[0].originFileObj;
        const res = await productService.uploadHover(file);
        payload.hover = res.data.url;
      }

      payload.category = values.category;
      payload.subcategory = values.subcategory;
      payload.stock = values.stock ?? 0;

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
        message.success("Product updated");
      } else {
        await productService.createProduct(payload);
        message.success("Product created");
      }

      loadProducts();
      closeModal();

    } catch (err) {
      console.error(err);
      message.error("Save failed");
    }
  };

  const columns = [
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (imgs) => (
        <div style={{ display: "flex", gap: 8 }}>
          {imgs?.slice(0, 1).map((url, i) => (
            <img
              key={i}
              src={getImageUrl(url)}
              alt="thumb"
              style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
            />
          ))}
          {imgs?.length > 1 && <span>+{imgs.length - 1} more</span>}
        </div>
      )
    },

    {
      title: "Hover",
      dataIndex: "hover",
      key: "hover",
      render: (url) =>
        url ? (
          <img
            src={getImageUrl(url)}
            alt="hover"
            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          "—"
        )
    },

    { title: 'Name', dataIndex: 'title', key: 'title' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: p => `$${p}` },
    { title: 'Discounted', dataIndex: 'discountedPrice', key: 'discountedPrice', render: p => `$${p || 0}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock', render: s => s ?? 0 },
    { title: 'Category', key: 'category', render: (_, record) => record.subcategory || "—" },
    { title: 'Format', dataIndex: 'format', key: 'format' },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => new Date(date).toLocaleString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => openModal(record)} className="mr-2">Edit</Button>
          <Button size="small" danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="mb-4 flex justify-end">
        <Button type="primary" onClick={() => openModal()}>Add Product</Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={products}
        loading={loading}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        open={modalVisible}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        onCancel={closeModal}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="title" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true, type: 'number' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="discountedPrice" label="Discounted Price">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item name="bio" label="Bio">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={5} />
          </Form.Item>

          <Form.Item name="subcategory" label="Category">
            <Select placeholder="Select category" onChange={(sub, option) => {
              form.setFieldsValue({ category: option['data-cat'] });
            }}>
              {categories.map(cat =>
                cat.name.map(sub => (
                  <Select.Option
                    key={cat._id + "-" + sub}
                    value={sub}
                    data-cat={cat._id}
                  >
                    {sub} ({cat.title})
                  </Select.Option>
                ))
              )}
            </Select>
          </Form.Item>

          <Form.Item name="category" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="format" label="Format" rules={[{ required: true }]}>
            <Select placeholder="Select format">
              <Option value="50ml">50ml</Option>
              <Option value="100ml">100ml</Option>
              <Option value="10ml">10ml</Option>
              <Option value="5ml">5ml</Option>
              <Option value="30ml">30ml</Option>
            </Select>
          </Form.Item>

          {/* MULTIPLE PRODUCT IMAGES */}
          <Form.Item
            name="images"
            label="Product Images"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
          >
            <Upload beforeUpload={() => false} multiple>
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
          </Form.Item>

          {/* HOVER IMAGE */}
          <Form.Item
            name="hover"
            label="Hover Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select Hover Image</Button>
            </Upload>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
}
