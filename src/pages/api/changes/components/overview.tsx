import OverviewItem from '@/pages/api/changes/components/overview-item';
import {getApiChangeReport} from '@/services/api';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {Col, Collapse, Row, Timeline} from 'antd';
import {TimelineItemProps} from 'antd/es/timeline/TimelineItem';
import React, {useEffect, useState} from 'react';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';

const ADD_COLOR: string = '#52c41a',
    UPDATE_COLOR: string = '#faad14',
    DELETE_COLOR: string = '#ff4d4f'; //,OTHER_COLOR: string = '#1677ff';

const Overview: React.FC = () => {
    const [items, setItems] = useState<TimelineItemProps[]>([]);

    const collapseClass = useEmotionCss(() => {
        return {
            '.ant-collapse-header': {
                padding: '4px 0 !important',
            },
            '.ant-collapse-header-text': {
                fontWeight: 'bold',
            },
        };
    });

    useEffect(() => {
        getApiChangeReport().then((data) => {
            let items: TimelineItemProps[] = [];
            data.sort((a: Api.Report, b: Api.Report) => 0 - a!.label!.localeCompare(b!.label));

            data.forEach((t) => {
                let labelSet: boolean = false;

                if (t.add && t.add.length > 0) {
                    labelSet = true;
                    let addChild: JSX.Element[] = t.add!.flatMap((t) => (
                        <OverviewItem text={t} pageType={'define'}/>
                    ));

                    const children = (
                        <Collapse className={collapseClass} ghost>
                            <Collapse.Panel key={'add'} header={`新增 ${addChild.length} 个`}>
                                {addChild}
                            </Collapse.Panel>
                        </Collapse>
                    );
                    items.push({label: t.label, color: ADD_COLOR, children: children});
                }

                if (t.update && t.update.length > 0) {
                    let label = t.label;
                    let updateChild: JSX.Element[] = t.update!.flatMap((t) => (
                        <OverviewItem text={`/${label}/${t}`} pageType={'changes'}/>
                    ));

                    const children = (
                        <Collapse defaultActiveKey={'key'} className={collapseClass} ghost>
                            <Collapse.Panel key={'key'} header={`修改 ${updateChild.length} 个`}>
                                {updateChild}
                            </Collapse.Panel>
                        </Collapse>
                    );
                    items.push({label: labelSet ? '' : t.label, color: UPDATE_COLOR, children: children});
                    labelSet = true;
                }

                if (t.delete && t.delete.length > 0) {
                    let deleteChild: JSX.Element[] = t.delete!.flatMap((t) => (
                        <OverviewItem text={t} pageType={'define'}/>
                    ));

                    const children = (
                        <Collapse defaultActiveKey={'key'} className={collapseClass} ghost>
                            <Collapse.Panel key={'key'} header={`删除 ${deleteChild.length} 个`}>
                                {deleteChild}
                            </Collapse.Panel>
                        </Collapse>
                    );
                    items.push({label: labelSet ? '' : t.label, color: DELETE_COLOR, children: children});
                }
            });
            setItems(items);
        });
    }, []);

    const className = useEmotionCss(() => {
        return {
            height: 'calc(100% - 20px)',
            '.ant-timeline-item-content': {
                width: '100% !important',
            },
        };
    });

    return (
        <>
            <Row className={className}>
                <Scrollbars>
                    <Col span={12}>
                        <h3> API 变更汇总 </h3>
                        <div style={{width: '100%'}}>
                            <Timeline style={{paddingTop: '24px'}} mode={'left'} items={items}/>
                        </div>
                    </Col>
                    <Col span={12}></Col>
                </Scrollbars>
            </Row>
        </>
    );
};

export default Overview;
