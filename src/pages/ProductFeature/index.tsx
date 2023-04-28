import EditableDes from '@/components/EditableDescription';
import SearchForm, { SearchFormProps } from '@/components/SearchForm';
import AddFeatureDialog from '@/pages/ProductFeature/components/add-feature-dialog';
import { getCoverageStatus, getSourceStatus } from '@/pages/ProductFeature/components/sider-list';
import {
    getProductFeatureList,
    removeProductFeature,
    updateProductFeature,
} from '@/services/product-feature/api';
import { toShortDate } from '@/utils/common';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Breadcrumb, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import './product-feature.less';

const { confirm } = Modal;

const ProductFeature: React.FC<{ productName?: string; simple?: boolean }> = (props) => {
    const [data, setData] = useState<ProductFeature.ProductFeature[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageNum, setPageNum] = useState<number>(1);
    const [queryParams, setQueryParams] = useState<{ productName?: string[]; owner?: string[] }>(
        {},
    );

    const loadData = () => {
        const params = queryParams;
        if (props.productName) {
            params.productName = [props.productName];
        }
        getProductFeatureList(params, pageSize, pageNum).then((d) => {
            setData(d.items);
            setTotal(d.total);
        });
    };

    useEffect(loadData, [pageNum, pageSize, queryParams]);

    const onSearch = (formData: SearchFormProps) => {
        setQueryParams({ productName: formData.productName, owner: formData.owner });
    };

    const onCoverageStatusChange = (
        oldVal: string,
        newVal: string,
        record: ProductFeature.ProductFeature,
    ) => {
        updateProductFeature(record.id, { actualCoverage: newVal }).then(loadData);
    };

    const onDelete = (id: number) => {
        confirm({
            title: '删除服务特性',
            icon: <ExclamationCircleFilled />,
            maskTransitionName: '',
            width: 600,
            okText: '删除',
            cancelText: '取消',
            content: (
                <>
                    <div>确定要删除？</div>
                </>
            ),
            onOk() {
                removeProductFeature(id).then((rsp) => {
                    if (rsp.affectedRow === 0) {
                        return;
                    }
                    loadData();
                });
            },
        });
    };

    const columns: ColumnsType<ProductFeature.ProductFeature> = [
        {
            title: '序号',
            dataIndex: 'serialNo',
            align: 'center',
            width: 90,
            render: (v, r, i) => (pageNum - 1) * pageSize + i + 1,
        },
        {
            title: '服务名称',
            dataIndex: 'productName',
            width: 120,
        },
        {
            title: '特性名称',
            dataIndex: 'name',
        },
        {
            title: '覆盖状态',
            dataIndex: 'actualCoverage',
            width: '15%',
            render: (v, record) => {
                return (
                    <div>
                        <EditableDes
                            value={record.actualCoverage || record.coverageStatus}
                            options={[
                                { label: '已覆盖', value: 'covered' },
                                { label: '部分覆盖', value: 'partially_covered' },
                                { label: '未覆盖', value: 'not_covered' },
                            ]}
                            onChange={(newVal) =>
                                onCoverageStatusChange(v, newVal.toString(), record)
                            }
                        >
                            {getCoverageStatus(record.actualCoverage || record.coverageStatus)}
                        </EditableDes>
                    </div>
                );
            },
        },
        {
            title: 'API 数量',
            dataIndex: 'apiCount',
            align: 'center',
            width: '8%',
        },
        {
            title: 'API 对接量',
            dataIndex: 'apiUsed',
            align: 'center',
            width: '8%',
        },
        {
            title: '录入来源',
            dataIndex: 'source',
            align: 'center',
            width: '10%',
            render: getSourceStatus,
        },
        /* {
            title: '更新时间',
            dataIndex: 'updated',
            align: 'center',
            width: 150,
            render: toShortDate,
        },*/
        {
            title: '创建时间',
            dataIndex: 'created',
            align: 'center',
            width: 150,
            render: toShortDate,
        },
        {
            title: '操作',
            dataIndex: 'id',
            align: 'center',
            width: 130,
            render: (v) => <a onClick={() => onDelete(v)}>删除</a>,
        },
    ];

    const getProductName = () => {
        if (props.productName) {
            return [props.productName];
        }

        const hashArr = location.hash.split('/');
        if (hashArr.length === 2) {
            return [hashArr[1]];
        }
        return [];
    };

    return (
        <>
            {props.simple ? (
                ''
            ) : (
                <>
                    <Breadcrumb
                        items={[{ title: '首页' }, { title: '特性分析' }]}
                        style={{ margin: '10px 0' }}
                    />
                    <div style={{ background: '#fff', padding: '20px' }}>
                        <SearchForm
                            onSearch={onSearch}
                            options={['owner', 'product']}
                            defaultValue={{ productName: getProductName() }}
                        />
                    </div>
                </>
            )}
            <div style={{ background: '#fff', padding: '20px', marginTop: '15px' }}>
                {props.simple ? (
                    ''
                ) : (
                    <>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>特性列表</div>
                        <div style={{ padding: '15px 0 10px 5px' }}>
                            <AddFeatureDialog
                                onSuccess={loadData}
                                productName={get(queryParams, 'productName[0]')}
                            />
                        </div>
                    </>
                )}
                <Table
                    columns={columns}
                    dataSource={data}
                    size={'middle'}
                    rowKey={(record) => record.id}
                    pagination={{
                        defaultCurrent: 1,
                        total: total,
                        size: 'default',
                        pageSize: pageSize,
                        current: pageNum,
                        showTotal: (total) => `总条数：${total}`,
                        onShowSizeChange: (current, size) => {
                            setPageSize(size);
                        },
                        onChange: (page: number, size: number) => {
                            setPageNum(page);
                            setPageSize(size);
                        },
                    }}
                />
            </div>
        </>
    );
};

export default ProductFeature;
