import { getNoticeTypeName } from '@/pages/Notice';
import { getNoticeList } from '@/services/notice/api';
import { toShortDate } from '@/utils/common';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import '../portal.less';

const ServiceNewsCard: React.FC = () => {
    const [noticeList, setNoticeList] = useState<Notice.Notice[]>([]);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const productName = params.get('productName') || '';

        getNoticeList({productName: [productName]}, 11, 1).then((data) => {
            setNoticeList(data.items);
        });
    }, []);

    return (
        <div className={'portal-card service-news'}>
            <div className={'header'}>
                <div className={'title'}>动态</div>
                <span className={'more'} onClick={() => window.open('notice', '_blank')}>
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

export default ServiceNewsCard;
