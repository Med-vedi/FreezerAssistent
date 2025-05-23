import { Button, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '@/store/users/users.api'

const SignUpPage = () => {
    const [form] = Form.useForm()
    const [register] = useRegisterMutation()
    const navigate = useNavigate()
    const onFinish = async (values: { username: string, password: string, email: string }) => {
        try {
            await register({
                name: values.username,
                email: values.email,
                password: values.password
            }).unwrap()
            navigate('/onboarding')
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }
    return (
        <div className="flex justify-center items-center h-full">
            <Form
                layout="vertical"
                onFinish={onFinish}
                form={form}
                className="w-[90%] max-w-[400px] mx-auto bg-white rounded-lg border border-gray-200 p-6! shadow-md "
            >
                <Form.Item
                    name="username"
                    label="Name"
                    rules={[
                        { required: true, message: 'Please input your name!' },
                    ]}
                >
                    <Input size="large" />

                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input size="large" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password size="large" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" block size="large" htmlType="submit">Sign Up</Button>
                </Form.Item>
                <div className="text-center text-gray-500">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </Form>
        </div>
    )
}

export default SignUpPage