import classNames from 'classnames';
import React from 'react';
import { Tag } from "antd";

type SideListProps = {
    data: ProductFeature.ProductFeature[];
    selectedValue?: ProductFeature.ProductFeature;
    onSelect?: (id: ProductFeature.ProductFeature) => any;
};

export const getCoverageStatus = (status: string) => {
    if (!status) {
        return ''
    }
    let color = '';
    let text = '';
    switch (status) {
        case 'covered':
            text = '已覆盖';
            color = 'cyan';
            break;
        case 'partially_covered':
            text = '部分覆盖';
            color = 'geekblue';
            break;
        case 'not_covered':
            text = '未覆盖';
            color = 'gold';
            break;
    }
    return <Tag color={color}>{text}</Tag>;
}

export const getSourceStatus = (source: string) => {
    let text = '';
    switch (source) {
        case 'api':
            text = '扫描 API';
            break;
        case 'doc':
            text = '扫描文档';
            break;
        case 'manual':
            text = '手工录入';
            break;
    }
    return text;
}

const SideList: React.FC<SideListProps> = (props) => {
    const onSelected = function (p: ProductFeature.ProductFeature) {
        return () => {
            window.location.hash = '#/id/' + p.id;
            if (props.onSelect) {
                props.onSelect(p);
            }
        };
    };

    return (
        <>
            {props.data.map((p) => {
                const itemClassName = classNames({
                    selected: props.selectedValue?.id === p.id,
                    items: true,
                });

                return (
                    <div className={itemClassName} key={p.id} onClick={onSelected(p)}>
                        <div className={'item-col title-col'}>
                            <div>
                                {p.productName}
                            </div>
                            <div className={'title'}>
                                #{p.id} {p.name}
                            </div>
                        </div>
                        <div className={'item-col status-col'}>
                            <div>覆盖状态</div>
                            <div className={'value'}>{getCoverageStatus(p.coverageStatus)}</div>
                        </div>
                        <div className={'item-col api-col'}>
                            <div>API 数量</div>
                            <div>{p.apiUsed} / {p.apiCount}</div>
                        </div>
                        <div className={'item-col source-col'}>
                            <div>录入来源</div>
                            <div className={'value'}>{getSourceStatus(p.source)}</div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default SideList;
