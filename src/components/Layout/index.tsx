import React, { CSSProperties, ReactElement, useEffect, useRef, useState } from 'react';
import { Resizable } from 'react-resizable';
import './index.less';

interface LRLayoutLeftSideProps {
    children?: any | undefined;
    width?: number | 300;
    height?: number | 0;
    style?: CSSProperties | undefined;
}

export const LeftSide: React.FC<LRLayoutLeftSideProps> = (props) => {
    return <div style={props.style}>{props.children}</div>;
};

export const Header: React.FC<LRLayoutLeftSideProps> = (props) => {
    const style = props.style || {};
    if (props.height) {
        style.height = props.height + 'px';
    }
    return <div style={style}>{props.children}</div>;
};

export const Container: React.FC<LRLayoutLeftSideProps> = (props) => {
    return <div style={props.style}>{props.children}</div>;
};

interface LRLayoutProps {
    children: ReactElement[];
    style?: CSSProperties | undefined;
}

const LRLayout: React.FC<LRLayoutProps> = (props) => {
    const topRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [dragWidth, setDragWidth] = useState<number>(300);

    const top =
        props.children.find((t) => typeof t.type === 'function' && t.type.name === 'Header') || '';
    const left = props.children.find(
        (t) => typeof t.type === 'function' && t.type.name === 'LeftSide',
    ) || <></>;
    const container = props.children.find(
        (t) => typeof t.type === 'function' && t.type.name === 'Container',
    ) || <></>;

    useEffect(() => {
        if (left.props.width) {
            setDragWidth(left.props.width);
        }
        setTimeout(() => {
            const h = topRef.current?.clientHeight || 0;
            if (containerRef.current) {
                containerRef.current.style.height = 'calc(100% - ' + h + 'px)';
            }
        }, 500);
    }, [topRef]);

    const style = props.style || {};
    style.display = 'flex';
    style.height = 'calc(100% - 50px)';

    return (
        <div style={{ height: 'calc(100vh - 120px)' }}>
            <div ref={topRef} style={{ padding: '15px 0px', background: 'transparent' }}>
                {' '}
                {top}{' '}
            </div>
            <div ref={containerRef} className={'lr-Layout'} style={style}>
                <div className={'side'} style={{ width: dragWidth + 'px' }}>
                    {left}
                </div>
                <Resizable
                    width={dragWidth}
                    height={0}
                    resizeHandles={['e']}
                    handle={<div className={`splitter`} />}
                    onResize={(e, { size: { width } }) => setDragWidth(width)}
                >
                    <div></div>
                </Resizable>
                <div
                    className={'container'}
                    style={{ width: 'calc(100% - ' + (dragWidth + 20) + 'px)' }}
                >
                    {container}
                </div>
            </div>
        </div>
    );
};

export default LRLayout;
