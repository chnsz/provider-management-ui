import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getProviderTypeSum } from "@/services/provider/api";

const providerSumTooltip = (
    <div className={'tooltip'}>
        <Tooltip title={'已发布的资源，即在可以通过 Terraform 官网可以查到的'}>
            <InfoCircleOutlined />
        </Tooltip>
    </div>
);

const ServiceConsoleCard: React.FC = () => {
    const [providerTypeSum, setProviderTypeSum] = useState<Provider.TypeSum>({ resource: 0, dataSource: 0 });
    useEffect(() => {
        getProviderTypeSum().then(t => {
            setProviderTypeSum(t);
        })
    }, [])

    return (
        <div className={'resource-sum'}>
            <div className={'resource-card resource'}>
                <div className={'title-box'}>
                    <div className={'title'}>
                        已发布
                    </div>

                    <div className={'info-icon'}>
                        {providerSumTooltip}
                    </div>
                </div>

                <div className={'content-box'}>
                    <div className={'item-box'}>
                        <div>Resource</div>
                        <div className={'num'}>
                            {providerTypeSum.resource}
                        </div>
                    </div>
                    <div className={'item-box'}>
                        <div>DataSource</div>
                        <div className={'num'}>
                            {providerTypeSum.dataSource}
                        </div>
                    </div>
                </div>
            </div>

            <div className={'resource-card console'}>
                <div className={'title-box'}>
                    <div className={'title'}>
                        Console-Free
                    </div>
                </div>
                <div className={'content-box'}>
                    <div className={'console-box lf'}>
                        <div className={'time-box lt'}>
                            <div className={'grow-num'}>46</div>
                            <div className={'time-label'}>已支持</div>
                        </div>
                    </div>
                    <div className={'console-box rt'}>
                        <div className={'time-box rt'}>
                            <div className={'grow-num'}>73</div>
                            <div className={'time-label'}>4月30日</div>
                        </div>
                        <div className={'time-box rt'}>
                            <div className={'grow-num'}>122</div>
                            <div className={'time-label'}>6月30日</div>
                        </div>
                        <div className={'time-box rt'}>
                            <div className={'grow-num'}>189</div>
                            <div className={'time-label'}>9月30日</div>
                        </div>
                        <div className={'time-box rt'}>
                            <div className={'grow-num'}>245</div>
                            <div className={'time-label'}>12月30日</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceConsoleCard;
