import './txt.less'
import React, {CSSProperties, ReactElement, useState} from "react";
import {message, Tooltip} from "antd";
import {CopyOutlined} from "@ant-design/icons";

function copyTxt(val: string) {
  if (!navigator.clipboard) {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = val;
    input.select();

    if (document.execCommand("copy")) {
      message.info('复制成功')
    } else {
      message.error('复制失败')
    }
    document.body.removeChild(input);
  } else {
    navigator.clipboard.writeText(val)
      .then(function () {
        message.info('复制成功')
      })
      .catch(function () {
        message.error('复制失败')
      })
  }
}

type TxtProps = {
  value?: string;
  children?: React.ReactNode | ReactElement[];
  disableCopy?: boolean;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

const Txt: React.FC<TxtProps> = (
  {value, children, disableCopy, className}
) => {
  const [btnDisplay, setBtnDisplay] = useState<string>('none');

  const copy = () => {
    if (!value) {
      return
    }
    copyTxt(value);
  }

  const btnTrigger = (v: string) => {
    if (!value || disableCopy) {
      return
    }
    setBtnDisplay(v);
  }

  return <div
    className={'txt ' + className}
    onMouseOver={() => btnTrigger('block')}
    onMouseOut={() => btnTrigger('none')}
  >
    <div className={'content'}>
      <Tooltip title={value}>
        {children ? children : value}
      </Tooltip>
    </div>
    <div style={{display: btnDisplay, marginLeft: '3px'}}>
      <CopyOutlined className={'btn'} onClick={copy}/>
    </div>
  </div>
}

export default Txt;
