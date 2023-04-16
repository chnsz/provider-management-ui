import {getApiPanelSum} from '@/services/portal/api';
import {CheckCircleOutlined, CloseCircleOutlined, CloudServerOutlined} from '@ant-design/icons';
import {Col, Row} from 'antd';
import React, {useEffect, useState} from 'react';
import '../portal.less';

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
        unpublished: 0
    },
    product: {owner: "", productIcon: "", productName: ""},
    provider: {
        dataSource: 0,
        datasource_deprecated: 0,
        eps_support: false,
        pre_paid_support: 0,
        resource: 0,
        resource_deprecated: 0,
        tag_support: false,
        total: 0
    }
};

const ServiceStatisticsCard: React.FC<{productName: string}> = ({productName}) => {
    const [item, setItem] = useState<Portal.ProductSumPanel>(defaultVal);

    useEffect(() => {
        getApiPanelSum(productName).then((rsp) => {
            setItem(rsp);
        });
    }, [productName]);

    const getApiPanel = () => {
        return (
            <Row>
                <Col span={3}>
                    <div className={'label'}>API总数</div>
                    <div className={'value-field'}>{item.apiSum.total}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>已对接</div>
                    <div className={'value-field green'}>{item.apiSum.used}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>规划中</div>
                    <div className={'value-field plan-color'}>{item.apiSum.planning}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>缺失</div>
                    <div className={'value-field red'}>{item.apiSum.missing_api}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>未分析</div>
                    <div className={'value-field orange'}>{item.apiSum.need_analysis}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>不合适</div>
                    <div className={'value-field not-suitable'}>{item.apiSum.ignore}</div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>已下线</div>
                    <div className={'value-field'}>
                        {
                            item.apiSum.offline_in_use ?
                                <>
                                    <span className={'orange'}>{item.apiSum.offline_in_use}/</span>
                                    {item.apiSum.offline}
                                </>
                                :
                                item.apiSum.offline
                        }


                    </div>
                </Col>
                <Col span={3}>
                    <div className={'label'}>线下</div>
                    <div className={'value-field'}>{item.apiSum.unpublished || '0'}</div>
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
                        {
                            item.provider.tag_support ?
                                <span className={'green'}><CheckCircleOutlined className={''}/></span>
                                :
                                <span className={'red'}><CloseCircleOutlined/></span>
                        }
                    </div>
                </Col>
                <Col span={4}>
                    <div className={'label'}>包周期</div>
                    <div className={'value-field'}>
                        {
                            item.provider.pre_paid_support ?
                                <span className={'green'}><CheckCircleOutlined className={''}/></span>
                                :
                                <span className={'red'}><CloseCircleOutlined/></span>
                        }
                    </div>
                </Col>
                <Col span={4}>
                    <div className={'label'}>企业项目</div>
                    <div className={'value-field red'}>
                        {
                            item.provider.eps_support ?
                                <span className={'green'}><CheckCircleOutlined className={''}/></span>
                                :
                                <span className={'red'}><CloseCircleOutlined/></span>
                        }
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

    return (
        <div className={'service-statistics-card'}>
            <div className={'service-info'}>
                <div className={'service-name'}>
                    <span className={'name'}>{/* {<CloudServerOutlined/>} {item.product.productIcon}*/}{item.product.productName}</span>
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
