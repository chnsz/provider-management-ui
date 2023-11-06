import React from "react";
import {Spin} from "antd";

const PageLoading: React.FC = () => {

  return <div style={{
    display: 'flex',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '43vh',
  }}>
    <Spin size="large"/>
  </div>
}

export default PageLoading;
