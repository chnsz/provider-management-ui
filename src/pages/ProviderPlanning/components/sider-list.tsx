import { getPlanningStatus } from '@/pages/ProviderPlanning/components/provider-planning-detail';
import { toShortDate } from '@/utils/common';
import classNames from 'classnames';
import React from 'react';
import {SendOutlined} from "@ant-design/icons";

type SideListProps = {
    data: ProviderPlanning.ProviderPlanning[];
    selectedValue?: ProviderPlanning.ProviderPlanning;
    onSelect?: (id: ProviderPlanning.ProviderPlanning) => any;
};

const SideList: React.FC<SideListProps> = (props) => {
    const onSelected = function (p: ProviderPlanning.ProviderPlanning) {
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
                                {p.productName} / {p.feature?.name || '-'}
                            </div>
                            <div className={'title'}>
                                #{p.id} {p.title}
                            </div>
                        </div>
                        <div className={'item-col priority-col'}>
                            <div>优先级</div>
                            <div className={'value'}>P{p.priority}</div>
                        </div>
                        <div className={'item-col status-col'}>
                            <div>状态</div>
                            <div className={'value'}>
                                {getPlanningStatus(p.status)}
                            </div>
                        </div>
                        <div className={'item-col owner-col'}>
                            <div>责任人</div>
                            <div className={'value'}>{p.assignee}</div>
                        </div>
                        <div className={'item-col date-col'}>
                            <div>创建日期&nbsp;&nbsp;</div>
                            <div>{toShortDate(p.created)}</div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default SideList;
