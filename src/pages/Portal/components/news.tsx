import { getApiNewsInfo } from '@/services/portal/api';
import React, { useEffect, useState } from 'react';
import '../portal.less';

const News: React.FC = () => {
    let [list, setList] = useState<Portal.ServiceNews[]>();
    useEffect(() => {
        getApiNewsInfo().then((rsp) => {
            setList(rsp);
        });
    }, []);

    return (
        <div className={'portal-card service-news'}>
            <div className={'title-header'}>
                <span style={{ width: 'calc(100% - 90px)' }}>动态</span>
                <div className={'content-more'}>全部&gt;</div>
            </div>
            <div className={'container'}>
                {list?.map((item, index) => {
                    return (
                        <div key={index} className={'news-info'}>
                            <div className={'news-text'}>
                                <a href="https://www.runoob.com/">
                                    <i />
                                    {item.title}
                                </a>
                            </div>
                            <div className={'news-date'}>{item.created}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default News;
