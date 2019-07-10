// 位移
import React from 'react';
import { connect } from "dva";
import { InputNumber } from 'antd';

@connect(({ file }: any) => ({ ...file }))
export default class SelectArea extends React.Component<any, any>{
    render() {
        const { areaname, cpposition } = this.props;
        return areaname && areaname.length ? (
            <div>
                <span>{areaname}：</span>
                <InputNumber value={cpposition[0]} />
                <InputNumber value={cpposition[1]} />
            </div>
        ) : null;
    }
}
