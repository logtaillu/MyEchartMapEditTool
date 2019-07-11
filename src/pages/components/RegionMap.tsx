// 地图显示
import React from 'react';
import { connect } from "dva";
import { CONFIG_LABEL } from "../config/config";
import echarts from "echarts";
import { getCurrentMapFileItem } from "./GetCurrentMapFileItem";

@connect(({ file }: any) => ({ ...file }))
export default class RegionMap extends React.Component<any, any>{
    constructor(props) {
        super(props)
    }
    chart;
    root;

    componentDidMount() {
        this.initChart(this.props);
    }

    initChart(props) {
        const { config, mapfiles, currentUid } = props;
        const mapfile = getCurrentMapFileItem({ mapfiles, currentUid });
        const root = this.root;
        if (root && currentUid && mapfile) {
            root.style.height = config[CONFIG_LABEL.MAP_HEIGHT] + "px";
            root.style.width = config[CONFIG_LABEL.MAP_WIDTH] + "px";
            echarts.registerMap(currentUid + "", mapfile.data);
            this.chart = echarts.init(root);
            this.chart.setOption(this.getOptions(props));
            const t = this;
            this.chart.on("mapselectchanged", (params) => {
                t.props.dispatch({ type: "file/areaSelect", payload: params.batch[0] });
            });
        }
    }

    getOptions(props) {
        const { config, areaname, currentUid } = props;
        const mapfile = getCurrentMapFileItem(props);
        const mapary = mapfile && mapfile.data && mapfile.data.features || [];
        const data = mapary.map(item => ({
            name: item.properties.name,
            selected: item.properties.name == areaname
        }));
        return {
            series: [
                {
                    type: "map",
                    mapType: currentUid + "",
                    top: "middle",
                    left: 'center',
                    aspectScale: config[CONFIG_LABEL.SCALE],
                    selectedMode: "single",
                    data,
                    label: {
                        normal: {
                            show: true,
                            fontFamily: 'Microsoft YaHei',
                            fontSize: config[CONFIG_LABEL.MAP_LABELSIZE]
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#FFFFFF',
                            borderWidth: 1,
                            borderColor: '#14a4fa'
                        },
                        emphasis: {
                            areaColor: '#389BB7',
                            borderWidth: 1,
                            borderColor: '#14a4fa'
                        }
                    },
                    animation: false
                }
            ]
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.chart) {
            const current = getCurrentMapFileItem(nextProps);
            if (this.props.currentUid !== nextProps.currentUid && current && current.data) {
                echarts.registerMap(nextProps.currentUid + "", current.data);
            }
            this.chart.setOption(this.getOptions(nextProps));
            const newconfig = nextProps.config || {};
            const preconfig = this.props.config || {};
            if ((newconfig[CONFIG_LABEL.MAP_HEIGHT] !== preconfig[CONFIG_LABEL.MAP_HEIGHT]) ||
                (newconfig[CONFIG_LABEL.MAP_WIDTH] !== preconfig[CONFIG_LABEL.MAP_WIDTH])) {
                this.chart.resize({ height: newconfig[CONFIG_LABEL.MAP_HEIGHT], width: newconfig[CONFIG_LABEL.MAP_WIDTH] });
            }
        } else {
            this.initChart(nextProps);
        }
    }

    render() {
        return <div ref={ele => this.root = ele} />;
    }
}
