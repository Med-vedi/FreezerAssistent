import { Form, Input, Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { AxiosError } from 'axios'
import { BASE_URL } from '../utils/constants'
const LoginPage = () => {
    const [form] = Form.useForm()

    fetch(`${BASE_URL}/login`)
    const navigate = useNavigate()
    const onFinish = async (values: { email: string, password: string }) => {
        try {
            const response = await axiosInstance.post('/login', values)
            console.log('response:', response)
            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken)
                navigate('/dashboard')
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.data?.message) {
                message.error(error.response.data.message)
            }
            console.log(error)
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
                <h1 className="text-2xl font-bold text-center mb-[64px]!">Welcome back!</h1>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email address!' }
                    ]}
                >
                    <Input type="email" size="large" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password size="large" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" block size="large" htmlType="submit">Login</Button>
                </Form.Item>
                <div className="text-center text-gray-500">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </Form>
        </div>
    )
}

export default LoginPage