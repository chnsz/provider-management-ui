import ApiSearchList from '@/pages/api/components/api-search-list';
import { Breadcrumb } from 'antd';
import React from 'react';
import './api.less';

const Api: React.FC = () => {
    return (
        <>
            <Breadcrumb
                items={[{ title: '首页' }, { title: '资源管理' }]}
                style={{ margin: '10px 0' }}
            />
            <div>
                <ApiSearchList />
            </div>
        </>
    );
};
export default Api;
