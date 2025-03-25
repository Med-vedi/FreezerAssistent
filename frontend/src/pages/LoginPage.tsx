import { Form, Input, Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
    const [form] = Form.useForm()
    const { login } = useAuth()
    const navigate = useNavigate()

    const onFinish = async (values: { email: string, password: string }) => {
        try {
            const user = await login(values.email, values.password)
            if (user?.isReady) {
                navigate('/dashboard')
            } else {
                navigate('/onboarding')
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