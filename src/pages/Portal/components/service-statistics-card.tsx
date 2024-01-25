import ApiDialogList from '@/pages/Portal/components/api-dialog-list';
import { getApiPanelSum } from '@/services/portal/api';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Col, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import '../portal.less';
import { CloudName } from "@/global";

const defaultVal = {
    apiSum: {
        ignore: 0,
        missing_api: 0,
        need_analysis: 0,
        offline: 0,
        offline_in_use: 0,
        planning: 0,
        total: 0,
        used: 0,
        unpublished: 0,
    },
    product: { owner: '', productIcon: '', productName: '' },
    provider: {
        dataSource: 0,
        datasource_deprecated: 0,
        eps_support: false,
        pre_paid_support: 0,
        resource: 0,
        resource_deprecated: 0,
        tag_support: false,
        total: 0,
    },
};

const ServiceStatisticsCard: React.FC<{ productName: string }> = ({ productName }) => {
    const [item, setItem] = useState<Portal.ProductSumPanel>(defaultVal);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectProductName, setSelectProductName] = useState<string>('');
    const [useRemarkStatus, setUseRemarkStatus] = useState<string>('');
    const [publishStatus, setPublishStatus] = useState<string>('');

    useEffect(() => {
        getApiPanelSum(productName).then((rsp) => {
            setItem(rsp);
        });
    }, [productName]);

    const handleCancel = () => {
        getApiPanelSum(productName).then((rsp) => {
            setItem(rsp);
        });
        setIsModalOpen(false);
    };

    const handleRowClick = (
        productName?: string,
        useRemarkStatus?: string,
        publishStatus?: string,
    ) => {
        setSelectProductName(productName || '');
        setUseRemarkStatus(useRemarkStatus || '');
        setPublishStatus(publishStatus || '');
        setIsModalOpen(true);
    };

    const getApiPanel = () => {
        return (
            <Row>
                <Col span={3}>
                    <div className={'label'}>API总数</div>
                    <div
                        className={'value-field'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(item.product.productName)}
                    >
                        {item.apiSum.total}
                    </div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>已对接</div>
                    <div
                        className={'value-field green'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(item.product.productName, 'used')}
                    >
                        {item.apiSum.used}
                    </div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>规划中</div>
                    <div
                        className={'value-field plan-color'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(item.product.productName, 'planning')}
                    >
                        {item.apiSum.planning}
                    </div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>缺失</div>
                    <div
                        className={'value-field red'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(item.product.productName, 'missing_api')}
                    >
                        {item.apiSum.missing_api}
                    </div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>未分析</div>
                    <div
                        className={'value-field orange'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(item.product.productName, 'need_analysis')}
                    >
                        {item.apiSum.need_analysis}
                    </div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>不适合</div>
                    <div
                        className={'value-field not-suitable'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(item.product.productName, 'ignore')}
                    >
                        {item.apiSum.ignore}
                    </div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>已下线</div>
                    <div
                        className={'value-field'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(item.product.productName, '', 'offline')}
                    >
                        {item.apiSum.offline_in_use ? (
                            <>
                                <span className={'orange'}>{item.apiSum.offline_in_use}/</span>
                                {item.apiSum.offline}
                            </>
                        ) : (
                            item.apiSum.offline
                        )}
                    </div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>线下</div>
                    <div
                        className={'value-field'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(item.product.productName, '', 'unpublished')}
                    >
                        {item.apiSum.unpublished || '0'}
                    </div>
                </Col>
            </Row>
        );
    };

    const getProviderPanel = () => {
        return (
            <Row>
                <Col span={4}>
                    <div className={'label'}>资源总数</div>
                    <div className={'value-field'}>{item.provider.total}</div>
                </Col>
                <Col span={4}>
                    <div className={'label'}>Resource</div>
                    <div className={'value-field used-color'}>{item.provider.resource}</div>
                </Col>
                <Col span={4}>
                    <div className={'label'}>DataSource</div>
                    <div className={'value-field plan-color'}>{item.provider.dataSource}</div>
                </Col>
                <Col span={4}>
                    <div className={'label'}>标签</div>
                    <div className={'value-field green'}>
                        {item.provider.tag_support ? (
                            <span className={'green'}>
                                <CheckCircleOutlined className={''} />
                            </span>
                        ) : (
                            <span className={'red'}>
                                <CloseCircleOutlined />
                            </span>
                        )}
                    </div>
                </Col>
                <Col span={4}>
                    <div className={'label'}>包周期</div>
                    <div className={'value-field'}>
                        {item.provider.pre_paid_support ? (
                            <span className={'green'}>
                                <CheckCircleOutlined className={''} />
                            </span>
                        ) : (
                            <span className={'red'}>
                                <CloseCircleOutlined />
                            </span>
                        )}
                    </div>
                </Col>
                <Col span={4}>
                    <div className={'label'}>企业项目</div>
                    <div className={'value-field red'}>
                        {item.provider.eps_support ? (
                            <span className={'green'}>
                                <CheckCircleOutlined className={''} />
                            </span>
                        ) : (
                            <span className={'red'}>
                                <CloseCircleOutlined />
                            </span>
                        )}
                    </div>
                </Col>
            </Row>
        );
    };

    const getHealthSum = () => {
        return (
            <div>
                <span className={'label'}>健康度(%)</span>
                <Row>
                    <Col span={12}>
                        <div className={'value-health'}>-</div>
                        <div className={'value-source'}>Resource</div>
                    </Col>
                    <Col span={12}>
                        <div className={'value-health'}>-</div>
                        <div className={'value-source'}>DataSource</div>
                    </Col>
                </Row>
            </div>
        );
    };

    let fontSize = 26;
    const nameLen = item.product.productName.length;
    if (nameLen > 10 && nameLen < 15) {
        fontSize = 20;
    } else if (nameLen >= 15) {
        fontSize = 16;
    }

    return (
        <>
            <div className={'service-statistics-card'}>
                <div className={'service-info'}>
                    <div className={'service-name'}>
                        <span className={'name'} style={{ fontSize: fontSize + 'px' }}>
                            {item.product.productName}
                        </span>
                    </div>
                    <div className={'service-owner'}>
                        <span className={'label'}>田主：</span>
                        {item.product.owner}
                    </div>
                </div>
                <div className={'main-container'}>
                    <div className={'api-panel'}>{getApiPanel()}</div>
                    <div className={'split-line'} />
                    <div className={'provider-panel'}>{getProviderPanel()}</div>
                </div>
                <div className={'health-sum'}>{getHealthSum()}</div>
            </div>
            <Modal
                title="API列表"
                transitionName={''}
                open={isModalOpen}
                destroyOnClose
                footer={null}
                onCancel={handleCancel}
                width={'85%'}
            >
                <ApiDialogList
                    cloudName={CloudName.HuaweiCloud}
                    productName={selectProductName}
                    useRemark={useRemarkStatus}
                    publishStatus={publishStatus}
                />
            </Modal>
        </>
    );
};
export default ServiceStatisticsCard;
