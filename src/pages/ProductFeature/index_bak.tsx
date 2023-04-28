import React, {useState} from "react";
import './product-feature.less'
import {Breadcrumb, Button, notification, Space} from "antd";
import LRLayout, {Container, Header, LeftSide} from "@/components/Layout";
import SearchForm, {SearchFormProps} from "@/components/SearchForm";
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import {useLocation} from "@@/exports";
import SideList from "@/pages/ProductFeature/components/sider-list";
import {getProductFeatureList} from "@/services/product-feature/api";
import FeatureDetail from "@/pages/ProductFeature/components/feature-detail";

const defaultVal = {
    created: '',
    id: 0,
    priority: -1,
    productName: '',
    status: '',
    title: '',
    updated: '',
};

const ProductFeature: React.FC = () => {
    const [selectedFeature, setSelectedFeature] = useState<ProductFeature.ProductFeature>(defaultVal);
    const [featureList, setFeatureList] = useState<ProductFeature.ProductFeature[]>([]);
    const [notificationApi, contextHolder] = notification.useNotification();
    const location = useLocation();

    let page = 1;
    let productNameArr: string[] = [];
    let ownerArr: string[] = [];

    const loadData = (pageNum: number, isAppend: boolean) => {
        console.log(pageNum, isAppend);
        const queryParams = {
            productName: productNameArr,
            owner: ownerArr,
        };
        getProductFeatureList(queryParams, 50, pageNum).then(data => {
            if (data.items.length === 0 && pageNum > 1) {
                page--
                notificationApi['info']({
                    message: '提示',
                    description: '没有更多数据',
                });
                return;
            }
            if (isAppend) {
                setFeatureList([...featureList, ...data.items]);
            } else {
                setFeatureList(data.items);
            }
        });
    }

    const onSearch = (formData: SearchFormProps) => {
        productNameArr = formData.productName;
        ownerArr = formData.owner;
        loadData(1, false);
    }

    const deletePlanning = () => {
    }

    const loadMore = () => {
        loadData(++page, true);
    };

    return <LRLayout className={'product-feature'}>
        <Breadcrumb items={[{title: '首页'}, {title: '特性分析'}]}/>
        <Header>
            <div style={{background: '#fff', padding: '20px 20px'}}>
                <SearchForm onSearch={onSearch} options={['owner', 'product']}/>
            </div>
        </Header>
        <LeftSide width={window.innerWidth * 0.25} minWidth={500} style={{height: '100%'}}>
            <div className={'custom-title side-header'}>
                <div className={'side-title'}>特性详情</div>
                <div className={'side-tools-bar'}>
                    <Button type={'primary'} size={'small'}>
                        新建特性
                    </Button>
                </div>
            </div>
            <div className={'list'}>
                <Scrollbars>
                    <div style={{padding: '10px'}}>
                        <SideList data={featureList} selectedValue={selectedFeature} onSelect={setSelectedFeature}/>
                    </div>
                    <div className={'load-more'}>
                        <a onClick={loadMore}>加载更多</a>
                    </div>
                </Scrollbars>
            </div>
        </LeftSide>
        <Container>
            <div>
                <div className={'custom-title'}>特性信息</div>
                <div style={{padding: '20px'}}>
                    <Space direction={"vertical"}>
                    <div className={'tools-bar'}>
                        <div className={'left-bar'}>
                            <Space size={'middle'}>
                                <Button size={'small'} danger onClick={deletePlanning}
                                        disabled={selectedFeature.id === 0}>
                                    删除规划
                                </Button>
                                {contextHolder}
                            </Space>
                        </div>
                    </div>
                    <FeatureDetail productFeature={selectedFeature}/>
                    </Space>
                </div>
            </div>
        </Container>
    </LRLayout>
}

export default ProductFeature;
