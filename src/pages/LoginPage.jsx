import React, { useState } from "react";
import { Form, Input, Button, Checkbox, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import useAuth from "../hooks/useAuth"; // Adjust this if you're using a custom hook for auth

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const  { login }  = useAuth(); // Your custom hook for authentication
  const navigate = useNavigate();

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Assuming `login` is a function in useAuth that authenticates and stores JWT
      await login(values.email, values.password);
      navigate("/admin/dashboard"); // Redirect to admin panel after login
    } catch (error) {
      notification.error({
        message: "Login Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    }
    setLoading(false);
  };

  // Form layout
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-semibold mb-6">Admin Login</h2>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Email"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#" className="text-blue-600 text-sm">
                Forgot password?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
