import React, {CSSProperties, ReactElement, useEffect, useRef, useState} from 'react';
import {Resizable, ResizeCallbackData} from 'react-resizable';
import './index.less';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import {Breadcrumb} from "antd";

interface LRLayoutLeftSideProps {
    children?: any;//ReactElement[] | JSX.Element | any;
    width?: number | 300;
    minWidth?: number | 0;
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
    className?: string | undefined;
    style?: CSSProperties | undefined;
}

const LRLayout: React.FC<LRLayoutProps> = (props) => {
    const topRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragWidth, setDragWidth] = useState<number>(300);

    const breadcrumb = props.children
        .find((child) => React.isValidElement(child) && child.type === Breadcrumb);

    const top = props.children
        .find((child) => React.isValidElement(child) && child.type === Header) || <></>;

    const left = props.children
        .find((child) => React.isValidElement(child) && child.type === LeftSide) || <></>;

    const container = props.children
        .find((child) => React.isValidElement(child) && child.type === Container) || <></>;

    const onResize = function (e: React.SyntheticEvent, data: ResizeCallbackData) {
        const minWidth = left.props.minWidth || 0;
        if (minWidth > 0 && data.size.width <= minWidth) {
            return;
        }
        setDragWidth(data.size.width);
    };

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

    const bread = breadcrumb ? <div style={{marginTop: '10px'}}>{breadcrumb}</div> : <></>

    return (
        <div className={props.className} style={{height: 'calc(100vh - 120px)'}}>
            <div ref={topRef}>
                {bread}
                <div style={{padding: '10px 0 15px 0px', background: 'transparent'}}>
                    {top}
                </div>
            </div>
            <div ref={containerRef} className={'lr-Layout'} style={style}>
                <div className={'side'} style={{width: dragWidth + 'px'}}>
                    {left}
                </div>
                <Resizable
                    width={dragWidth}
                    height={0}
                    resizeHandles={['e']}
                    handle={<div className={`splitter`}/>}
                    onResize={onResize}
                >
                    <div></div>
                </Resizable>
                <div className={'container'} style={{width: 'calc(100% - ' + (dragWidth + 20) + 'px)'}}>
                    <Scrollbars>
                        {container}
                    </Scrollbars>
                </div>
            </div>
        </div>
    );
};

export default LRLayout;
