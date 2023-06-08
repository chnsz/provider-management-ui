import React, {useEffect, useState} from "react";
import {Button, Space, Table} from "antd";
import {ColumnsType} from "antd/es/table/interface";
import {getServiceSumList} from "@/services/portal/api";
import {ButtonType} from "antd/es/button/buttonHelpers";
import {getUserList} from "@/services/product/api";

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
            title: '服务简称/名称',
            dataIndex: 'productName',
            width: '13%',
            render: (val, record) =>
                <a href={`/service#/productName/${val}`} target={'_blank'} rel="noreferrer">
                    {val} / {record.productNameZh}
                </a>,
        },
        {
            title: '服务分级',
            dataIndex: 'level',
            width: '6%',
            align: 'center',
        },
        {
            title: '特性覆盖率',
            dataIndex: 'featureCoverage',
            width: '6%',
            align: 'center',
        },
        {
            title: 'API 对接率',
            dataIndex: 'apiCoverage',
            width: '6%',
            align: 'center',
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
            title: 'API 数据',
            dataIndex: 'apiUsagesSums',
            width: '18%',
            align: 'center',
            render: (v, record) => {
                return <div className={'row'}>
                    <div className={'col'}>
                        <div className={'blue'}>{record.apiUsed}</div>
                        <div className={'custom-label'}>已对接</div>
                    </div>
                    <div className={'col'}>
                        <div
                            className={record.apiOfflineInUse === 0 ? '' : 'orange'}>{record.apiOfflineInUse}</div>
                        <div className={'custom-label'}>使用废弃API</div>
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
            title: '资源规划',
            dataIndex: 'planningStatusSums',
            width: '15%',
            align: 'center',
            render: (v, record) => {
                const processing = record.taskProcessing + record.taskMerging;

                return <div className={'row'}>
                    <div className={'col'}>
                        <div className={record.planningNew === 0 ? '' : 'orange'}>{record.planningNew}</div>
                        <div className={'custom-label'}>待处理</div>
                    </div>
                    <div className={'col'}>
                        <div>{processing}</div>
                        <div className={'custom-label'}>进行中</div>
                    </div>
                    <div className={'col'}>
                        <div className={record.planningFreeze === 0 ? '' : 'red'}>{record.planningFreeze}</div>
                        <div className={'custom-label'}>冻结</div>
                    </div>
                    <div className={'col'}>
                        <div className={'blue'}>{record.planningClosed + record.planningMerged}</div>
                        <div className={'custom-label'}>已完成</div>
                    </div>
                </div>
            },
        },
        /*{
            title: '待办任务',
            dataIndex: 'taskStatusSums',
            width: '15%',
            align: 'center',
            render: (v, record) => {
                const processing = record.taskProcessing + record.taskMerging;
                return <div className={'row'}>
                    <div className={'col'}>
                        <div className={record.taskNew === 0 ? '' : 'orange'}>{record.taskNew}</div>
                        <div className={'custom-label'}>待处理</div>
                    </div>
                    <div className={'col'}>
                        <div>{processing}</div>
                        <div className={'custom-label'}>进行中</div>
                    </div>
                    <div className={'col'}>
                        <div className={record.taskFreeze === 0 ? '' : 'red'}>{record.taskFreeze}</div>
                        <div className={'custom-label'}>冻结</div>
                    </div>
                    <div className={'col'}>
                        <div className={'blue'}>{record.taskNew + record.taskMerged}</div>
                        <div className={'custom-label'}>已完成</div>
                    </div>
                </div>
            },
        },*/
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
        <div className={'service-group'}>{productGroup}</div>
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey={(record) => record.productGroup + record.productName}
        />
    </>
}

const SearchForm: React.FC<{ onSearch: (owner: string[]) => any }> = ({onSearch}) => {
    const [ownerList, setOwnerList] = useState<string[]>([]);
    const [selectedOwner, setSelectedOwner] = useState<string[]>([]);

    useEffect(() => {
        getUserList().then((rsp) => {
            setOwnerList(rsp.items.map((u: Product.User) => u.username));
        });
    }, []);

    useEffect(() => {
        if (onSearch) {
            onSearch(selectedOwner);
        }
    }, [selectedOwner])

    const onOwnerClick = function (name: string) {
        return function () {
            if (selectedOwner.includes(name)) {
                const arr = selectedOwner.filter((n) => n !== name);
                setSelectedOwner(arr);
            } else {
                setSelectedOwner([...selectedOwner, name]);
            }
        };
    };

    return <div style={{background: '#fff', padding: '15px', margin: '10px 0'}}>
        <span className={'filter-label'}>按田主过滤：</span>
        <Space>
            {ownerList.map((t) => {
                let type: ButtonType = selectedOwner.includes(t) ? 'primary' : 'dashed';

                return (
                    <Button key={t} size={'small'} type={type} onClick={onOwnerClick(t)}>
                        {t}
                    </Button>
                );
            })}
            <Button size={'small'} type={'link'} onClick={() => setSelectedOwner([])}>
                清空已选
            </Button>
        </Space>
    </div>
}

const ServiceSumList: React.FC<{ onload: (data: Portal.PortalSum) => any }> = ({onload}) => {
    const [productList, setProductList] = useState<ServiceSumProps[]>([]);

    const onSearch = (ownerArr: string[]) => {
        getServiceSumList(ownerArr).then(rsp => {
            setProductList([]);
            onload(rsp);
            if (rsp.productSumList.length === 0) {
                return;
            }

            const arr: ServiceSumProps[] = [];
            let tmpArr: Portal.ProductSum[] = [];
            let productGroup: string = '';

            rsp.productSumList.forEach((t: Portal.ProductSum) => {
                if (productGroup !== t.productGroup && productGroup !== '') {
                    arr.push({productGroup: productGroup, data: tmpArr});
                    tmpArr = [];
                    productGroup = '';
                }
                productGroup = t.productGroup;
                tmpArr.push(t);
            });
            if (tmpArr.length > 0) {
                arr.push({productGroup: productGroup, data: tmpArr});
            }

            for (let i = 0; i < arr.length; i++) {
                setTimeout(() => {
                    setProductList(arr.slice(0, i + 1));
                }, i * 10);
            }
        });
    }

    return <div className={'service-list'}>
        <div className={'title'}>服务列表</div>
        <SearchForm onSearch={onSearch}/>
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
