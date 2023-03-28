import ApiCoverage from '@/pages/Portal/components/api-coverage';
import Health from '@/pages/Portal/components/health';
import News from '@/pages/Portal/components/news';
import ResourcePlan from '@/pages/Portal/components/resource-plan';
import ServiceStatisticsCard from '@/pages/Portal/components/service-statistics-card';
import { getApiCoverageSum } from '@/services/portal/api';
import { Col, Row } from 'antd';
import React from 'react';

const Portal: React.FC = () => {
    getApiCoverageSum().then((d) => console.log('d', d));

    return (
        <>
            <Row>
                <ServiceStatisticsCard />
            </Row>
            <div style={{ height: '24px' }}></div>
            <div style={{ height: '398px' }}>
                <Row>
                    <Col span={8}>
                        <ApiCoverage />
                    </Col>
                    <Col span={5}>
                        <Health />
                    </Col>
                    <Col span={11}>
                        <News />
                    </Col>
                </Row>
                <div>
                    <ResourcePlan />
                </div>
            </div>
        </>
    );
};

export default Portal;
