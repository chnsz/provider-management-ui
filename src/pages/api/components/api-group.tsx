import { getApiGroupList } from '@/services/api/api';
import { BookOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import '../api.less';

type changeProductName = {
    productName: string;
};

const ApiGroup: React.FC<changeProductName> = ({ productName }) => {
    const [data, setData] = useState<ApiGroups[]>([]);
    const [sum, setSum] = useState<number>();
    const size = 250;

    const loadData = () => {
        getApiGroupList(productName).then((rsp) => {
            const list = rsp.map((o: Api.Group) => {
                return {
                    apiGroup: o.apiGroup,
                    usedCount: o.usedCount,
                    needAnalysisCount: o.needAnalysisCount,
                    planningCount: o.planningCount,
                    missingCount: o.missingCount,
                    ignoreCount: o.ignoreCount,
                    sum:
                        o.usedCount +
                        o.needAnalysisCount +
                        o.planningCount +
                        o.missingCount +
                        o.ignoreCount,
                };
            });
            list.forEach((a) => {
                const sum = a.sum;
                setSum(sum);
            });
            setData(list);
        });
    };

    useEffect(loadData, [productName]);

    const getSum = () => {
        if (sum === 0) {
            return <>Null</>;
        }
    };

    interface ApiGroups {
        apiGroup: string;
        usedCount: number;
        needAnalysisCount: number;
        planningCount: number;
        missingCount: number;
        ignoreCount: number;
        sum: number;
    }

    return (
        <div className={'api-group'}>
            <div className={'search-header'}>API分组</div>
            {data.map((item, idx: any) => (
                <div key={idx}>
                    <div className={'group-card'}>
                        <div className={'whiteboard'}>
                            <BookOutlined />
                        </div>
                        <div className={'progress-right'}>
                            <div className={'progress-header'}>{item.apiGroup}</div>
                            <div className={'progress'}>
                                <div
                                    className={'used'}
                                    style={{ width: (item.usedCount / item.sum) * size + 'px' }}
                                ></div>
                                <div
                                    className={'need-analysis'}
                                    style={{
                                        width: (item.needAnalysisCount / item.sum) * size + 'px',
                                    }}
                                ></div>
                                <div
                                    className={'missing'}
                                    style={{ width: (item.missingCount / item.sum) * size + 'px' }}
                                ></div>
                                <div
                                    className={'planning'}
                                    style={{ width: (item.planningCount / item.sum) * size + 'px' }}
                                ></div>
                                <div
                                    className={'ignore'}
                                    style={{ width: (item.ignoreCount / item.sum) * size + 'px' }}
                                ></div>
                                {getSum()}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default ApiGroup;
