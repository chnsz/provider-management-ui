import React from "react";
import {marked} from "marked";
import hljs from 'highlight.js'
import 'highlight.js/styles/foundation.css'
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

export type MarkDownViewerProps = {
    content: string | undefined;
    options?: marked.MarkedOptions;
}

const isDev = process.env.NODE_ENV === 'development';

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
    return `<a target="_blank" href="${href}" title="${title || ''}">${text}</a>`;
};

const allLangs = hljs.listLanguages()

marked.setOptions({
    silent: !isDev,
    gfm: true,	// 启动类似于Github样式的Markdown语法
    pedantic: false, // 只解析符合Markdown定义的，不修正Markdown的错误
    sanitize: false, // 原始输出，忽略HTML标签（关闭后，可直接渲染HTML标签）
    renderer: renderer,
    highlight: (code, lang) => {
        let lng = lang;
        if (!allLangs.includes(lang)) {
            lng = 'javascript'
        }
        return hljs.highlight(code, {language: lng, ignoreIllegals: true}, true).value
    },
});

const MarkDownViewer: React.FC<MarkDownViewerProps> = ({content, options}) => {
    return <div dangerouslySetInnerHTML={{__html: marked.parse(content || '', options)}}/>
}

export default MarkDownViewer;
