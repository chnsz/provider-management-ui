import ProviderApiList from '@/pages/Portal/components/provider-api-list';
import { getProviderCar } from '@/services/portal/api';
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';
import { Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import '../portal.less';

const ProviderCard: React.FC = () => {
    const [data, setData] = useState<Portal.ProviderCar[]>();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        getProviderCar().then((rsp) => {
            setData(rsp);
            if (data) {
                console.log('data: ' + data[0].name);
            }
        });
    }, []);

    const columns: ColumnsType<Portal.ProviderCar[]> = [
        {
            title: '序号',
            dataIndex: 'serialNo',
            key: 'serialNo',
        },
        {
            title: '资源类型',
            dataIndex: 'resourceType',
            key: 'resourceType',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (name) => <a href="https://www.baidu.com/">{name}</a>,
        },
        {
            title: '引用API个数',
            key: 'apicount',
            dataIndex: 'apicount',
            align: 'center',
            render: (apicount) => (
                <a type="button" onClick={showModal}>
                    {apicount}
                </a>
            ),
        },
        {
            title: '法电',
            key: 'flexible_engine_status',
            dataIndex: 'flexible_engine_status',
            align: 'center',
            render: (flexible) => {
                switch (flexible) {
                    case '1':
                        return (
                            <span>
                                <CheckCircleOutlined style={{ color: '#5ec829' }} /> 已上线
                            </span>
                        );
                    case '2':
                        return (
                            <span>
                                <InfoCircleOutlined style={{ color: '#faad14' }} /> 未上线
                            </span>
                        );
                    case '3':
                        return (
                            <span>
                                <ExclamationCircleOutlined style={{ color: '#f5222d' }} /> API缺失
                            </span>
                        );
                    case '4':
                        return (
                            <span>
                                <MinusCircleOutlined style={{ color: '#a7a7a7' }} />
                            </span>
                        );
                    default:
                        return null;
                }
            },
        },
        {
            title: 'G42',
            key: 'g42_status',
            dataIndex: 'g42_status',
            align: 'center',
            render: (g42sta) => {
                switch (g42sta) {
                    case '1':
                        return (
                            <span>
                                <CheckCircleOutlined style={{ color: '#5ec829' }} /> 已上线
                            </span>
                        );
                    case '2':
                        return (
                            <span>
                                <InfoCircleOutlined style={{ color: '#faad14' }} /> 未上线
                            </span>
                        );
                    case '3':
                        return (
                            <span>
                                <ExclamationCircleOutlined style={{ color: '#f5222d' }} /> API缺失
                            </span>
                        );
                    case '4':
                        return (
                            <span>
                                <MinusCircleOutlined style={{ color: '#a7a7a7' }} />
                            </span>
                        );
                    default:
                        return null;
                }
            },
        },
        {
            title: '法电 参数一致性',
            key: 'flexible_engine_param',
            dataIndex: 'flexible_engine_param',
            align: 'center',
            render: (flexiblepar) => {
                switch (flexiblepar) {
                    case '1':
                        return (
                            <span>
                                <CheckCircleOutlined style={{ color: '#5ec829' }} /> 支持
                            </span>
                        );
                    case '2':
                        return (
                            <span>
                                <InfoCircleOutlined style={{ color: '#faad14' }} /> 未上线
                            </span>
                        );
                    case '3':
                        return (
                            <span>
                                <ExclamationCircleOutlined style={{ color: '#f5222d' }} /> API缺失
                            </span>
                        );
                    case '4':
                        return (
                            <span>
                                <MinusCircleOutlined style={{ color: '#a7a7a7' }} />
                            </span>
                        );
                    default:
                        return null;
                }
            },
        },
        {
            title: 'G42 参数一致性',
            key: 'g42_status_param',
            dataIndex: 'g42_status_param',
            align: 'center',
            render: (g42param) => {
                switch (g42param) {
                    case '1':
                        return (
                            <span>
                                <CheckCircleOutlined style={{ color: '#5ec829' }} /> 支持
                            </span>
                        );
                    case '2':
                        return (
                            <span>
                                <InfoCircleOutlined style={{ color: '#faad14' }} /> 未上线
                            </span>
                        );
                    case '3':
                        return (
                            <span>
                                <ExclamationCircleOutlined style={{ color: '#f5222d' }} /> API缺失
                            </span>
                        );
                    case '4':
                        return (
                            <span>
                                <MinusCircleOutlined style={{ color: '#a7a7a7' }} />
                            </span>
                        );
                    default:
                        return null;
                }
            },
        },
        {
            title: '企业项目',
            key: 'eps_support',
            dataIndex: 'eps_support',
            align: 'center',
            render: (enterport) => {
                switch (enterport) {
                    case '1':
                        return (
                            <span>
                                <CheckCircleOutlined style={{ color: '#5ec829' }} /> 支持
                            </span>
                        );
                    case '2':
                        return (
                            <span>
                                <InfoCircleOutlined style={{ color: '#faad14' }} /> 未上线
                            </span>
                        );
                    case '3':
                        return (
                            <span>
                                <ExclamationCircleOutlined style={{ color: '#f5222d' }} /> API缺失
                            </span>
                        );
                    case '4':
                        return (
                            <span>
                                <MinusCircleOutlined style={{ color: '#a7a7a7' }} />
                            </span>
                        );
                    default:
                        return null;
                }
            },
        },
    ];

    return (
        <>
            <div className={'portal-card service-sum-card'}>
                <div className={'summary-header'}>资源信息</div>
                <div className={'summary-container'}>
                    <Table columns={columns} dataSource={data} pagination={false} />
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
        </>
    );
};
export default ProviderCard;
