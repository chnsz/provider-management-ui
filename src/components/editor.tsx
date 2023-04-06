import React from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

const Editor = () => {
    const [vd, setVd] = React.useState<Vditor>();
    React.useEffect(() => {
        const vditor = new Vditor('vditor', {
            width: '100%',
            height: '100%',
            counter: {
                enable: true,
                type: 'text',
            },
            outline: {
                enable: true,
                position: 'left',
            },
            // mode: "sv",
            preview: {
                actions: ['desktop', 'mobile'],
            },
            toolbar: [
                'emoji',
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
                'upload',
                'record',
                'table',
                '|',
                'undo',
                'redo',
                '|',
                'fullscreen',
                'edit-mode',
                {
                    name: 'more',
                    toolbar: [
                        'both',
                        'code-theme',
                        'content-theme',
                        'export',
                        'outline',
                        'preview',
                    ],
                },
            ],
            // theme: 'dark',
            after: () => {
                vditor.setValue('`Vditor` 最小代码示例');
                setVd(vditor);
                console.log(vd);
            },
            blur: (val) => {
                console.log(val);
            },
        });
    }, []);
    return <div id="vditor" />;
};

export default Editor;
