import LRLayout, {Container, Header, LeftSide} from '@/components/Layout';
import {getNotice, getNoticeList, markNoticeNotRead, markNoticeRead} from '@/services/notice/api';
import {getOwnerList, getProductList} from '@/services/product/api';
import {toLongDate} from '@/utils/common';
import {ProDescriptions} from '@ant-design/pro-components';
import {Breadcrumb, Button, Radio, Select, Tag} from 'antd';
import {ButtonType} from 'antd/es/button/buttonHelpers';
import {SelectProps} from 'antd/es/select';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import './notice.less';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import {useLocation} from 'umi';

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

let currentOffset = 0;

const selectedOwner = new Map();
let selectedService: string[] = [];
let readState = 'all';

const loadData = function (
    noticeList: Notice.Notice[],
    setNoticeList: React.Dispatch<React.SetStateAction<Notice.Notice[]>>,
) {
    const ownerArr: string[] = [];
    selectedOwner.forEach((v, k) => {
        ownerArr.push(k);
    });

    getNoticeList(readState, selectedService, ownerArr, 50, currentOffset).then((rsp) => {
        if (noticeList.length !== 0 && rsp.items.length === 0) {
            return;
        }
        setNoticeList([...noticeList, ...rsp.items]);
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

const getStateType = function (s: string): ButtonType {
    return readState === s ? 'primary' : 'dashed';
};

const Notice: React.FC = () => {
    const location = useLocation();
    const [noticeList, setNoticeList] = useState<Notice.Notice[]>([]);
    const [selectedNotice, setSelectedNotice] = useState<Notice.Notice | undefined>();
    const [ownerList, setOwnerList] = useState<string[]>([]);
    const [serviceOptions, setServiceOptions] = useState<SelectProps['options']>([]);

    const onReadStatusClick = function (name: string) {
        currentOffset = 0;
        readState = name;
        loadData([], setNoticeList);
    };

    const onOwnerClick = function (name: string) {
        return function () {
            currentOffset = 0;
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
            loadData([], setNoticeList);
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
        currentOffset += 50;
        loadData(noticeList, setNoticeList);
    };

    useEffect(() => {
        loadData([], setNoticeList);

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

        getOwnerList().then((rsp) => {
            setOwnerList(rsp.items.sort());
        });
    }, []);

    return (
        <div className={'notice'}>
            <LRLayout>
                <Header>
                    <Breadcrumb items={[{title: '首页'}, {title: '通知消息'}]}/>
                    <div className={'top'}>
                        <div className={'title'}>筛选</div>
                        <div className={'filter-btn'}>
                            <span className={'custom-label'}>&nbsp;&nbsp;&nbsp;按田主：</span>
                            {ownerList.map((t) => {
                                let type: ButtonType = 'dashed';
                                if (selectedOwner.has(t)) {
                                    type = 'primary';
                                }

                                return (
                                    <Button key={t} size={'small'} type={type} onClick={onOwnerClick(t)}>{t}</Button>
                                );
                            })}
                            <Button size={'small'} type={'link'} onClick={clearFilter('owner')}>
                                清空已选
                            </Button>
                        </div>
                        <div className={'filter-btn'}>
                            <span className={'custom-label'}>&nbsp;&nbsp;&nbsp;按服务：</span>
                            <Select
                                mode="multiple"
                                allowClear={true}
                                placeholder="选择服务过滤数据"
                                style={{width: '55%', marginLeft: '14px'}}
                                options={serviceOptions}
                                onChange={onServiceSelected}
                            />
                        </div>
                    </div>
                </Header>
                <LeftSide width={500} style={{height: '100%'}}>
                    <div className={'custom-title side-header'}>
                        <div className={'side-title'}>消息列表</div>
                        <div className={'side-tools-bar'}>
                            <Radio.Group value={readState} size={'small'} onChange={(e) => onReadStatusClick(e.target.value)}>
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

                                let tag = <></>;
                                if (notice.productDetail?.owner) {
                                    tag = <Tag>{notice.productDetail.owner}</Tag>;
                                }

                                return (
                                    <div key={notice.id} className={itemClassName} onClick={onItemClick(notice.id)}>
                                        <div className={'item-type'}>
                                            <div className={'type'}>
                                                {getNoticeTypeName(notice.type)}
                                            </div>
                                            <div className={'created'}>
                                                <Tag>{notice.productName}</Tag>
                                                {tag}
                                                {toLongDate(notice.created)}
                                            </div>
                                        </div>
                                        <div className={titleClassName}>
                                            {'#' + notice.id + ' ' + notice.title}
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
                        <div style={{padding: '10px 5px'}}>
                            <a onClick={markAsUnread}>标记为未读</a>
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
                            <ProDescriptions.Item span={16} label="详细描述" valueType="text">
                                {selectedNotice?.content}
                            </ProDescriptions.Item>
                        </ProDescriptions>
                    </div>
                </Container>
            </LRLayout>
        </div>
    );
};

export default Notice;
