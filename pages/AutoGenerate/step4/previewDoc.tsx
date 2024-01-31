import {Col, Row, Space, Tabs} from 'antd';
import React, {useEffect, useState} from 'react';
import CodeEditor from "@/components/CodeEditor";

const {TabPane} = Tabs;

export type exampleDate = {
    title: string;
    script: string;
};

const PreviewDoc: React.FC<{ previewDataPar: any }> = ({previewDataPar}) => {
    const [codeContent, setCodeContent] = useState<string>();
    const [docsContent, setDocsContent] = useState<string>();
    const [testCodeContent, setTestCodeContent] = useState<string>();
    const defaultActiveKey = 'tab1';

    useEffect(() => {
        setCodeContent(previewDataPar?.codeContent);
        setDocsContent(previewDataPar?.docsContent);
        setTestCodeContent(previewDataPar?.testCodeContent);
    }, [previewDataPar]);


    return <>
        <div className={'portal-card'}>
            <div className={'header'}>预览</div>
            <div className={'container'}>
                {
                    !previewDataPar ?
                        <div className={'no-data'}>暂无文档</div> :
                        <Tabs defaultActiveKey={defaultActiveKey}>
                            <TabPane tab="代码" key="tab1">
                                <CodeEditor language={'go'} readOnly value={codeContent}/>
                            </TabPane>

                            <TabPane tab="文档" key="tab2">
                                <CodeEditor language={'go'} readOnly value={docsContent}/>
                            </TabPane>
                            <TabPane tab="单元测试" key="tab3">
                                <CodeEditor language={'go'} readOnly value={testCodeContent}/>
                            </TabPane>
                        </Tabs>
                }
            </div>
        </div>
    </>
}

export default PreviewDoc;
