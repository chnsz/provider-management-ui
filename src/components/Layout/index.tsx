import React, {CSSProperties, ReactElement, useEffect, useState} from "react";
import {Resizable} from "react-resizable";
import './index.less'

interface LRLayoutLeftSideProps {
    children?: any | undefined;
    width?: number | 300;
    style?: CSSProperties | undefined;
}

export const LeftSide: React.FC<LRLayoutLeftSideProps> = (props) => {
    return <div style={props.style}>{props.children}</div>
}

interface LRLayoutProps {
    children: ReactElement[];
    style?: CSSProperties | undefined;
}

const LRLayout: React.FC<LRLayoutProps> = (props) => {
    const [dragWidth, setDragWidth] = useState<number>(300);

    const left = props.children.find(t => typeof t.type === 'function' && t.type.name === 'LeftSide') || <></>;
    const right = props.children.filter(t => typeof t.type !== 'function' || (typeof t.type === 'function' && t.type.name !== 'LeftSide'));

    useEffect(() => {
        if(left.props.width){
            setDragWidth(left.props.width);
        }
    }, []);

    const style = props.style || {};
    style.display = "flex";
    style.height = "100%";

    return (
        <div className={'lr-Layout'} style={style}>
            <div className={'side'} style={{width: dragWidth + 'px'}}>
                {left}
            </div>
            <Resizable
                width={dragWidth}
                height={0}
                resizeHandles={['e']}
                handle={<div className={`splitter`}/>}
                onResize={(e, {size: {width}}) => setDragWidth(width)}
            >
                <div></div>
            </Resizable>
            <div className={'container'} style={{ width: 'calc(100% - ' + (dragWidth + 20) + 'px)'}}>
                {right}
            </div>
        </div>
    )
}

export default LRLayout;
