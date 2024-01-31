import React from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

type EditorProps = {
    defaultValue: string;
    onChange?: (str: string) => any;
    outline?: boolean;
};

const Editor: React.FC<EditorProps> = (props) => {
    let id = 0;
    setTimeout(() => {
        const vditor = new Vditor('vditor', {
            width: '100%',
            height: '100%',
            counter: {
                enable: true,
                type: 'text',
            },
            outline: {
                enable: props.outline || false,
                position: 'left',
            },
            mode: "wysiwyg",
            preview: {
                actions: [], // 'desktop', 'mobile'
                hljs: {
                    style: 'native',
                    lineNumber: true,
                }
            },
            toolbar: [
                'headings',
                'bold',
                'italic',
                'strike',
                'link',
                '|',
                'list',
                'ordered-list',
                'check',
                'outdent',
                'indent',
                '|',
                'quote',
                'line',
                'code',
                'inline-code',
                'insert-before',
                'insert-after',
                '|',
                'table',
                // 'emoji',
                'upload',
                'record',
                '|',
                'undo',
                'redo',
                '|',
                'outline',
                'export',
                'preview',
                /*{
                        name: 'more',
                        toolbar: [
                            'both',
                            // 'code-theme',
                            // 'content-theme',
                            // 'edit-mode',
                            // 'fullscreen',
                        ],
                    },*/
            ],
            // theme: 'dark',
            after: () => {
                vditor.setValue(props.defaultValue || '');
            },
            blur: (val) => {
                id = window.setTimeout(() => {
                    if (props.onChange) {
                        props.onChange(val);
                    }
                }, 1000)
            },
            focus() {
                window.clearTimeout(id);
            },
        });
    }, 100);
    return <div id="vditor"/>;
};

export default Editor;
