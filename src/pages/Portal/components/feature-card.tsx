import React, {useEffect, useState} from "react";
import {Space, Tag} from "antd";
import '../portal.less'
import {getProductFeatureList} from "@/services/product-feature/api";
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import AddFeatureDialog from "@/pages/ProductFeature/components/add-feature-dialog";
import ManageFeatureDialog from "@/pages/ProductFeature/components/manage-featrue-dialog";

const FeatureCard: React.FC<{ productName: string }> = ({productName}) => {
    const [data, setData] = useState<ProductFeature.ProductFeature[]>([]);

    const loadData = () => {
        getProductFeatureList({productName: [productName]}, 100, 1).then((d) => {
            setData(d.items.sort((a, b) => {
                return a.name.localeCompare(b.name, 'zh-Hans-CN');
            }));
        });
    }

    useEffect(loadData, []);

    return <div className={'portal-card'}>
        <div className={'header splitter'}>
            <div className={'title'}>服务特性</div>
            <div className={'toolbar'}>
                <Space size={15}>
                    <AddFeatureDialog onSuccess={loadData} productName={productName}/>
                    <ManageFeatureDialog productName={productName} onClosed={loadData}/>
                    <span className={'more'} onClick={() => window.open(`/product-feature#/${productName}`, '_blank')}>
                    更多&gt;
                </span>
                </Space>
            </div>
        </div>
        <div className={'container'}>
            <Scrollbars>
                <Space size={[10, 20]} wrap>
                    {
                        data.map(f => {
                            const cs = f.actualCoverage ? f.actualCoverage : f.coverageStatus;

                            let color = '';
                            let text = '';
                            switch (cs) {
                                case 'covered':
                                    color = 'cyan';
                                    text = '已覆盖';
                                    break;
                                case 'partially_covered':
                                    text = '部分覆盖';
                                    color = 'geekblue';
                                    break;
                                case 'not_covered':
                                    color = 'gold';
                                    text = '未覆盖';
                                    break;
                            }
                            return <Tag key={f.id}
                                        color={color}
                                        style={{fontSize: '14px', padding: '4px 15px'}}
                                        title={text}
                            >
                                {f.name} ({f.apiUsed}/{f.apiCount})
                            </Tag>
                        })
                    }
                </Space>
            </Scrollbars>
        </div>
    </div>
}

export default FeatureCard;
