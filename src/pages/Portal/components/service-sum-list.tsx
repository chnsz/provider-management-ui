import React, {useEffect, useState} from "react";
import {Space, Table} from "antd";
import {ColumnsType} from "antd/es/table/interface";
import {getServiceSumList} from "@/services/portal/api";

interface ServiceSumProps {
    productGroup: string;
    data: Portal.ProductSum[];
}

const ServiceSum: React.FC<ServiceSumProps> = ({productGroup, data}) => {

    const columns: ColumnsType<Portal.ProductSum> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: '4%',
            render: (v, r, i) => i + 1,
        },
        {
            title: '服务简称',
            dataIndex: 'productName',
            width: '13%',
            render: (text) => <a href={`/service#/productName/${text}`} target={'_blank'}>{text}</a>,
        },
        {
            title: '服务分级',
            dataIndex: 'level',
            width: '6%',
        },
        {
            title: 'API 对接率',
            dataIndex: 'apiCoverage',
            width: '7%',
            align: 'center',
        },
        {
            title: 'API 数据',
            dataIndex: 'apiUsagesSums',
            width: '12%',
            align: 'center',
            render: (v, record) => {
                return <div className={'row'}>
                    <div className={'col'}>
                        <div className={'blue'}>{record.apiUsed}</div>
                        <div className={'custom-label'}>已对接</div>
                    </div>
                    <div className={'col'}>
                        <div
                            className={record.apiUseNeedAnalysis === 0 ? '' : 'orange'}>{record.apiUseNeedAnalysis}</div>
                        <div className={'custom-label'}>待分析</div>
                    </div>
                    <div className={'col'}>
                        <div>{record.apiCount}</div>
                        <div className={'custom-label'}>总数</div>
                    </div>
                </div>
            },
        },
        {
            title: () => <>Provider<br/>资源数</>,
            dataIndex: 'providerCount',
            width: '6%',
            align: 'center',
        },
        {
            title: () => <>DataSource<br/>资源数</>,
            dataIndex: 'dataSourceCount',
            width: '6%',
            align: 'center',
        },
        {
            title: '资源规划',
            dataIndex: 'planningStatusSums',
            width: '15%',
            align: 'center',
            render: (v, record) => {
                const processing = record.taskProcessing + record.taskMerging;

                return <div className={'row'}>
                    <div className={'col'}>
                        <div className={record.planningNew === 0 ? '' : 'red'}>{record.planningNew}</div>
                        <div className={'custom-label'}>待处理</div>
                    </div>
                    <div className={'col'}>
                        <div>{processing}</div>
                        <div className={'custom-label'}>进行中</div>
                    </div>
                    <div className={'col'}>
                        <div className={record.planningFreeze === 0 ? '' : 'orange'}>{record.planningFreeze}</div>
                        <div className={'custom-label'}>冻结</div>
                    </div>
                    <div className={'col'}>
                        <div className={'blue'}>{record.planningClosed + record.planningMerged}</div>
                        <div className={'custom-label'}>已完成</div>
                    </div>
                </div>
            },
        },
        {
            title: '待办任务',
            dataIndex: 'taskStatusSums',
            width: '15%',
            align: 'center',
            render: (v, record) => {
                const processing = record.taskProcessing + record.taskMerging;
                return <div className={'row'}>
                    <div className={'col'}>
                        <div className={record.taskNew === 0 ? '' : 'red'}>{record.taskNew}</div>
                        <div className={'custom-label'}>待处理</div>
                    </div>
                    <div className={'col'}>
                        <div>{processing}</div>
                        <div className={'custom-label'}>进行中</div>
                    </div>
                    <div className={'col'}>
                        <div className={record.taskFreeze === 0 ? '' : 'orange'}>{record.taskFreeze}</div>
                        <div className={'custom-label'}>冻结</div>
                    </div>
                    <div className={'col'}>
                        <div className={'blue'}>{record.taskNew + record.taskMerged}</div>
                        <div className={'custom-label'}>已完成</div>
                    </div>
                </div>
            },
        },
        {
            title: '健康度',
            dataIndex: 'age',
            align: 'center',
            width: '5%',
        },
        {
            title: '田主',
            dataIndex: 'owner',
            width: '5%',
        },
    ];

    return <>
        <div className={'service-group'}>{productGroup}服务产品部</div>
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey={(record) => record.productGroup + record.productName}
        />
    </>
}


const ServiceSumList: React.FC = () => {
    const [productList, setProductList] = useState<ServiceSumProps[]>([]);

    useEffect(() => {
        getServiceSumList().then(rsp => {
            const arr: ServiceSumProps[] = [];
            let tmpArr: Portal.ProductSum[] = [];
            let productGroup: string = '';

            rsp.forEach((t: Portal.ProductSum) => {
                if (productGroup !== t.productGroup && productGroup !== '') {
                    arr.push({
                        productGroup: productGroup,
                        data: tmpArr,
                    });
                    tmpArr = [];
                    productGroup = '';
                }
                productGroup = t.productGroup;
                tmpArr.push(t);
            });
            setProductList(arr);
        });
    }, []);

    return <div className={'service-list'}>
        <div className={'title'}>服务列表</div>
        <Space direction={'vertical'} style={{width: '100%'}} size={20}>
            {
                productList.map(p =>
                    <ServiceSum productGroup={p.productGroup} data={p.data} key={p.productGroup}/>
                )
            }
        </Space>
    </div>
}

export default ServiceSumList;
