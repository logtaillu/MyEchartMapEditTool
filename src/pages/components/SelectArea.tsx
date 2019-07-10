// 位移
import React from 'react';
import { connect } from "dva";
import { InputNumber } from 'antd';
import { CONFIG_LABEL } from "../config/config";
// 不允许为空，没有初始cp的不让调
// 允许小数
@connect(({ file }: any) => ({ ...file }))
export default class SelectArea extends React.Component<any, any>{
    render() {
        const { config,areaname, cpposition } = this.props;
        const numprops = (ind) => ({
            step: config[CONFIG_LABEL.MOVE_GAP],
            value:cpposition[ind]||"",
        });
        return areaname && areaname.length ? (
            <div>
                <span>{areaname}：</span>
                <span>x：</span>
                <InputNumber value={cpposition[0]} />
                <span>y：</span>
                <InputNumber value={cpposition[1]} />
            </div>
        ) : null;
    }
}
