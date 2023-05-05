import ApiGroup from '@/pages/api/components/api-group';
import ApiList from '@/pages/api/components/api-list';
import SearchResult from '@/pages/api/components/search-result';
import { Breadcrumb, Row } from 'antd';
import React from 'react';

const Api: React.FC = () => {
    return (
        <>
            <div className={'bread-crumbs'}>
                <Breadcrumb
                    style={{ marginTop: '20px' }}
                    items={[
                        {
                            title: '首页',
                        },
                        {
                            title: <a href="">资源管理</a>,
                        },
                        {
                            title: <a href="">API</a>,
                        },
                    ]}
                />
            </div>
            <Row>
                <ApiList />
            </Row>
            <div style={{ height: '20px' }} />
            <div style={{ display: 'flex' }}>
                <div>
                    <ApiGroup />
                </div>
                <div style={{ width: '20px' }} />
                <div>
                    <SearchResult />
                </div>
            </div>
        </>
    );
};
export default Api;
