import {toShortDate} from '@/utils/common';
import classNames from 'classnames';
import React from 'react';
import '../task.less';
import {getTaskStatus} from "@/pages/Task/components/task-detail";

type SideListProps = {
    data: Task.Task[];
    selectedValue?: Task.Task;
    onSelect?: (id: Task.Task) => any;
};

const SideList: React.FC<SideListProps> = (props) => {
    const onClick = (task: Task.Task) => {
        return () => {
            if (!props.onSelect) {
                return;
            }
            window.location.hash = '#/id/' + task.id;
            props.onSelect(task);
        };
    };

    if (!props.data) {
        return <></>;
    }

    return (
        <div className={'side-list'}>
            {props.data.map((t: Task.Task) => {
                const className = classNames({
                    list: true,
                    selected: t.id === props.selectedValue?.id,
                });

                return (
                    <div className={className} key={t.id} onClick={onClick(t)}>
                        <div className={'col title'}>
                            <div>
                                {t.productName || '-'} / P{t.priority}{' '}
                            </div>
                            <div>
                                #{t.id} {t.title}
                            </div>
                        </div>
                        <div className={'col status'}>
                            <div>状态</div>
                            <div>{getTaskStatus(t.status)}</div>
                        </div>
                        <div className={'col assignee'}>
                            <div>负责人</div>
                            <div>{t.assignee}</div>
                        </div>
                        <div className={'col date'}>
                            <div>截止日期&nbsp;&nbsp;</div>
                            <div>{toShortDate(t.deadline)}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SideList;
