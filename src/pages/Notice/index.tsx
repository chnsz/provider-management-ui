import LRLayout, {Container, Header, LeftSide} from '@/components/Layout';
import {getNotice, getNoticeList, markNoticeNotRead, markNoticeRead} from '@/services/notice/api';
import {getProductList, getUserList} from '@/services/product/api';
import {toLongDate, toShortDate} from '@/utils/common';
import {ProDescriptions} from '@ant-design/pro-components';
import {Breadcrumb, Button, notification, Radio, Select, Space} from 'antd';
import {ButtonType} from 'antd/es/button/buttonHelpers';
import {SelectProps} from 'antd/es/select';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import './notice.less';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import {useLocation} from 'umi';
import {NotificationInstance} from "antd/es/notification/interface";

export const getNoticeTypeName = function (typeVal: string): string {
    switch (typeVal) {
        case 'api_news':
            return 'API 动态';
        case 'health_check':
            return '健康检查';
        case 'planning':
            return '规划';
        case 'normal':
            return '通知';
        case 'tips':
            return '通知';
    }
    return ':' + typeVal;
};

let currentPageNum = 1;

const selectedOwner = new Map();
let selectedService: string[] = [];
let readState = 'all';

const loadData = function (
    noticeList: Notice.Notice[],
    setNoticeList: React.Dispatch<React.SetStateAction<Notice.Notice[]>>,
    notificationApi?: NotificationInstance,
) {
    const ownerArr: string[] = [];
    selectedOwner.forEach((v, k) => {
        ownerArr.push(k);
    });

    getNoticeList({isRead: readState, productName: selectedService, owner: ownerArr}, 50, currentPageNum)
        .then((rsp) => {
            const items = rsp.items || [];

            if (items.length === 0 && notificationApi) {
                notificationApi['info']({
                    message: '提示',
                    description: '没有数据了',
                });
                return;
            }
            setNoticeList([...noticeList, ...items]);
        });
};

const setNoticeIsRead = function (
    id: string,
    isRead: 'yes' | 'no',
    noticeList: Notice.Notice[],
    setNoticeList: React.Dispatch<React.SetStateAction<Notice.Notice[]>>,
) {
    const newArr = noticeList.map((t) => {
        if (t.id === id) {
            t.isRead = isRead;
        }
        return t;
    });
    setNoticeList(newArr);
};

