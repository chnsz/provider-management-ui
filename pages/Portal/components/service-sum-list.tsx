import React, { useEffect, useState } from "react";
import { Button, Modal, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table/interface";
import { getServiceSumList } from "@/services/portal/api";
import { getUserList } from "@/services/product/api";
import ProviderListDialog from "@/pages/Portal/components/provider-list-dialog";
import ApiDialogList from "@/pages/Portal/components/api-dialog-list";
import { useModel } from 'umi';
import type { ButtonType } from "antd/lib/button";
import { InfoCircleOutlined } from "@ant-design/icons";

interface ServiceSumProps {
    productGroup: string;
    data: Portal.ProductSum[];
    partner?: boolean;
}

const apiCoverageTooltip = (
    <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
        <Tooltip
            title={
                <div>
                    对接率：
                    <br />
                    已对接 / （总数 - 不适合），规划中、未分析状态的都按照未对接统计。
                </div>
            }
        >
            <InfoCircleOutlined />
        </Tooltip>
    </span>
);


const ServiceSum: React.FC<ServiceSumProps> = ({ productGroup, data, partner }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectProductName, setSelectProductName] = useState<string>('');

    const allColumns: ColumnsType<Portal.ProductSum> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: '4%',
            render: (v, r, i) => i + 1,
        },
        {
            title: '服务分级',
            dataIndex: 'level',
            width: '150px',
            render: v => v === '' ? '其他服务' : v
        },
        {
            title: '服务简称/名称',
            dataIndex: 'productName',
            width: '280px',
            render: (val, record) => {
                if (record.huaweiCloudProviderCount === 0 && record.huaweiCloudDataSourceCount === 0) {
                    return <Tag style={{ fontSize: '14px' }}>{val} / {record.productNameZh}</Tag>
                }

                return <a href={`/service#/productName/${val}`} target={'_blank'} rel="noreferrer">
                    {val} / {record.productNameZh}
                </a>
            },
        },
        {
            title: () => <>Resource</>,
            dataIndex: 'huaweiCloudProviderCount',
            align: 'center',
        },
        {
            title: () => <>DataSource</>,
            dataIndex: 'huaweiCloudDataSourceCount',
            align: 'center',
        },
        {
            title: () => <>资源总数</>,
            dataIndex: 'huaweiCloudProviderCount',
            align: 'center',
            render: (v, row) => {
                const text = <a>
                    {row.huaweiCloudProviderCount + row.huaweiCloudDataSourceCount}
                </a>
                return <ProviderListDialog productName={row.productName} text={text} selectedKey={"1"} />
            }
        },
        {
            title: <>API 对接率 {apiCoverageTooltip}</>,
            dataIndex: 'apiCoverage',
            align: 'center',
            render: (v, row) => {
                return <a onClick={() => {
                    setSelectProductName(row.productName);
                    setIsModalOpen(true);
                }}>
                    {v}
                </a>
            }
        },
        {
            title: 'API 数据',
            dataIndex: 'apiUsagesSums',
            align: 'center',
            // width: '480px',
            render: (v, record) => {
                return <div className={'row'}>
                    <div className={'col'}>
                        <div>{record.apiCount}</div>
                        <div className={'custom-label'}>总数</div>
                    </div>
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
                        <div
                            className={record.apiOfflineInUse === 0 ? '' : 'orange'}>{record.apiOfflineInUse}</div>
                        <div className={'custom-label'}>使用废弃API</div>
                    </div>
                </div>
            },
        },
        /*{
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
        },*/
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
        },
        {
            title: '健康度',
            dataIndex: 'age',
            align: 'center',
            width: '5%',
        },*/
        {
            title: '田主',
            dataIndex: 'owner',
            align: 'center',
            width: 140,
        },
    ];

    const partnerColumns: ColumnsType<Portal.ProductSum> = [
        {
            title: '序号',
            dataIndex: 'sn',
            align: 'center',
            width: '4%',
            render: (v, r, i) => i + 1,
        },
        {
            title: '服务分级',
            dataIndex: 'level',
            width: '150px',
            render: v => v === '' ? '其他服务' : v
        },
        {
            title: '服务简称/名称',
            dataIndex: 'productName',
            width: '280px',
            render: (val, record) => {
                if (record.huaweiCloudProviderCount === 0 && record.huaweiCloudDataSourceCount === 0) {
                    return <Tag style={{ fontSize: '14px' }}>{val} / {record.productNameZh}</Tag>
                }

                return <a href={`/service#/productName/${val}`} target={'_blank'} rel="noreferrer">
                    {val} / {record.productNameZh}
                </a>
            },
        },
        {
            title: () => <>华为云资源数</>,
            dataIndex: 'huaweiCloudProviderCount',
            align: 'center',
            render: (v, row) => {
                const text = <a>
                    {row.huaweiCloudProviderCount + row.huaweiCloudDataSourceCount}
                </a>
                return <ProviderListDialog productName={row.productName} text={text} selectedKey={"1"} />
            }
        },
        {
            title: () => <>G42</>,
            dataIndex: 'g42ProviderCount',
            align: 'center',
            render: (v, row) => {
                const hwCount = row.huaweiCloudProviderCount + row.huaweiCloudDataSourceCount
                let count = row.g42ProviderCount + row.g42DataSourceCount;
                if (hwCount === 0) {
                    return <>{count}</>
                }
                if (hwCount < count) {
                    count = hwCount;
                }
                let color = '#faad14';
                let rate = Number(count / hwCount * 100).toFixed(2);
                if (rate === '100.00') {
                    rate = '100';
                    color = '#40a9ff';
                }

                const text = <div style={{ color: color, textAlign: 'center' }}>
                    {row.g42ProviderCount + row.g42DataSourceCount}&nbsp; <br /> {rate}%
                </div>
                return <ProviderListDialog productName={row.productName} text={text} selectedKey={"3"} />
            }
        },
        {
            title: () => <>法电</>,
            dataIndex: 'feProviderCount',
            align: 'center',
            render: (v, row) => {
                const hwCount = row.huaweiCloudProviderCount + row.huaweiCloudDataSourceCount
                let count = row.feProviderCount + row.feDataSourceCount
                if (hwCount === 0) {
                    return <>{count}</>
                }
                if (hwCount < count) {
                    count = hwCount;
                }
                let color = '#faad14';
                let rate = Number(count / hwCount * 100).toFixed(2);
                if (rate === '100.00') {
                    rate = '100';
                    color = '#40a9ff';
                }

                const text = <div style={{ color: color, textAlign: 'center' }}>
                    {row.feProviderCount + row.feDataSourceCount}&nbsp; <br /> {rate}%
                </div>
                return <ProviderListDialog productName={row.productName} text={text} selectedKey={"2"} />
            },
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
            columns={partner ? partnerColumns : allColumns}
            size={'middle'}
            dataSource={data}
            pagination={false}
            rowKey={(record) => record.productGroup + record.productName}
        />
        <Modal
            title="API列表"
            transitionName={''}
            open={isModalOpen}
            destroyOnClose
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            width={'85%'}
        >
            <ApiDialogList productName={selectProductName} />
        </Modal>
    </>
}

const SearchForm: React.FC<{ onSearch: (owner: string[], level: string[]) => any }> = ({ onSearch }) => {
    const { initialState } = useModel('@@initialState');
    let owner: string[] = [];
    if (!['Developer', '程相栋', '牛振国', '解义超', '王泽鹏'].includes(initialState?.currentUser?.realName || '')) {
        owner = [initialState?.currentUser?.realName || '']
    }

    const [ownerList, setOwnerList] = useState<string[]>([]);
    const [selectedOwner, setSelectedOwner] = useState<string[]>(owner);
    const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
    const levelList: { value: string, label: string }[] = [{ value: '主力服务', label: '主力服务' },
    { value: '核心服务', label: '核心服务' },
    { value: 'other', label: '其他服务' }];

    useEffect(() => {
        getUserList().then((rsp: Global.List<Product.User[]>) => {
            const arr = rsp.items.map((u: Product.User) => u.username)
            setOwnerList(arr);
            if (owner[0] === initialState?.currentUser?.realName && !arr.includes(initialState?.currentUser?.realName)) {
                setSelectedOwner([]);
            }
        });
    }, []);

    useEffect(() => {
        if (onSearch) {
            onSearch(selectedOwner, selectedLevel);
        }
    }, [selectedOwner, selectedLevel])

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

    const onLevelClick = function (name: string) {
        return function () {
            if (selectedLevel.includes(name)) {
                const arr = selectedLevel.filter((n) => n !== name);
                setSelectedLevel(arr);
            } else {
                setSelectedLevel([...selectedLevel, name]);
            }
        };
    };

    return <div className={'search-form-box'}>
        <div>
            <span className={'filter-label'}>按田主过滤：</span>
            <Space>
                {ownerList.map((t) => {
                    const type: ButtonType = selectedOwner.includes(t) ? 'primary' : 'dashed';

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
        <div style={{ marginTop: '10px' }}>
            <span className={'filter-label'}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;按级别：</span>
            <Space>
                {levelList.map((t) => {
                    const type: ButtonType = selectedLevel.includes(t.value) ? 'primary' : 'dashed';

                    return (
                        <Button key={t.value} size={'small'} type={type} onClick={onLevelClick(t.value)}>
                            {t.label}
                        </Button>
                    );
                })}
            </Space>
        </div>
    </div>
}

const ServiceSumList: React.FC<{
    onload: (data: Portal.PortalSum) => any,
    partner?: boolean,
}> = ({ onload, partner }) => {
    const [productList, setProductList] = useState<ServiceSumProps[]>([]);

    const onSearch = (ownerArr: string[], levelArr: string[]) => {
        getServiceSumList(ownerArr, levelArr).then(rsp => {
            setProductList([]);
            onload(rsp);
            if (rsp.productSumList.length === 0) {
                return;
            }

            const arr: ServiceSumProps[] = [];
            const productGroupList: Record<string, Portal.ProductSum[]> = {}

            rsp.productSumList
                .forEach((t: Portal.ProductSum) => {
                    const tmpArr = productGroupList[t.productGroup] || [];
                    tmpArr.push(t);
                    productGroupList[t.productGroup] = tmpArr;
                });

            for (const key in productGroupList) {
                if (!productGroupList.hasOwnProperty(key)) {
                    continue;
                }
                const data = productGroupList[key] || [];
                data.sort((a, b) => {
                    let s1 = a.productName;
                    let s2 = b.productName;
                    if (a.huaweiCloudProviderCount === 0 && a.huaweiCloudDataSourceCount === 0) {
                        s1 = 'zzz_' + s1
                    }
                    if (b.huaweiCloudProviderCount === 0 && b.huaweiCloudDataSourceCount === 0) {
                        s2 = 'zzz_' + s2
                    }
                    return s1.localeCompare(s2);
                });
                arr.push({ productGroup: key, data: data });
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
        <div className={'service-content'}>
            <SearchForm onSearch={onSearch} />
            <Space direction={'vertical'} style={{ width: '100%' }} size={20}>
                {
                    productList.map(p =>
                        <ServiceSum partner={partner} productGroup={p.productGroup} data={p.data} key={p.productGroup} />
                    )
                }
            </Space>
        </div>

    </div>
}

export default ServiceSumList;
