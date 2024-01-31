import { getNoticeTypeName } from '@/pages/Notice';
import { getNoticeList } from '@/services/notice/api';
import { toShortDate } from '@/utils/common';
import React, { useEffect, useState } from 'react';
import '../portal.less';

const ServiceNoticeCard: React.FC<{ productName: string }> = ({ productName }) => {
    const [noticeList, setNoticeList] = useState<Notice.Notice[]>([]);

    useEffect(() => {
        getNoticeList({ productName: [productName] }, 10, 1).then((data) => {
            setNoticeList(data.items);
        });
    }, [productName]);

    return (
        <div className={'portal-card service-news'}>
            <div className={'header'}>
                <div className={'title'}>API 动态</div>
                <span
                    className={'more'}
                    onClick={() => window.open(`/notice#/${productName}`, '_blank')}
                >
                    全部&gt;
                </span>
            </div>
            <div className={'container'} style={{ marginTop: '-10px' }}>
                {noticeList.map((notice) => {
                    return (
                        <div key={notice.id} className={'item'}>
                            <a href={'notice/#/id/' + notice.id}>
                                <i />【{getNoticeTypeName(notice.type)}】 {notice.title}
                            </a>
                            <span>{toShortDate(notice.created)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ServiceNoticeCard;