const Notice: React.FC = () => {
    const [notificationApi, contextHolder] = notification.useNotification();
    const location = useLocation();
    const [noticeList, setNoticeList] = useState<Notice.Notice[]>([]);
    const [selectedNotice, setSelectedNotice] = useState<Notice.Notice | undefined>();
    const [ownerList, setOwnerList] = useState<string[]>([]);
    const [serviceOptions, setServiceOptions] = useState<SelectProps['options']>([]);

    const onReadStatusClick = function (name: string) {
        currentPageNum = 1;
        readState = name;
        loadData([], setNoticeList);
    };

    const onOwnerClick = function (name: string) {
        return function () {
            currentPageNum = 1;
            if (selectedOwner.has(name)) {
                selectedOwner.delete(name);
            } else {
                selectedOwner.set(name, true);
            }
            loadData([], setNoticeList);
        };
    };

    const onServiceSelected = function (value: string[]) {
        selectedService = value;
        loadData([], setNoticeList);
    };

    const clearFilter = function (name: string) {
        return function () {
            if (name === 'owner') {
                selectedOwner.clear();
            } else if (name === 'service') {
                selectedService = [];
            }
            loadData([], setNoticeList, notificationApi);
        };
    };

    const showNotice = function (id: string) {
        getNotice(id).then((n) => {
            setSelectedNotice(n);
        });
        markNoticeRead(id).then(() => {
            setNoticeIsRead(id, 'yes', noticeList, setNoticeList);
        });
    };

    const onItemClick = function (id: string) {
        return function () {
            window.location.hash = '#/id/' + id;
            showNotice(id);
        };
    };

    const markAsUnread = function () {
        if (!selectedNotice) {
            return;
        }
        markNoticeNotRead(selectedNotice.id).then(() => {
            setNoticeIsRead(selectedNotice.id, 'no', noticeList, setNoticeList);
        });
    };

    const loadMore = function () {
        currentPageNum++;
        loadData(noticeList, setNoticeList, notificationApi);
    };

    useEffect(() => {
        loadData([], setNoticeList, notificationApi);

        const hashArr = location.hash.split('/');
        if (hashArr.length === 3) {
            showNotice(hashArr[2]);
        }

        getProductList().then((rsp) => {
            const opts = rsp.items
                .map((p) => p.productName)
                .sort()
                .map((n) => {
                    return {value: n, label: n};
                });
            setServiceOptions(opts);
        });

        getUserList().then((rsp) => {
            setOwnerList(rsp.items.map(t => t.username));
        });
    }, []);

    return (
        <LRLayout className={'notice'}>
            <Breadcrumb items={[{title: '首页'}, {title: '通知消息'}]}/>
            <Header>
                {contextHolder}
                <div className={'top'}>
                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        <div>
                            <span className={'custom-label'}>按田主：</span>
                            <Space>
                                {ownerList.map((t) => {
                                    let type: ButtonType = 'dashed';
                                    if (selectedOwner.has(t)) {
                                        type = 'primary';
                                    }

                                    return (
                                        <Button key={t} size={'small'} type={type}
                                                onClick={onOwnerClick(t)}>{t}</Button>
                                    );
                                })}
                                <Button size={'small'} type={'link'} onClick={clearFilter('owner')}>
                                    清空已选
                                </Button>
                            </Space>
                        </div>
                        <div>
                            <span className={'custom-label'}>按服务：</span>
                            <Select
                                mode="multiple"
                                allowClear={true}
                                placeholder="选择服务过滤数据"
                                style={{width: '45%'}}
                                options={serviceOptions}
                                onChange={onServiceSelected}
                            />
                        </div>
                    </Space>
                </div>
            </Header>
            <LeftSide width={window.innerWidth * 0.3} minWidth={500} style={{height: '100%'}}>
                <div className={'custom-title side-header'}>
                    <div className={'side-title'}>消息列表</div>
                    <div className={'side-tools-bar'}>
                        <Radio.Group value={readState} size={'small'}
                                     onChange={(e) => onReadStatusClick(e.target.value)}>
                            <Radio.Button value="all">全部</Radio.Button>
                            <Radio.Button value="no">未读</Radio.Button>
                            <Radio.Button value="yes">已读</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
                <div className={'item-list'}>
                    <Scrollbars>
                        {noticeList.map((notice) => {
                            const itemClassName = classNames({
                                selected: notice.id === selectedNotice?.id,
                                item: true,
                            });
                            const titleClassName = classNames({
                                unread: notice.isRead === 'no',
                                title: true,
                            });

                            return (
                                <div key={notice.id} className={itemClassName} onClick={onItemClick(notice.id)}>
                                    <div className={'item-type'}>
                                        <div className={'item-col item-title'}>
                                            <div>
                                                {getNoticeTypeName(notice.type)}
                                            </div>
                                            <div className={titleClassName}>
                                                #{notice.id} {notice.title}
                                            </div>
                                        </div>
                                        <div className={'item-col product-col'}>
                                            <div>所属服务</div>
                                            <div className={'value'}>
                                                {notice.productName}
                                            </div>
                                        </div>
                                        <div className={'item-col owner-col'}>
                                            <div>责任人</div>
                                            <div className={'value'}>
                                                {notice.productDetail?.owner}
                                            </div>
                                        </div>
                                        <div className={'item-col date-col'}>
                                            <div>创建日期&nbsp;&nbsp;</div>
                                            <div>{toShortDate(notice.created)}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className={'load-more'}>
                            <a onClick={loadMore}>加载更多</a>
                        </div>
                    </Scrollbars>
                </div>
            </LeftSide>
            <Container>
                <div className={'custom-title'}>
                    {selectedNotice?.id ? '#' + selectedNotice?.id + ' ' : ''}
                    {selectedNotice?.title || '消息详情'}
                </div>
                <div style={{padding: '20px'}}>
                    <div style={{padding: '5px 0 15px 8px'}}>
                        <Button type={'primary'} size={'small'} onClick={markAsUnread}>标记为未读</Button>
                    </div>
                    <ProDescriptions column={16}>
                        <ProDescriptions.Item span={8} label="所属服务" valueType="text">
                            {selectedNotice?.productName}
                        </ProDescriptions.Item>
                        <ProDescriptions.Item span={2} label="田主" valueType="text">
                            {selectedNotice?.productDetail?.owner}
                        </ProDescriptions.Item>
                        <ProDescriptions.Item span={6} label="日期" valueType="text">
                            {toLongDate(selectedNotice?.created)}
                        </ProDescriptions.Item>
                        <ProDescriptions.Item span={16} label="详细内容" valueType="text">
                            {selectedNotice?.content}
                        </ProDescriptions.Item>
                    </ProDescriptions>
                </div>
            </Container>
        </LRLayout>
    );
};

export default Notice;
