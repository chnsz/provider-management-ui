import { getApiPanelSum } from '@/services/portal/api';
import { CheckCircleOutlined, CloseCircleOutlined, CloudServerOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import '../portal.less';

const ServiceStatisticsCard: React.FC = () => {
    const [item, setItem] = useState<Portal.ProductSumPanel>({
        product: {
            product_img: '',
            product_short: '',
            owner: '',
        },
        api_sum: {
            total: 0,
            used: 0,
            planed: 0,
            need_publish: 0,
            not_analyzed: 0,
            not_suitable: 0,
            offline_used: 0,
            offline: 0,
            unpublished: 0,
        },
        provider: {
            total: 10,
            resource: 0,
            data_source: 0,
            tag_support: true,
            pre_paid_support: true,
            eps_support: true,
        },
    });
    useEffect(() => {
        getApiPanelSum().then((rsp) => {
            console.log('rsp: ', rsp);
            setItem(rsp);
        });
    }, []);
    const getApiPanel = () => {
        return (
            <Row>
                <Col span={3}>
                    <div className={'label'}>API总数</div>
                    <div className={'value-field'}>{item.api_sum.total}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>已对接</div>
                    <div className={'value-field green'}>{item.api_sum.used}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>规划中</div>
                    <div className={'value-field plan-color'}>{item.api_sum.planed}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>缺失</div>
                    <div className={'value-field red'}>{item.api_sum.need_publish}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>未分析</div>
                    <div className={'value-field orange'}>{item.api_sum.not_analyzed}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>不合适</div>
                    <div className={'value-field not-suitable'}>{item.api_sum.not_suitable}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>已下线</div>
                    <div className={'value-field'}>
                        <span className={'orange'}>{item.api_sum.offline_used}/</span>
                        {item.api_sum.offline}
                    </div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>线下</div>
                    <div className={'value-field'}>{item.api_sum.unpublished}</div>
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
                    <div className={'value-field plan-color'}>{item.provider.data_source}</div>
                </Col>
                <Col span={4}>
                    <div className={'label'}>标签</div>
                    <div className={'value-field green'}>
                        <CheckCircleOutlined />
                    </div>
                </Col>
                <Col span={4}>
                    <div className={'label'}>包周期</div>
                    <div className={'value-field green'}>
                        <CheckCircleOutlined />
                    </div>
                </Col>
                <Col span={4}>
                    <div className={'label'}>企业项目</div>
                    <div className={'value-field red'}>
                        <CloseCircleOutlined />
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
                        <div className={'value-health'}>98</div>
                        <div className={'value-source'}>Resource</div>
                    </Col>
                    <Col span={12}>
                        <div className={'value-health'}>99</div>
                        <div className={'value-source'}>DataSource</div>
                    </Col>
                </Row>
            </div>
        );
    };

    return (
        <div className={'service-statistics-card'}>
            <div className={'service-info'}>
                <div className={'service-name'}>
                    {<CloudServerOutlined />} {item.product.product_short}
                </div>
                <div className={'service-owner'}>
                    <span className={'label'}>田主：</span>
                    {item.product.owner}
                </div>
            </div>
            <div className={'main-container'}>
                <div className={'api-panel'}>{getApiPanel()}</div>
                <div className={'split-line'}></div>
                <div className={'provider-panel'}>{getProviderPanel()}</div>
            </div>
            <div className={'health-sum'}>{getHealthSum()}</div>
        </div>
    );
};
export default ServiceStatisticsCard;
