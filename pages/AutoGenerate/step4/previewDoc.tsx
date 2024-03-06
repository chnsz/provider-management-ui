import {Tabs} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import CodeEditor from "@/components/CodeEditor";

const {TabPane} = Tabs;

export type exampleData = {
    title: string;
    script: string;
};

const PreviewDoc: React.FC<{
    previewDataPar: any,
    defaultActiveKey?: string
}> = ({previewDataPar, defaultActiveKey}) => {
    const containerRef = useRef<HTMLDivElement>();
    const [codeContent, setCodeContent] = useState<string>();
    const [docsContent, setDocsContent] = useState<string>();
    const [testCodeContent, setTestCodeContent] = useState<string>();
    const [exampleContent, setExampleContent] = useState<string>();
    const [height, setHeight] = useState<number>(600);

    useEffect(() => {
        setCodeContent(previewDataPar?.codeContent);
        setDocsContent(previewDataPar?.docsContent);
        setTestCodeContent(previewDataPar?.testCodeContent);
        setExampleContent(previewDataPar?.exampleContent);

        const height = containerRef.current?.clientHeight || 0;
        if (height > 200) {
            setHeight(height - 155);
        }
    }, [previewDataPar]);

    return <>
        <div className={'portal-card'} ref={containerRef}>
            <div className={'header'}>预览</div>
            <div className={'container'}>
                {
                    !previewDataPar ?
                        <div className={'no-data'}>暂无内容</div> :
                        <Tabs defaultActiveKey={defaultActiveKey || 'tab1'}>
                            <TabPane tab="代码" key="tab1">
                                <CodeEditor language={'go'} readOnly value={codeContent} height={height}/>
                            </TabPane>
                            <TabPane tab="文档" key="tab2">
                                <CodeEditor language={'markdown'} readOnly value={docsContent} height={height}/>
                            </TabPane>
                            <TabPane tab="单元测试" key="tab3">
                                <CodeEditor language={'go'} value={testCodeContent} height={height}/>
                            </TabPane>
                            <TabPane tab="脚本样例" key="tab4">
                                <CodeEditor language={'hcl'} value={exampleContent} height={height}/>
                            </TabPane>
                        </Tabs>
                }
            </div>
        </div>
    </>
}

export default PreviewDoc;
