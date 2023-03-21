import Demo from '@/pages/Portal/components/demo';
import Health from '@/pages/Portal/components/health';
import { getApiCoverageSum } from '@/services/portal/api';
import { Col, Row } from 'antd';
import React from 'react';

const Portal: React.FC = () => {
    getApiCoverageSum().then((d) => console.log('d', d));

    return (
        <div style={{ height: '398px' }}>
            <Row>
                <Col span={8}>
                    <Demo />
                </Col>
                <Col span={5}>
                    <Health />
                </Col>
                <Col span={11}></Col>
            </Row>
        </div>
    );
};

export default Portal;
