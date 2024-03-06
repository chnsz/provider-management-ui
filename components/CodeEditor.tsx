import React, {useEffect, useRef, useState} from 'react';
import * as monaco from 'monaco-editor';
import type {OnChange} from '@monaco-editor/react';
import Editor, {loader} from '@monaco-editor/react';

loader.config({monaco});

const CodeEditor: React.FC<{
    defaultValue?: string;
    value?: string;
    language?: string;
    width?: number | string;
    height?: number | string;
    theme?: 'vs-dark' | 'light';
    onChange?: OnChange;
    readOnly?: boolean;
}> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>(600);
    const theme = props.theme || 'vs-dark';

    useEffect(() => {
        const height = containerRef.current?.clientHeight || 0;
        if (height) {
            setHeight(height);
        }
    }, []);

    return (
        <div ref={containerRef}>
            <Editor
                language={props.language}
                width={props.width || '100%'}
                value={props.value}
                defaultValue={props.defaultValue}
                height={props.height || height}
                onChange={props.onChange}
                theme={theme}
                options={{
                    theme: theme, // 编辑器主题颜色
                    folding: true, // 是否折叠
                    foldingHighlight: true, // 折叠等高线
                    foldingStrategy: 'indentation', // 折叠方式  auto | indentation
                    showFoldingControls: 'mouseover', // 是否一直显示折叠 always | mouseover
                    disableLayerHinting: true, // 等宽优化
                    emptySelectionClipboard: false, // 空选择剪切板
                    selectionClipboard: false, // 选择剪切板
                    automaticLayout: true, // 自动布局
                    codeLens: false, // 代码镜头
                    scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
                    colorDecorators: true, // 颜色装饰器
                    accessibilitySupport: 'auto', // 辅助功能支持  "auto" | "off" | "on"
                    lineNumbers: 'on', // 行号 取值： "on" | "off" | "relative" | "interval" | function
                    lineNumbersMinChars: 5, // 行号最小字符   number
                    readOnly: props.readOnly, //是否只读  取值 true | false
                    formatOnPaste: true,
                    formatOnType: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;
