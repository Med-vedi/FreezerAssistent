import React from 'react'
import LevelsListPage from './LevelsListPage';
import { Layout, Typography } from 'antd';
const { Title } = Typography;

const MainPage = () => {

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <header className='w-full flex justify-center items-center max-w-7xl mx-auto py-4 px-4 shadow-md'>
                <Title level={2}>Freezer Assist</Title>
            </header>

            <div className='w-full flex justify-center items-center max-w-7xl mx-auto py-4 px-4'>
                <LevelsListPage />
            </div>
        </Layout>
    );
}

export default MainPage;
