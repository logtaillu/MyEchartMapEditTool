// 位移
import React from 'react';
import { connect } from "dva";
import { InputNumber } from 'antd';
import { CONFIG_LABEL, CP_FORMAT } from "../config/config";
import numeral from "numeral";

// 允许小数
@connect(({ file }: any) => ({ ...file }))
export default class SelectArea extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
        this.keyListen = this.keyListen.bind(this);
        window.addEventListener("keydown", this.keyListen);
    }

    keyListen(event) {
        const e = event || window.event;
        if (e && e.keyCode && this.props.areaname && (e.keyCode >= 37 && e.keyCode <= 40)) {
            e.preventDefault();
            e.stopPropagation();
            switch (e.keyCode) {
                case 37: // left
                    this.props.dispatch({ type: "file/movePosition", payload: { ind: 0, action: "minus" } }); break;
                case 38://top
                    this.props.dispatch({ type: "file/movePosition", payload: { ind: 1, action: "add" } }); break;
                case 39://right
                    this.props.dispatch({ type: "file/movePosition", payload: { ind: 0, action: "add" } }); break;
                case 40://down
                    this.props.dispatch({ type: "file/movePosition", payload: { ind: 1, action: "minus" } }); break;
                default:
                    break;
            }
        }
    }

    change(ind, value) {
        const regexp = /^\d*\.?\d*$/;
        if (regexp.test(value + "")) {
            value = value === "" ? "": numeral(numeral(value).format(CP_FORMAT)).value();
        } else {
            value = this.props.cpposition[ind];
        }
        this.props.dispatch({ type: "file/saveCPPosition", payload: { ind, value } });
    }

    render() {
        const { config, areaname, cpposition } = this.props;
        const t = this;
        const numprops = (ind) => ({
            step: config[CONFIG_LABEL.MOVE_GAP],
            value: cpposition[ind] || "",
            onChange: t.change.bind(t, ind),
            onBlur: () => {
                t.props.dispatch({ type: "file/changeCPPositiion" });
            },
            formatter: value => {
                return value === "" ? "" : numeral(value).format(CP_FORMAT);
            },
            parser: str => {
                return str == "" ? "" : numeral(str).value();
            }
        });
        return areaname && areaname.length ? (
            <div className="select-area">
                <span>{areaname}：</span>
                <span className="num-label">x</span>
                <InputNumber className="x-num" {...numprops(0)} />
                <span className="num-label">y</span>
                <InputNumber className="y-num" {...numprops(1)} />
            </div>
        ) : null;
    }
}
