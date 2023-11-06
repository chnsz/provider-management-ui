import {Tag} from 'antd';
import React from 'react';

const OverviewItem: React.FC<{
    text: string;
    pageType: 'define' | 'changes';
}> = ({text, pageType}) => {
    let path: string = '/api/definition/';
    let suffix: string = '.yaml';

    if (pageType === 'changes') {
        path = '/api/changes/';
        suffix = '.html';
    }

    let hash: string = text;
    if (!hash.startsWith('/')) {
        hash = '/' + hash;
    }

    const arr: string[] = text.split('$');

    let label;
    if (arr.length > 1) {
        const str: string = arr[1];
        if (str.indexOf('有影响') !== -1) {
            label = <Tag color="#f50">{str}</Tag>;
        } else if (str === '无影响') {
            label = <Tag color="cyan">无影响</Tag>;
        } else if (str.indexOf('待分析') !== -1) {
            label = <Tag color="gold">{str}</Tag>;
        } else {
            label = <Tag>{str}</Tag>;
        }
    }

    const href = `${path}#${hash.split('$')[0]}${suffix}`;

    return (
        <div>
            <a href={href} target={'_blank'} rel={'noopener noreferrer'}>
                {arr[0]}
            </a>
            &nbsp;{label}
        </div>
    );
};

export default OverviewItem;
