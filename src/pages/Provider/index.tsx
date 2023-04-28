import React from "react";
import SearchForm from "@/components/SearchForm";
import { createFromIconfontCN } from '@ant-design/icons';
import {Breadcrumb, Table} from "antd";
import './provider.less'
import {ColumnsType} from "antd/es/table/interface";
import {SafetyCertificateOutlined} from "@ant-design/icons";

const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js', // icon-javascript, icon-java, icon-shoppingcart (overridden)
        '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
        '//at.alicdn.com/t/c/font_4039325_co8qvh6ah1.js',
    ],
});

const ProviderList: React.FC = () => {

    interface DataType {
        key: string;
        providerType: string,
        providerName: string,
        owner: string;
        prePaidSupport: string;
        tagSupport: string;
        epsSupport: string;
        prScore: number;
        utScore: number;
        bugScore: number;
    }

    const columns: ColumnsType<DataType> = [
        {
            title: '资源类型',
            dataIndex: 'providerType',
            width: '6%',
        },
        {
            title: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资源名称</>,
            dataIndex: 'providerName',
            width: '14%',
            render: (text, record) => {
                if(record.key === '1'){
                    // return <><SafetyCertificateOutlined style={{color: '#389e0d', fontSize: '18px', marginRight: '5px'}}/><a>{text}</a></>
                    return <><SafetyCertificateOutlined style={{color: '#389e0d', fontSize: '18px', marginRight: '5px'}}/><a>{text}</a></>
                }
                return <><span style={{color: '#389e0d', fontSize: '18px', marginRight: '5px'}}>&nbsp;&nbsp;&nbsp;&nbsp;</span><a>{text}</a></>
            },
        },
        {
            title: '责任人',
            width: '7%',
            dataIndex: 'owner',
        },
        {
            title: '包周期',
            width: '7%',
            dataIndex: 'prePaidSupport',
        },
        {
            title: '标签',
            width: '7%',
            dataIndex: 'tagSupport',
        },
        {
            title: '企业项目',
            width: '7%',
            dataIndex: 'epsSupport',
        },
        {
            title: '质量守护',
            width: '7%',
            dataIndex: 'prScore',
        },
        {
            title: 'UT 分值',
            width: '7%',
            dataIndex: 'utScore',
        },
        {
            title: 'Bug',
            width: '7%',
            dataIndex: 'bugScore',
        },
        {
            title: '总分',
            width: '7%',
            dataIndex: 'bugScore',
            render: (v, record)=>{
                return record.bugScore + record.prScore + record.utScore
            }
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            providerType: 'Resource',
            providerName: 'huaweicloud_elb_listener',
            owner: '侯鹏',
            prePaidSupport: '支持',
            tagSupport: '支持',
            epsSupport: '不支持',
            prScore: 17,
            utScore: -3,
            bugScore: 0,
        },
        {
            key: '2',
            providerType: 'Resource',
            providerName: 'huaweicloud_lb_listener',
            owner: '侯鹏',
            prePaidSupport: '支持',
            tagSupport: '支持',
            epsSupport: '不支持',
            prScore: 10,
            utScore: 0,
            bugScore: 0,
        },
        {
            key: '3',
            providerType: 'Resource',
            providerName: 'huaweicloud_lb_loadbalancer',
            owner: '侯鹏',
            prePaidSupport: '支持',
            tagSupport: '支持',
            epsSupport: '不支持',
            prScore: 12,
            utScore: -2,
            bugScore: -3,
        },
    ];

    return <Table columns={columns} dataSource={data} size={'middle'} pagination={false}/>
}

const Provider: React.FC = () => {

    return <div className={'provider'}>
        <Breadcrumb
            items={[{title: '首页'}, {title: 'Provider 分析'}]}
            style={{margin: '10px 0'}}
        />
        <div className={'header'}>
            <SearchForm onSearch={() => {
            }} options={['owner']}/>
        </div>
        <div style={{background: '#fff', marginTop: '15px'}}>
            <div className={'custom-title'}>资源列表</div>
            <div className={'provider-list'}>
                <ProviderList/>
            </div>
        </div>
    </div>
}

export default Provider;
