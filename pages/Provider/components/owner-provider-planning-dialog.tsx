import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from "antd";
import { getProductList } from "@/services/product/api";
import { ProSchemaValueEnumObj } from "@ant-design/pro-utils/es/typing";
import type { ColumnsType } from "antd/es/table/interface";
import { changeProviderPlanningStatus, deleteProviderPlanning, getProviderPlanningListByOwner } from "@/services/provider-planning/api";
import { toShortDate } from "@/utils/common";
import { getTaskStatus } from "@/pages/Task/components/task-detail";
import { ProFormSelect, ProFormText, QueryFilter } from '@ant-design/pro-components';
import DeleteBtn from '@/components/delete';

type FormProps = {
    productName: string;
    title: string;
    status: string;
};

const SearchForm: React.FC<{ owner?: string, productName?: string, onSearch: (val: FormProps) => any }> = (props) => {
    const [productNameMap, setProductNameMap] = useState<ProSchemaValueEnumObj>({});
    const [productDisable, setProductDisable] = useState(false);

    useEffect(() => {
        getProductList(props.owner).then((d: Global.List<Product.Product[]>) => {
            const map: ProSchemaValueEnumObj = {};
            d.items.map((p) => p.productName)
                .sort()
                .forEach(n => map[n] = n);
            setProductNameMap(map);
            if (props.productName && map[props.productName]) {
                setProductDisable(true);
            }
        });
    }, []);

    const onProductNameChange = (v: string) => {

    };

    return (
        <QueryFilter<FormProps>
            span={6}
            labelWidth={80}
            searchGutter={8}
            style={{ marginTop: '20px', marginBottom: '-27px' }}
            onFinish={async (values) => props.onSearch(values)}
        >
            <ProFormSelect
                name="productName"
                label="产品服务"
                initialValue={props.productName}
                disabled={productDisable}
                showSearch
                fieldProps={{
                    onChange: onProductNameChange,
                }}
                valueEnum={productNameMap}
            />
            <ProFormText name="title" label="标题" placeholder={'支持模糊搜索'} />
            <ProFormSelect
                name="status"
                label="状态"
                showSearch
                initialValue={'new'}
                valueEnum={{
                    new: '未启动',
                    // freeze: '冻结',
                    processing: '处理中',
                    // merging: '待合并',
                    // merged: '已合并',
                    closed: '关闭',
                }}
            />
        </QueryFilter>
    )
}

const OwnerProviderPlanningDialog: React.FC<{
    content: any,
    owner: string,
    dashBoardType?: string,
    productName?: string,
    onClosed?: () => any,
}> = ({ content, owner, dashBoardType, productName, onClosed }) => {
    const [data, setData] = useState<ProviderPlanning.ProviderPlanning[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [queryParams, setQueryParams] = useState<ProviderPlanning.QueryParams>({ status: 'new', productName: productName });

    const showModal = () => {
        getProviderPlanningList();
        setIsModalOpen(true);
    };

    const getProviderPlanningList = () => {
        getProviderPlanningListByOwner(owner, queryParams).then((d) => {
            setData(d.items);
        });
    }

    const closeModel = () => {
        if (onClosed) {
            onClosed()
        }
        setIsModalOpen(false);
    };

    useEffect(() => {
        getProviderPlanningList();
    }, [queryParams]);

    const onSearch = (formVal: FormProps) => {
        setQueryParams({
            productName: formVal.productName,
            title: formVal.title,
            status: formVal.status,
        });
    }

    const onDeleteData = (record: ProviderPlanning.ProviderPlanning) => {
        if (!record.id) {
            return;
        }

        deleteProviderPlanning(record.id).then(() => {
            getProviderPlanningList();
        });
    }

    const closePlanning = (record: ProviderPlanning.ProviderPlanning) => {
        if (!record.id) {
            return;
        }

        changeProviderPlanningStatus(record.id, 'closed').then(() => {
            getProviderPlanningList();
        })
    }

    const columns: ColumnsType<ProviderPlanning.ProviderPlanning> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: 80,
            render: (v, r, i) => i + 1,
        },
        {
            title: '服务',
            dataIndex: 'productName',
            width: 95,
            ellipsis: true,
        },
        {
            title: '标题',
            dataIndex: 'title',
            render: (v, row) => {
                return <a href={'/provider-planning#/id/' + row.id} target="_blank" rel="noopener noreferrer">{v}</a>
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: v => getTaskStatus(v),
            align: 'center',
            width: 100,
        },
        {
            title: '创建时间',
            dataIndex: 'created',
            width: 150,
            align: 'center',
            render: toShortDate
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: 100,
            align: 'center',
            render: (v, record) => {
                return (
                    <>
                        <a type="button"
                            onClick={() => closePlanning(record)}>
                            关闭&ensp;&ensp;
                        </a>
                        <DeleteBtn text={'删除'}
                            title={'删除确认'}
                            link
                            content={<div>确定要删除吗？删除后不可恢复</div>}
                            onOk={() => onDeleteData(record)}
                        />
                    </>
                );
            },
        },
    ];

    let title = '资源规划列表';
    if (owner && !productName) {
        title = '资源规划列表【' + owner + '】';
    }

    return (
        <>
            <div style={{ cursor: 'pointer' }}
                onClick={showModal}>
                {dashBoardType === 'personal' ?
                    <div>{content}</div> :
                    <Button type={'link'}>
                        {content}
                    </Button>}
            </div>
            <Modal title={title}
                transitionName={''}
                open={isModalOpen}
                onOk={closeModel}
                onCancel={closeModel}
                width={'75%'}
                footer={[
                    <Button key="close"
                        type="primary"
                        onClick={closeModel}>
                        关闭
                    </Button>
                ]}>
                <SearchForm owner={owner}
                    onSearch={onSearch}
                    productName={productName} />
                <div style={{ paddingTop: "15px" }}>
                    <Table columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={data}
                        size={'middle'}
                        pagination={false} />
                </div>
            </Modal>
        </>
    );
};

export default OwnerProviderPlanningDialog;
