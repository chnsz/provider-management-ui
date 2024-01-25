import React from "react";
import { Descriptions } from "antd";
import EditableDes from "@/components/EditableDescription";
import { getCoverageStatus, getSourceStatus } from "@/pages/ProductFeature/components/sider-list";

type FeatureDetailProps = {
    productFeature: ProductFeature.ProductFeature;
    onChange?: (p: ProductFeature.ProductFeature) => any;
};

const FeatureDetail: React.FC<FeatureDetailProps> = ({ productFeature }) => {

    return (
        <div className={'provider-planning'}>
            <Descriptions column={6}>
                <Descriptions.Item label="特性名称" span={2}>
                    <EditableDes value={productFeature.productName} />
                </Descriptions.Item>
                <Descriptions.Item label="所属服务" span={1}>
                    {productFeature.productName}
                </Descriptions.Item>
                <Descriptions.Item label="覆盖状态" span={1}>
                    {getCoverageStatus(productFeature.coverageStatus)}
                </Descriptions.Item>
                <Descriptions.Item label="API 信息" span={1}>
                    {productFeature.apiUsed} / {productFeature.apiCount}
                </Descriptions.Item>
                <Descriptions.Item label="录入方式" span={1}>
                    {getSourceStatus(productFeature.source)}
                </Descriptions.Item>
            </Descriptions>

            <div className={'custom-label label-name'}>详细内容</div>
            {/*<Descriptions column={6}>
                <Descriptions.Item label="" span={4}>
                    <></>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间" span={1}>
                    {toLongDate(productFeature.created)}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间" span={1}>
                    {toLongDate(productFeature.updated)}
                </Descriptions.Item>
            </Descriptions>*/}
        </div>
    );
}

export default FeatureDetail;
