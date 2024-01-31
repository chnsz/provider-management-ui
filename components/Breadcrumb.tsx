import React from "react";
import {Breadcrumb} from "antd";

type Item = {
    title: React.ReactNode;
}

const CustomBreadcrumb: React.FC<{ items: Item[] }> = ({items}) => {

    return <div style={{marginBottom: '10px', marginTop: '-10px'}}>
        <Breadcrumb>
            {
                items.map((it, n) => <Breadcrumb.Item key={n}>{it.title}</Breadcrumb.Item>)
            }
        </Breadcrumb>
    </div>
}

export default CustomBreadcrumb;
