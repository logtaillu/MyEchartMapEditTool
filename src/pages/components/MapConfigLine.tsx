// 条件设置：地图大小，label字体，步距
import { connect } from "dva";
import React from 'react';
import { InputNumber } from 'antd';
import { CONFIG_LABEL, TEMP_PREFIX, DEFAULT_CONFIG } from "../config/config";

@connect(({ file }: any) => ({ ...file }))
export default class MapConfigLine extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
    }

    change(key, value) {
        const regexp = /^\d*\.?\d*$/;
        if (regexp.test(value + "")) {
            value = value == "" ? "" : parseFloat(value + "");
        } else {
            value = this.props.config[key];
        }
        let data = {};
        if (typeof (key) === "string") {
            data[key] = value;
        } else if (key instanceof Array) {
            key.map(i => data[i] = value);
        }
        this.props.dispatch({ type: "file/saveConfig", payload: { data } });
    }

    render() {
        const t = this;
        const inpprops = (key) => ({
            step: 1,
            min: 0,
            value: t.props.config[TEMP_PREFIX + key],
            onChange: t.change.bind(t, TEMP_PREFIX + key),
            onBlur: () => {
                let val = t.props.config[TEMP_PREFIX + key];
                val = val === "" ? DEFAULT_CONFIG[key] : val;
                t.change([key, TEMP_PREFIX + key], val)
            }
        });

        return (
            <div>
                <div className="map-size">
                    <span>画布尺寸：</span>
                    <InputNumber {...inpprops(CONFIG_LABEL.MAP_WIDTH)} />
                    <span> × </span>
                    <InputNumber {...inpprops(CONFIG_LABEL.MAP_HEIGHT)} />
                </div>
                <div>
                    <span>字体大小：</span>
                    <InputNumber {...inpprops(CONFIG_LABEL.MAP_LABELSIZE)} />
                </div>
                <div>
                    <span>步距：</span>
                    <InputNumber {...inpprops(CONFIG_LABEL.MOVE_GAP)} />
                </div>
            </div>
        )
    }
}
