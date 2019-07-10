import React from 'react';

const BasicLayout: React.FC = props => {
  return (
    <div>
      <h1>地图</h1>
      {props.children}
    </div>
  );
};

export default BasicLayout;
