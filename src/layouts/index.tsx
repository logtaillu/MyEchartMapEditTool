import React from 'react';

const BasicLayout: React.FC = props => {
  return (
    <div>
      <h1>简易echarts地图处理工具</h1>
      {props.children}
    </div>
  );
};

export default BasicLayout;
