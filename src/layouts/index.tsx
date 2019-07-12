import React from 'react';
import Index from '@/pages';
export default class BasicLayout extends React.Component<any, any>{
  render() {
    return (
      <div>
        <h1>简易echarts用地图json处理工具</h1>
        <Index/>
      </div>
    )
  }
}
