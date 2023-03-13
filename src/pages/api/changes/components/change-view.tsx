import {ProDescriptions} from '@ant-design/pro-components';
import React from 'react';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';

const ApiChangeView: React.FC<{
    productClass: string;
    serviceName: string;
    apiGroup: string;
    apiName: string;
    content: string;
    apiNameEn: string;
}> = (props) => {
    return (
        <>
            <ProDescriptions column={16} title="API 变更详情">
                <ProDescriptions.Item span={1} label="分类" valueType="text">
                    {props.productClass}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={1} label="服务" valueType="text">
                    {props.serviceName}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={2} label="API 分组" valueType="text">
                    {props.apiGroup}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={12} label="API 名称" valueType="text">
                    {props.apiName}
                </ProDescriptions.Item>
                <ProDescriptions.Item span={16} label="在线调试" valueType="text">
                    <a
                        href={`https://console.huaweicloud.com/apiexplorer/#/apidebug/${props.serviceName}/doc?api=${props.apiNameEn}`}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                    >
                        API Explorer
                    </a>
                </ProDescriptions.Item>
            </ProDescriptions>
            <Scrollbars>
                <div dangerouslySetInnerHTML={{__html: props.content}}/>
            </Scrollbars>
        </>
    );
};

export default ApiChangeView;
