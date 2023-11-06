import React, {useEffect, useState} from "react";
import './portal.less'
import './partner.less'
import { Collapse, Space, Tooltip} from "antd";
import ServiceSumList from "@/pages/Portal/components/service-sum-list";
import {InfoCircleOutlined} from "@ant-design/icons";
import {CloudName, getCloudName} from "@/global";
import {getPartnerSum} from "@/services/portal/api";
import ProviderDocsIssue from "@/pages/Partner/components/provider_docs_issue";
import ProviderSyncIssue from "@/pages/Partner/components/provider_sync_issue";
import {getProviderSyncSum} from "@/services/provider/api";
import { useModel } from 'umi';
import OwnerApiDialog from "@/pages/Provider/components/owner-api-dialog";
import ProviderSyncSumDialog from "@/pages/Partner/components/provider_sync_sum_dialog";
import CustomBreadcrumb from "@/components/Breadcrumb";
import access from "@/access";

const {Panel} = Collapse;

const PanelCol: React.FC<{
    label: string, val: React.ReactNode, color?: string, tooltip?: string
}> = ({label, val, color, tooltip}) => {
    let tipNode = <></>;
    if (tooltip && tooltip.length > 0) {
        tipNode = <span className={'tooltip'}>
                    <Tooltip title={tooltip}>
                        <InfoCircleOutlined/>
                    </Tooltip>
                </span>
    }
    return <div className={'col'}>
        <div className={'label'}>
            {label}
            {tipNode}
        </div>
        <div className={'val'} style={{color: color}}>{val}</div>
    </div>
}

const SplitLine: React.FC<{ half?: boolean }> = ({half}) => {
    return <div className={half ? 'split-half' : 'split'}></div>
}

const SumPanel: React.FC<{ cloudName: Global.CloudName }> = ({cloudName}) => {
    const [data, setData] = useState<Portal.PartnerSum>({});

    useEffect(() => {
        getPartnerSum(cloudName).then(t => setData(t.data || {}));
    }, []);

    const name = getCloudName(cloudName);

    return <div className={'sum-panel'}>
        <div className={'ma cloud-name'}>{name}</div>
        <SplitLine/>
        <PanelCol label='Resource' val={data.Resource}
                  tooltip={'已发布的资源，即在可以通过Terraform官网可以查到的'}
        />
        <PanelCol label='DataSource' val={data.DataSource}
                  tooltip={'已发布的资源，即在可以通过Terraform官网可以查到的'}
        />
        <SplitLine half/>
        <PanelCol label='资源缺失' color={'#faad14'}
                  val={
                      <ProviderSyncSumDialog
                          cloudName={cloudName}
                          syncType={'PartnerMissingResource'}
                          status={['open']}
                          subTitle={'资源缺失'}
                          context={data.resourceMissing}
                      />
                  }
                  tooltip={'与华为云相比，伙伴云缺失的 Resource 和 DataSource 的总数量'}
        />
        <PanelCol label='特性缺失' color={'#1677ff'}
                  val={
                      <ProviderSyncSumDialog
                          cloudName={cloudName}
                          syncType={'PartnerMissingField'}
                          status={['open']}
                          subTitle={'特性缺失'}
                          context={data.fieldMissing}
                      />
                  }
                  tooltip={'资源已经发布，但是版本落后于华为云，即相同资源在华为云支持更多参数'}
        />
        <PanelCol label='正在同步' color={'#1677ff'}
                  val={
                      <ProviderSyncSumDialog
                          cloudName={cloudName}
                          syncType={['PartnerMissingField', 'PartnerMissingResource']}
                          status={['merging']}
                          subTitle={'正在同步'}
                          context={data.merging}
                      />
                  }
                  tooltip={'已经在开发中，代码还没有合并到主分支'}/>
        <PanelCol label='缺失 API' color={'#fa8c16'}
                  val={
                      <ProviderSyncSumDialog
                          cloudName={cloudName}
                          syncType={''}
                          remark={'缺少API'}
                          status={['merging', 'open', 'monitoring']}
                          subTitle={'缺失 API'}
                          context={data.apiMissing}
                      />
                  }
                  tooltip={'因为所使用的 API 未发布，或已经发布但缺少部分字段'}/>
        <PanelCol label='服务未上线' color={'#fa8c16'}
                  val={
                      <ProviderSyncSumDialog
                          cloudName={cloudName}
                          syncType={''}
                          remark={'服务未上线'}
                          status={['open', 'monitoring']}
                          subTitle={'服务未上线'}
                          context={data.serviceMissing}
                      />
                  }
                  tooltip={'服务未上线，无法创建此类资源'}/>
        <SplitLine half/>
        <PanelCol label='服务总数' val={data.serviceCount}/>
        <PanelCol label='API 总数' val={<OwnerApiDialog content={data.apiCount} cloudName={cloudName}/>}/>
    </div>
}

const PartnerDiffDetail: React.FC = () => {
    const {initialState} = useModel('@@initialState');
    const [providerSyncSum, setProviderSyncSum] = useState<Provider.ProviderSyncSum[]>([]);

    const loadData = () => {
        getProviderSyncSum().then(t => {
            setProviderSyncSum(t.items);
        });
    }
    useEffect(() => {
        loadData()
    }, []);

    const defaultActiveKey = [];

    if (access(initialState).partnerRole || process.env.NODE_ENV === 'development') {
        defaultActiveKey.push('1');
        defaultActiveKey.push('2');
    }

    return <Collapse defaultActiveKey={defaultActiveKey}>
        <Panel header={'资源文档问题'} key={'1'}>
            <div className={'partner'} style={{padding: '8px'}}>
                <ProviderDocsIssue data={providerSyncSum} loadData={loadData} short/>
            </div>
        </Panel>
        <Panel header={'伙伴云同步信息'} key={'2'}>
            <div className={'partner'} style={{padding: '8px'}}>
                <ProviderSyncIssue data={providerSyncSum} loadData={loadData}/>
            </div>
        </Panel>
    </Collapse>
}

const PartnerPortal: React.FC = () => {
    return <>
        <CustomBreadcrumb items={[{title: '首页'}, {title: '伙伴云分析'}]}/>
        <Space direction={'vertical'} size={20} style={{width: '100%'}}>
            <SumPanel cloudName={CloudName.FlexibleEngineCloud}/>
            <SumPanel cloudName={CloudName.G42Cloud}/>
            <PartnerDiffDetail/>
        </Space>
        <div className={'partner portal'}>
            <ServiceSumList partner onload={() => null}/>
        </div>
    </>
}

export default PartnerPortal;
