import CustomBreadcrumb from '@/components/Breadcrumb';
import { deleteAutoGenerateData, getAutoGenerateList, saveGenerateArchive } from '@/services/auto-generate/api';
import { Button, Col, message, Modal, Row, Space, Table, Tabs, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import DeleteBtn from "@/components/delete";
import './auto-generate-list.less';
import { toLongDate } from "@/utils/common";
import { history, useLocation } from 'umi';
import ProviderBaseSumDialog from "@/pages/Provider/provider-base/provider-base-sum-dialog";
import InstallToolDialog from "@/pages/AutoGenerateList/install-tool-dialog";
import { getProductList } from "@/services/product/api";
import { ProFormSelect, ProFormText, ProSchemaValueEnumObj, QueryFilter } from '@ant-design/pro-components';

type FormProps = {
    productName: string;
    providerType: string;
    providerName: string;
};

const SearchForm: React.FC<{ owner?: string, onSearch: (val: FormProps) => any }> = (props) => {
    const [productNameMap, setProductNameMap] = useState<ProSchemaValueEnumObj>({});
    const [productDisable, setProductDisable] = useState(false);

    useEffect(() => {
        getProductList().then((d: Global.List<Product.Product[]>) => {
            const map: ProSchemaValueEnumObj = {};
            d.items.map((p) => p.productName)
                .sort()
                .forEach(n => map[n] = n);
            setProductNameMap(map);
        });
    }, []);

    const onProductNameChange = (v: string) => {

    };

    return (
        <QueryFilter<FormProps>
            span={4}
            labelWidth={80}
            searchGutter={8}
            style={{ marginTop: '30px', marginBottom: '-27px' }}
            onFinish={async (values) => props.onSearch(values)}
        >
            <ProFormSelect
                name="productName"
                label="服务名称"
                disabled={productDisable}
                showSearch
                fieldProps={{
                    onChange: onProductNameChange,
                }}
                valueEnum={productNameMap}
            />
            <ProFormSelect
                name="providerType"
                label="资源类型"
                showSearch
                valueEnum={{
                    DataSource: 'DataSource',
                    Resource: 'Resource',
                }}
            />
            <ProFormText name="providerName" label="资源名称" placeholder={'支持模糊搜索'} />
        </QueryFilter>
    )
}

const AutoGenerateList: React.FC = () => {
    const location = useLocation();
    const [data, setData] = useState<AutoGenerate.ProviderGenerate[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [archiveTag, setArchiveTag] = useState<boolean>(location.hash.split('/').includes("archive"));
    const [queryParams, setQueryParams] = useState<AutoGenerate.queryListParams>({  });

    const loadData = (pageSize: number, pageNum: number) => {
        getAutoGenerateList(queryParams, pageSize, pageNum, archiveTag).then((d) => {
            setData(d.items);
            setTotal(d.total || 0);
        });
    }

    useEffect(() => {
        loadData(pageSize, pageNum);
    }, [pageSize, pageNum, archiveTag, queryParams]);

    useEffect(() => {
        setArchiveTag(location.hash.split('/').includes("archive"))
    }, [location]);

    const onSearch = (formVal: FormProps) => {
        setPageNum(1);
        setQueryParams({
            productName: formVal.productName,
            providerType: formVal.providerType,
            providerName: formVal.providerName,
        });
    }

    const columns: ColumnsType<AutoGenerate.ProviderGenerate> = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center',
            render: (v, r, i) => i + 1,
        },
        {
            title: '操作',
            dataIndex: 'operate',
            align: 'center',
            width: 200,
            render: (v, record) => {
                let saveArchiveBtn = <>
                    <a rel="noreferrer"
                       onClick={() => {
                           saveGenerateArchive(record.id).then(() => message.info('归档成功'));
                       }}
                    >
                        存档
                    </a>
                    <ProviderBaseSumDialog
                        text={'基线'}
                        providerType={record.providerType}
                        providerName={record.providerName}
                    />
                </>
                if (archiveTag) {
                    saveArchiveBtn = <>
                        <span style={{color: '#00000040'}}>存档</span>
                        <span style={{color: '#00000040'}}>基线</span>
                    </>
                }

                return (
                    <Space size={15}>
                        <a rel="noreferrer" onClick={() => history.push(`/auto-generate-provider#/id/${record.id}`)}>
                            编辑
                        </a>
                        {saveArchiveBtn}
                        <DeleteBtn text={'删除'}
                                   title={'删除确认'}
                                   link
                                   content={<div>确定要删除吗？删除后不可恢复</div>}
                                   onOk={() => onDeleteData(record)}
                        />
                    </Space>
                );
            },
        },
        {
            title: '服务名称',
            dataIndex: 'productName',
            ellipsis: true,
            width: 100,
            align: 'center',
        },
        {
            title: '类型',
            dataIndex: 'providerType',
            key: 'providerType',
            align: 'center',
            width: 120,
        },
        {
            title: '版本',
            dataIndex: 'version',
            key: 'version',
            align: 'center',
            width: 70,
        },
        {
            title: <>资源名称<span style={{fontWeight: 'normal'}}>（点击进入编辑）</span></>,
            dataIndex: 'providerName',
            key: 'providerName',
            ellipsis: true,
            render: (v, row) => {
                if (archiveTag) {
                    return <>
                        <a rel="noreferrer"
                           onClick={() => history.push(`/auto-generate-provider#/id/${row.id}`)}
                        >
                            {v}
                        </a>
                        &nbsp;&nbsp;
                        <Tag>{row.version}</Tag>
                    </>
                }

                let cmd = `pms import -r ${row.providerName} --skip-test`
                if (row.providerType === 'DataSource') {
                    cmd = `pms import -d ${row.providerName} --skip-test`
                }
                return <>
                    <Txt value={cmd} tooltip={row.providerName} style={{display: 'inline-block'}}>
                        <a rel="noreferrer"
                           onClick={() => history.push(`/auto-generate-provider#/id/${row.id}`)}
                        >
                            {v}
                        </a>
                    </Txt>
                </>;
            },
        },
        {
            title: 'API变更',
            dataIndex: 'apiCount',
            key: 'apiCount',
            align: 'center',
            width: 200,
            render: () => '',
        },
        {
            title: 'API数量',
            dataIndex: 'apiCount',
            key: 'apiCount',
            align: 'center',
            width: 100,
        },
        {
            title: '最后修改',
            dataIndex: 'lastUpdateBy',
            align: 'center',
            width: 150,
        },
        {
            title: '修改日期',
            dataIndex: 'updated',
            align: 'center',
            width: 180,
            render: toLongDate,
        },
        {
            title: '创建人',
            dataIndex: 'createdBy',
            key: 'createdBy',
            align: 'center',
            width: 120,
        },
        {
            title: '创建日期',
            dataIndex: 'created',
            align: 'center',
            width: 180,
            render: toLongDate,
        },
        {
            title: '操作',
            dataIndex: 'operate',
            align: 'center',
            width: 150,
            render: (v, record) => {
                let saveArchiveBtn = <a rel="noreferrer" onClick={() => {
                    saveGenerateArchive(record.id).then(() => message.info('归档成功'));
                }}>存档</a>
                if (archiveTag) {
                    saveArchiveBtn = <>&nbsp;</>
                }

                return (
                    <Space>
                        <a rel="noreferrer" onClick={() => history.push(`/auto-generate-provider#/id/${record.id}`)}>
                            编辑
                        </a>
                        {saveArchiveBtn}
                        <DeleteBtn text={'删除'}
                                   title={'删除确认'}
                                   link
                                   content={<div>确定要删除吗？删除后不可恢复</div>}
                                   onOk={() => onDeleteData(record)}
                        />
                    </Space>
                );
            },
        },
    ];

    const onDeleteData = (record: AutoGenerate.ProviderGenerate) => {
        if (!record.id) {
            return;
        }
        deleteAutoGenerateData(record.id).then(() => loadData(pageSize, pageNum));
    }

    const getColumn = () => {
        if (!archiveTag) {
            return columns.filter(t => t.key !== 'version');
        }

        return columns;
    }

    return <>
        <CustomBreadcrumb items={[{ title: '首页' }, { title: '自动生成' }]} />
        <div className={'auto-generate-list'}>
            <Row>
                <Col span={12}>
                    <Button type="primary" size='middle'
                            onClick={() => history.push(`/auto-generate-provider`)}>新建</Button>
                    {
                        archiveTag ?
                            <Button size='middle' type={'link'}
                                    onClick={() => history.push(`/auto-generate-provider-list`)}>
                                返回列表
                            </Button> :
                            <Button size='middle' type={'link'}
                                    onClick={() => history.push(`/auto-generate-provider-list#/archive`)}>
                                查看归档列表
                            </Button>
                    }
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <InstallToolDialog />
                </Col>
            </Row>

            <SearchForm
                onSearch={onSearch}/>
            <Table
                style={{ marginTop: '20px' }}
                columns={getColumn()}
                dataSource={data}
                size={'middle'}
                rowKey={(record) => record.id}
                pagination={{
                    defaultCurrent: 1,
                    total: total,
                    size: 'default',
                    pageSize: pageSize,
                    current: pageNum,
                    showTotal: (total) => `总条数: ${total}`,
                    onShowSizeChange: (current, size) => {
                        setPageSize(size);
                    },
                    onChange: (page, size) => {
                        setPageSize(size);
                        setPageNum(page);
                    },
                }}
            />
        </div>
    </>
}
export default AutoGenerateList;
