import { getApiGroupsSum } from '@/services/api/api';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';
import '../api.less';

const ApiGroup: React.FC = () => {
    const [productName, setProductName] = useState<string>('ECS');
    const [data, setData] = useState<dataType[]>([]);
    useEffect(() => {
        getApiGroupsSum(productName).then((rsp) => {
            console.log('rsp :', rsp);
            const list = rsp.map((o: Api.ApiGroups) => {
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
            setData(list);
            setProductName(productName);
        });
    }, [productName]);

    interface dataType {
        apiGroup: string;
        usedCount: number;
        needAnalysisCount: number;
        planningCount: number;
        missingCount: number;
        ignoreCount: number;
        sum: number;
    }

    return (
        <div className={'api-card'}>
            <div className={'search-header'}>API分组</div>
            <Divider />
            {data.map((item, idx: any) => (
                <div key={idx}>
                    <div className={'group-card'}>
                        <div className={'whiteboard'}></div>
                        <div className={'progress-right'}>
                            <div className={'progress-header'}>{item.apiGroup}</div>
                            <div className={'progress'}>
                                <div
                                    className={'n-used'}
                                    style={{ width: (item.usedCount / item.sum) * 250 }}
                                ></div>
                                <div
                                    className={'n-need-analysis'}
                                    style={{ width: (item.needAnalysisCount / item.sum) * 250 }}
                                ></div>
                                <div
                                    className={'n-missing'}
                                    style={{ width: (item.missingCount / item.sum) * 250 }}
                                ></div>
                                <div
                                    className={'n-planning'}
                                    style={{ width: (item.planningCount / item.sum) * 250 }}
                                ></div>
                                <div
                                    className={'n-ignore'}
                                    style={{ width: (item.ignoreCount / item.sum) * 250 }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
export default ApiGroup;
