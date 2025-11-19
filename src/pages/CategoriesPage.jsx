import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Tag, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import * as categoryService from "../services/categoryService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data.categories || res.data);
    } catch (err) {
      message.error("Failed to load categories");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openModal = (category = null) => {
    setEditingCategory(category);

    if (category) {
      form.setFieldsValue({
        title: category.title,
        name: category.name // already an array → works directly
      });
    } else {
      form.resetFields();
    }

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      message.success("Category deleted");
      loadCategories();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  const handleFinish = async (values) => {
    try {
      const payload = {
        title: values.title,
        name: values.name.filter((n) => n && n.trim() !== "")
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, payload);
        message.success("Category updated");
      } else {
        await categoryService.createCategory(payload);
        message.success("Category created");
      }

      loadCategories();
      closeModal();
    } catch (err) {
      console.log(err);
      message.error("Save failed");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },

    {
      title: "Names",
      dataIndex: "name",
      key: "name",
      render: (names) =>
        names?.map((n, i) => <Tag key={i}>{n}</Tag>)
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => openModal(record)} className="mr-2">
            Edit
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="mb-4 flex justify-end">
        <Button type="primary" onClick={() => openModal()}>Add Category</Button>
      </div>

      <Table rowKey="_id" columns={columns} dataSource={categories} loading={loading} />

      <Modal
        visible={modalVisible}
        title={editingCategory ? "Edit Category" : "Add Category"}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>

          {/* Title */}
          <Form.Item name="title" label="Category Title" rules={[{ required: true }]}>
            <Input placeholder="Example: SEASONS" />
          </Form.Item>

          {/* Dynamic Names Array */}
          <Form.List name="name" rules={[{ required: true, message: "Add at least one name" }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...rest}
                      name={name}
                      rules={[{ required: true, message: "Enter name" }]}
                      style={{ width: "300px" }}
                    >
                      <Input placeholder="Enter category name" />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Category Name
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

        </Form>
      </Modal>
    </div>
  );
}
