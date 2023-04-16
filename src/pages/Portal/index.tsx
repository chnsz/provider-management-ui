import React from "react";
import {Space, Table, Tag} from "antd";
import './portal.less'
import {ColumnsType} from "antd/es/table/interface";
import ServiceSumList from "@/pages/Portal/components/service-sum-list";


const ServiceSum: React.FC = () => {
    return <div className={'service-sum'}>
        <div className={'card'}>
            <div className={'primary-desc'}>
                <div className={'label'}>
                    <img src="/icons/all-service.svg" alt="服务总对接率"/>
                </div>
                <div className={'value'}>89.32%</div>
            </div>
            <div className={'second-desc'}>
                <div className={'label'}>服务总对接率</div>
                <div className={'value'}>89 / 120</div>
            </div>
        </div>
        <div className={'card'}>
            <div className={'desc'}>
                <div className={'primary-desc'}>
                    <div className={'label'}>
                        <img src="/icons/core-service.svg" alt="核心服务对接率"/>
                    </div>
                    <div className={'value'}>89.32%</div>
                </div>
                <div className={'second-desc'}>
                    <div className={'label'}>核心服务对接率</div>
                    <div className={'value'}>89 / 120</div>
                </div>
            </div>
        </div>
        <div className={'card'}>
            <div className={'desc'}>
                <div className={'primary-desc'}>
                    <div className={'label'}>
                        <img src="/icons/main-service.svg" alt="核心服务对接率"/>
                    </div>
                    <div className={'value'}>89.32%</div>
                </div>
                <div className={'second-desc'}>
                    <div className={'label'}>主力服务对接率</div>
                    <div className={'value'}>89 / 120</div>
                </div>
            </div>
        </div>
        <div className={'card'}>
            <div className={'desc'}>
                <div className={'primary-desc'}>
                    <div className={'label'}>
                        <img src="/icons/emerging-service.svg" alt="核心服务对接率"/>
                    </div>
                    <div className={'value'}>89.32%</div>
                </div>
                <div className={'second-desc'}>
                    <div className={'label'}>新兴服务对接率</div>
                    <div className={'value'}>89 / 120</div>
                </div>
            </div>
        </div>
    </div>
}

const Portal: React.FC = () => {

    return <div className={'portal'}>
        <Space direction={'vertical'} style={{width: '100%'}} size={20}>
            <ServiceSum/>
            <ServiceSumList/>
        </Space>
    </div>
}

export default Portal;
