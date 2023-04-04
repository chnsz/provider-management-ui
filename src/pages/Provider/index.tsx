import ProviderApiList from '@/pages/Portal/components/provider-api-list';
import { getCateType, getProviderList } from '@/services/portal/api';
import { Button, Col, Input, Modal, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import '../Portal/portal.less';
import './provider.less';

const Provider: React.FC = () => {
    const options: Portal.CateType[] = [];
    const [cateType, setCateType] = useState<Portal.CateType[]>();
    const [data, setData] = useState<Portal.ProviderList[]>();
    const [cloudName, setCloudName] = useState<string>();
    const [resourceType, setResourceType] = useState<string>();
    const [resourceName, setResourceName] = useState<string>();
    const [status, setStatus] = useState<string>();

    const [totalPage, setTotalPage] = useState<number>();
    const [pageSize, setPageSize] = useState<number>(20);
    const [culPage, setCulPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [params] = useState({
        /** 当前的页码 */
        current: culPage,
        /** 页面的容量 */
        pageSize: pageSize,
        /** 云名称 */
        cloudName: '',
        /** 资源类型 */
        resourceType: '',
        /** 资源名称 */
        resourceName: '',
        /** 状态 */
        status: '',
    });

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        getProviderList(params).then((rsp) => {
            setData(rsp.data.items);
            setTotalPage(rsp.data.total);
        });

        getCateType().then((rsp) => {
            rsp.data.items?.forEach((it) => {
                options.push({
                    value: it,
                    label: it,
                });
            });
            setCateType(options);
        });
    }, []);

    const columns: ColumnsType<Portal.ProviderList> = [
        {
            title: '序号',
            key: 'id',
            align: 'center',
            render: (text, record, index) => `${(culPage - 1) * pageSize + (index + 1)}`,
        },
        {
            title: '产品名',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: '云名称',
            dataIndex: 'cloudName',
            key: 'cloudName',
        },
        {
            title: '类别',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <a href="https://registry.terraform.io/providers/huaweicloud/huaweicloud/latest/docs/resources/modelarts_dataset_version">
                    {name}
                </a>
            ),
        },
        {
            title: '活动状态',
            key: 'activeStatus',
            dataIndex: 'activeStatus',
        },
        {
            title: '发布状态',
            key: 'publishStatus',
            dataIndex: 'publishStatus',
            align: 'center',
        },
        {
            title: '发布日期',
            key: 'releaseDate',
            dataIndex: 'releaseDate',
            align: 'center',
        },
        {
            title: '标签支持',
            key: 'tagSupport',
            dataIndex: 'tagSupport',
            align: 'center',
        },
        {
            title: '包周期支持',
            key: 'prePaidSupport',
            dataIndex: 'prePaidSupport',
            align: 'center',
        },
        {
            title: 'EPS支持',
            key: 'epsSupport',
            dataIndex: 'epsSupport',
            align: 'center',
        },
    ];

    function changePageSize(pageSize: number, current: number) {
        setPageSize(pageSize);
        setCulPage(current);

        getProviderList(params).then((rsp) => {
            setData(rsp.data.items);
            setTotalPage(rsp.data.total);
        });
    }

    function changePage(pageSize: number, current: number) {
        changePageSize(pageSize, current);
    }
    const handleChangeCateLog = (value: { value: string; label: React.ReactNode }) => {
        setCloudName(value.value);
    };
    const handleChangeType = (value: { value: string; label: React.ReactNode }) => {
        setResourceType(value.value);
    };
    const handleChangeStatus = (value: { value: string; label: React.ReactNode }) => {
        setStatus(value.value);
    };

    function handleClick() {
        getProviderList({
            // /** 当前的页码 */
            current: culPage,
            // /** 页面的容量 */
            pageSize: pageSize,
            /** 云名称 */
            cloudName: cloudName,
            /** 资源类型 */
            resourceType: resourceType,
            /** 资源名称 */
            resourceName: resourceName,
            /** 状态 */
            status: status,
        }).then((rsp) => {
            setData(rsp.data.items);
            setTotalPage(rsp.data.total);
        });
    }

    return (
        <div className={'provider'}>
            <div className={'bread-crumbs-text'}>
                首页&nbsp;/&nbsp;&nbsp;资源治理 &nbsp;/&nbsp;&nbsp;Provider 列表{' '}
            </div>
            <Row>
                <Col span={24} style={{ background: '#ffffff', paddingTop: '16px' }}>
                    <div className={'provider-car'}>
                        <div className={'divide-space'}>
                            <span style={{ marginTop: '5px' }}>Catelog:&nbsp;&nbsp;</span>
                            <span>
                                <Select
                                    labelInValue
                                    allowClear
                                    style={{ width: 186, textAlign: 'left' }}
                                    dropdownStyle={{ marginTop: '1px' }}
                                    options={cateType}
                                    onChange={handleChangeCateLog}
                                />
                            </span>
                        </div>
                        <div className={'divide-space'}>
                            <span style={{ marginTop: '5px' }}>资源类型:&nbsp;&nbsp;</span>
                            <span>
                                <Select
                                    labelInValue
                                    allowClear
                                    style={{ width: 186, textAlign: 'left' }}
                                    onChange={handleChangeType}
                                    options={[
                                        {
                                            value: 'Resource',
                                            label: 'Resource',
                                        },
                                        {
                                            value: 'DataResource',
                                            label: 'DataResource',
                                        },
                                    ]}
                                />
                            </span>
                        </div>
                        <div className={'divide-space'}>
                            <span style={{ marginTop: '5px' }}>资源名称:&nbsp;&nbsp;</span>
                            <span>
                                <Input
                                    placeholder="请输入"
                                    onChange={(e) => setResourceName(e.target.value)}
                                />
                            </span>
                        </div>
                        <div className={'divide-space'}>
                            <span style={{ marginTop: '5px' }}>状态:&nbsp;&nbsp;</span>
                            <span>
                                <Select
                                    labelInValue
                                    allowClear
                                    style={{ width: 186, textAlign: 'left' }}
                                    onChange={handleChangeStatus}
                                    options={[
                                        {
                                            value: '正常',
                                            label: '正常',
                                        },
                                        {
                                            value: '废弃',
                                            label: '废弃',
                                        },
                                    ]}
                                />
                            </span>
                        </div>
                    </div>
                    <div className={'loc-location'}>
                        <Button
                            type="primary"
                            style={{ margin: '0 20px' }}
                            onClick={() => handleClick()}
                        >
                            查询
                        </Button>
                        <Button>重置</Button>
                    </div>
                </Col>
            </Row>
            <div style={{ height: '24px', background: '#f5f5f5' }} />
            <Row>
                <Col span={24}>
                    <div className={'portal-card'}>
                        <div className={'provider-text-title'}>查询结果</div>
                        <div>
                            <Table
                                rowKey={(record) => record.id}
                                columns={columns}
                                dataSource={data}
                                pagination={{
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    total: totalPage,
                                    showTotal: () => '共' + totalPage + '条',
                                    pageSize: pageSize,
                                    current: culPage,
                                    onShowSizeChange: (current: number, pageSize: number) =>
                                        changePageSize(pageSize, current),
                                    onChange: (current: number, pageSize: number) =>
                                        changePage(pageSize, current),
                                }}
                            />
                        </div>
                    </div>
                    <Modal
                        title="引用API个数"
                        open={isModalOpen}
                        footer={null}
                        onCancel={handleCancel}
                        width={1000}
                    >
                        <ProviderApiList />
                    </Modal>
                </Col>
            </Row>
        </div>
    );
};

export default Provider;
