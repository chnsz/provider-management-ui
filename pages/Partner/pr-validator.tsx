import React, {useEffect, useState} from "react";
import './partner.less'
import CustomBreadcrumb from "@/components/Breadcrumb";
import {Input, message, Space, Table, Tag} from "antd";
import {request} from "umi";
import {PMS_PATH} from "@/services/api";
import ProviderDocsIssue from "@/pages/Partner/components/provider_docs_issue";
import {getProviderSyncSum} from "@/services/provider/api";
import type {ColumnsType} from "antd/es/table";
import ProviderSyncIssueStaticDialog from "@/pages/Partner/components/provider_sync_issue_dialog_static";

const {Search} = Input;

async function validPr(url: string) {
    return request<string>(`${PMS_PATH}/checker/docs`, {
        method: 'POST',
        params: {url},
    });
}

async function getCheckStatus(data: string[]) {
    return request<Record<string, string[]>>(`${PMS_PATH}/checker/status`, {
        method: 'POST',
        data: {data},
    });
}

const statusColor = {
    '代码下载失败': 'red',
    '代码下载完成': 'blue',
    '资源解析失败': 'red',
    '资源解析完成': 'blue',
    '文档解析完成': 'blue',
    'Schema解析完成': 'blue',
    '比对完成': 'blue',
}

const PrValidator: React.FC = () => {
    const [providerSyncSum, setProviderSyncSum] = useState<Provider.ProviderSyncSum[]>([]);
    const [dataSource, setDataSource] = useState<{ title: string, url: string, status: string[] }[]>([]);

    const loadData = () => {
        getProviderSyncSum().then(t => {
            setProviderSyncSum(t.items);
        });
    }

    const loadStatus = () => {
        const data = dataSource.map(t => t.url);
        getCheckStatus(data).then(r => {
            const ds = [];
            for (const key in r) {
                const statusArr = r[key];
                ds.push({url: key, title: statusArr[1], status: statusArr.filter((v, n) => n != 1)});
            }
            setDataSource(ds);
        });
    }

    useEffect(() => {
        loadData();
        loadStatus()

        const iid = setInterval(() => {
            loadStatus();
            loadData();
        }, 1000 * 10);

        return () => {
            clearInterval(iid);
        }
    }, []);

    const onSearch = (e: any) => {
        if (process.env.NODE_ENV !== 'development' && location.host !== 'pms-test.huaweicloud.plus') {
            message.error('只许在测试环境使用，测试环境地址：http://pms-test.huaweicloud.plus')
            return
        }

        const val = e.target?.value || e;
        if (!val.trim()) {
            message.warn('PR链接为空，请检查')
            return
        }

        validPr(val.trim()).then(() => {
            loadStatus();
        });
    }

    const columns: ColumnsType<{ title: string, url: string, status: string[] }> = [
        {
            title: 'PR',
            dataIndex: 'url',
            width: 500,
            ellipsis: true,
            render: (v, row) => {
                return <a href={v} target={'_blank'} rel="noopener noreferrer">{row.title ? row.title : v}</a>
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (v) => {
                return v.map((txt: string) => {
                    let color = statusColor[txt] || '#55acee';
                    if (txt.includes('校验') && txt !== '校验 R: 0, D: 0') {
                        color = 'volcano';
                    }
                    return <Tag key={txt} color={color}>{txt}</Tag>
                })
            },
        }, {
            title: '操作',
            dataIndex: 'url',
            width: 100,
            align: 'center',
            render: (v, row) => {
                return <ProviderSyncIssueStaticDialog
                    content={<a>查看文档问题</a>}
                    url={row.url}
                />
            }
        },
    ];

    return <div>
        <CustomBreadcrumb items={[{title: '首页'}, {title: '常用工具'}, {title: '检查PR文档'}]}/>
        <div style={{padding: '20px', background: '#fff'}}>
            <Space direction={'vertical'} style={{width: '100%'}} size={20}>
                <Search
                    placeholder="请输入PR地址，如：https://github.com/huaweicloud/terraform-provider-huaweicloud/pull/3428"
                    allowClear
                    enterButton="开始校验"
                    onPressEnter={onSearch}
                    onSearch={onSearch}
                />
                <Table dataSource={dataSource} columns={columns} pagination={false} size={'middle'}/>
            </Space>
        </div>
        <div className={'partner'} style={{background: '#fff', marginTop: '20px'}}>
            <div className={'custom-title'}>资源文档问题</div>
            <div style={{padding: '20px'}}>
                <ProviderDocsIssue data={providerSyncSum} loadData={loadData}/>
            </div>
        </div>
    </div>
}

export default PrValidator;
