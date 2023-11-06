import ApiSearchList from '@/pages/api/components/api-search-list';
import React from 'react';
import './api.less';
import CustomBreadcrumb from "@/components/Breadcrumb";

const Api: React.FC = () => {
    return (
        <>
            <CustomBreadcrumb items={[{title: '首页'}, {title: '资源管理'}]}/>

            <div>
                <ApiSearchList/>
            </div>
        </>
    );
};
export default Api;
