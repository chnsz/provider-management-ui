import React, {useEffect, useRef} from 'react';
import * as monaco from 'monaco-editor';

type DiffEditorProps = {
    original?: string;
    modified?: string;
    language?: string;
    width?: number | string;
    height?: number | string;
    theme?: 'vs-dark' | 'light';
    modifiedEditable?: boolean | undefined;
    originalEditable?: boolean | undefined;
    onChange?: (original: string, modified: string) => any;
}

const newMonacoEditor = (dom: HTMLElement, props: DiffEditorProps) => {
    const theme = props.theme || 'vs-dark';
    return monaco.editor.createDiffEditor(dom, {
        theme: theme, // 主题
        folding: true, // 是否折叠
        foldingHighlight: true, // 折叠等高线
        foldingStrategy: 'indentation', // 折叠方式  auto | indentation
        showFoldingControls: 'mouseover', // 是否一直显示折叠 always | mouseover
        disableLayerHinting: true, // 等宽优化
        emptySelectionClipboard: false, // 空选择剪切板
        selectionClipboard: false, // 选择剪切板
        automaticLayout: true, // 自动布局
        codeLens: true, // 代码镜头
        scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
        colorDecorators: true, // 颜色装饰器
        accessibilitySupport: 'auto', // 辅助功能支持  "auto" | "off" | "on"
        lineNumbers: 'on', // 行号 取值： "on" | "off" | "relative" | "interval" | function
        lineNumbersMinChars: 5, // 行号最小字符   number
        readOnly: props.modifiedEditable === undefined ? true : !props.modifiedEditable, //是否只读  取值 true | false
        originalEditable: props.originalEditable === undefined ? false : props.originalEditable,
        readOnlyMessage: {
            value: '只读编辑器，不可以编辑'
        },
    });
};

const DiffEditor: React.FC<DiffEditorProps> = (props) => {
    const monacoEditorDomRef = useRef<any>();
    const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);

    useEffect(() => {
        const editor = newMonacoEditor(monacoEditorDomRef.current, props);
        if (!editor) {
            return
        }
        editorRef.current = editor;

        editor.setModel({
            original: monaco.editor.createModel(props.original || '', props.language),
            modified: monaco.editor.createModel(props.modified || '', props.language),
        });

        if (props.onChange) {
            setTimeout(() => {
                editor.onDidUpdateDiff(() => {
                    if (!props.onChange) {
                        return
                    }
                    props.onChange(editor.getOriginalEditor().getValue(), editor.getModifiedEditor().getValue())
                })
            }, 50);
        }
        return () => {
            if (editorRef.current) {
                editorRef.current.dispose(); // 卸载编辑器
            }
        };
    }, []);

    useEffect(() => {
        editorRef.current?.getModifiedEditor().setValue(props.modified || '');
    }, [props.modified])

    return <div style={{height: props.height || '600px', width: props.width || '100%'}} ref={monacoEditorDomRef}/>
};

export default DiffEditor;
