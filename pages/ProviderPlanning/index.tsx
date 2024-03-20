import LRLayout, { Container, Header, LeftSide } from '@/components/Layout';
import ProviderPlanningDetail from '@/pages/ProviderPlanning/components/provider-planning-detail';
import SideList from '@/pages/ProviderPlanning/components/sider-list';
import {
    createPlanningKbTask,
    createProviderPlanning,
    deleteProviderPlanning,
    getProviderPlanning,
    getProviderPlanningList,
} from '@/services/provider-planning/api';
import { SendOutlined } from '@ant-design/icons';
import { Button, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import './provider-planning.less';
// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';
import type { SearchFormProps } from "@/components/SearchForm";
import SearchForm from "@/components/SearchForm";
import { useLocation } from "umi";
import DeleteBtn from "@/components/delete";
import CustomBreadcrumb from "@/components/Breadcrumb";

export const defaultVal = {
    created: '',
    id: 0,
    priority: -1,
    productName: '',
    status: '',
    title: '',
    updated: '',
};

const productNameArr: string[] = [];
const ownerArr: string[] = [];
const statusArr: string[] = [];
let page = 1;
let isAllDataShow = false;

const ProviderPlanning: React.FC = () => {
    const [providerPlanningList, setProviderPlanningList] = useState<ProviderPlanning.ProviderPlanning[]>([]);
    const [selectedPlanning, setSelectedPlanning] = useState<ProviderPlanning.ProviderPlanning>(defaultVal);
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();


    useEffect(() => {
        const hashArr = location.hash.split('/');
        if (hashArr.length === 3) {
            getProviderPlanning(hashArr[2]).then((data) => {
                setSelectedPlanning(data);
            });
        }
    }, []);

    const loadData = (pageNum: number, isAppend: boolean) => {
        const queryParams = {
            productName: productNameArr,
            owner: ownerArr,
            status: statusArr,
        };

        getProviderPlanningList(queryParams, 50, pageNum).then((data) => {
            if (data.items.length === 0) {
                isAllDataShow = true;
                messageApi.warning('没有更多数据');
                return;
            }
            if (isAppend) {
                setProviderPlanningList([...providerPlanningList, ...data.items]);
            } else {
                setProviderPlanningList(data.items);
            }
        });
    }

    const reloadDetail = () => {
        getProviderPlanning(selectedPlanning.id)
            .then(data => {
                setSelectedPlanning(data);
            });
    }

    const onSearch = (query: SearchFormProps) => {
        isAllDataShow = false;
        productNameArr.length = 0;
        ownerArr.length = 0;
        statusArr.length = 0;

        query.productName.forEach(v => productNameArr.push(v));
        query.owner.forEach(v => ownerArr.push(v));
        query.status.forEach(v => statusArr.push(v));

        page = 1;
        loadData(1, false);
    };

    const loadMore = () => {
        if (isAllDataShow) {
            messageApi.warning('没有更多数据');
            return;
        } else {
            page = page + 1;
            loadData(page, true);
        }
    };

    const createPlanning = () => {
        const createOpts: ProviderPlanning.CreateOption = {
            productName: '',
            title: '新建的资源规划',
            status: 'new',
            priority: 1,
        };
        createProviderPlanning(createOpts).then((d) => {
            setSelectedPlanning(d);
            setProviderPlanningList([d, ...providerPlanningList]);
        });
    };

    const deletePlanning = () => {
        deleteProviderPlanning(selectedPlanning.id).then(rsp => {
            if (rsp.affectedRow === 0) {
                return
            }
            const arr = providerPlanningList.filter((t) => t.id !== selectedPlanning.id);
            setProviderPlanningList(arr);
            setSelectedPlanning(defaultVal);
        });
    };

    const onDetailChange = (p: ProviderPlanning.ProviderPlanning) => {
        const arr = providerPlanningList.map((t) => {
            if (t.id === p.id) {
                return p;
            }
            return t;
        });
        setSelectedPlanning(p);
        setProviderPlanningList(arr);
    };

    const createKanboardTask = () => {
        if (selectedPlanning.id === 0) {
            messageApi.warning('操作失败：您还没有选择资源规划，请先选择一条资源规划');
            return;
        }
        createPlanningKbTask(selectedPlanning.id).then(p => {
            if (!p.kanboardTask) {
                return
            }
            messageApi.info('卡片推送成功');
            setSelectedPlanning(p);
        });
    }

    const getDetailTitle = () => {
        let detailTitle = <>任务详情</>;
        if (selectedPlanning.id) {
            detailTitle = <>任务详情：<span
                className="detail-title">#{selectedPlanning.id} {selectedPlanning.title}</span></>
        }
        return detailTitle;
    }

    const getProductName = () => {
        const hashArr = location.hash.split('/');
        if (hashArr.length === 2) {
            return [hashArr[1]];
        }
        return []
    }

    return (
        <LRLayout className={'provider-planning'}>
            <CustomBreadcrumb items={[{ title: '首页' }, { title: '资源规划' }]} />
            <Header>
                <div style={{ background: '#fff', padding: '20px 20px' }}>
                    <SearchForm onSearch={onSearch} defaultValue={{ productName: getProductName() }} />
                </div>
            </Header>
            <LeftSide width={window.innerWidth * 0.3} minWidth={500} style={{ height: '100%' }}>
                <div className={'custom-title side-header'}>
                    <div className={'side-title'}>资源规划</div>
                    <div className={'side-tools-bar'}>
                        <Button type={'primary'} size={'small'} onClick={createPlanning}>
                            新建规划
                        </Button>
                    </div>
                </div>
                <div className={'list'}>
                    <Scrollbars>
                        <div style={{ padding: '10px' }}>
                            <SideList
                                selectedValue={selectedPlanning}
                                data={providerPlanningList}
                                onSelect={setSelectedPlanning}
                            />
                        </div>
                        <div className={'load-more'}>
                            <a onClick={loadMore}>加载更多</a>
                        </div>
                    </Scrollbars>
                </div>
            </LeftSide>
            <Container>
                <div className={'custom-title'}>{getDetailTitle()}</div>
                <div style={{ padding: '20px' }}>
                    <div className={'tools-bar'}>
                        <div className={'left-bar'}>
                            <Space size={'middle'}>
                                <Button type="primary" size={'small'} icon={<SendOutlined />}
                                    disabled={selectedPlanning.id === 0}
                                    onClick={createKanboardTask}
                                >
                                    推送卡片
                                </Button>
                                <DeleteBtn size={'small'} text={'删除规划'} onOk={deletePlanning}
                                    disabled={selectedPlanning.id === 0}
                                    title={'删除资源规划'}
                                    content={
                                        <>
                                            <div>确定要删除该资源规划吗？关联的卡片会被同步删除。</div>
                                            <div>删除后可联系管理员恢复，请谨慎操作。</div>
                                            <p>
                                                <a>
                                                    #{selectedPlanning.id} {selectedPlanning.title}
                                                </a>
                                            </p>
                                        </>
                                    }
                                />
                                {contextHolder}
                            </Space>
                        </div>
                        <div className={'right-bar'}>
                            <Button size={'small'} onClick={reloadDetail} disabled={selectedPlanning.id === 0}>
                                刷新
                            </Button>
                        </div>
                    </div>
                    <ProviderPlanningDetail
                        providerPlanning={selectedPlanning}
                        onChange={onDetailChange}
                    />
                </div>
            </Container>
        </LRLayout>
    )
        ;
};

export default ProviderPlanning;
