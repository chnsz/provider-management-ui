import React from "react";
import {getApiCoverageSum} from "@/services/portal/api";
import {Col, Row} from "antd";
import Demo from "@/pages/Portal/components/demo";

const Portal: React.FC = () => {

    getApiCoverageSum().then(d => console.log(d));

    return <Row>
        <Col span={8}>
            <Demo/>
        </Col>
        <Col span={5}>
            5
        </Col>
        <Col>
            other
        </Col>
    </Row>
}

export default Portal;
