import React from "react";
import ReactEcharts from "echarts-for-react";
import {Result} from "antd";
import '../portal.less'

const FeatureCard: React.FC = () => {

    return <div className={'portal-card'}>
        <div className={'header'}>服务特性</div>
        <div className={'container'}>
            <Result title="建设中..."/>
        </div>
    </div>
}

export default FeatureCard;
