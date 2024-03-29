import { getDefaultConfig, CONFIG_LABEL, CP_FORMAT, DEFAULT_COMPRESS } from "../pages/config/config";
import echarts from "echarts";
import numeral from "numeral";
import { getCurrentMapFileItem } from '@/pages/components/GetCurrentMapFileItem';
import parseGeoJson from "echarts/lib/coord/geo/parseGeoJson";
import $ from "n-zepto";
export default {
    namespace: "file",
    state: {
        mapfiles: [],// json列表
        currentUid: "",//当前json文件uid
        config: getDefaultConfig(),//配置项
        areaname: "",//选中区域名字
        cpposition: [],//选中区域位置
        compress: DEFAULT_COMPRESS,//是否压缩转码
        edited: false // 编辑状态
    },
    reducers: {
        // 切换压缩转码选项
        changeCompress(state, { payload: { checked } }) {
            return { ...state, compress: checked };
        },
        // 读取文件后保存内容
        saveFileContent(state: any, { payload: { mapfiles, append } }: any) {
            // 覆盖or追加
            mapfiles = append ? (state.mapfiles || []).concat(mapfiles || []) : (mapfiles || []);
            mapfiles.map(s => {
                if (s.data && !s.handledCPs) {
                    const data = $.extend(true, {}, s.data);
                    const parsed = parseGeoJson(data);
                    (s.data.features || []).map((region,idx) => {
                        if (!(region.properties && region.properties.cp)) {
                            region.properties.cp = parsed[idx].center;
                        }
                    });
                }
                s.handledCPs = true;
            });
            let currentUid = state.currentUid;
            // 设置当前file
            if ((!append || !currentUid) && mapfiles && mapfiles.length) {
                currentUid = mapfiles[0].uid;
                return {
                    ...state, edited: false, mapfiles, areaname: "",
                    cpposition: [], currentUid
                };
            } else {
                return { ...state, mapfiles, currentUid };
            }
        },
        // 保存配置
        saveConfig(state: any, { payload: { data } }) {
            const config = Object.assign({}, state.config, data);
            return { ...state, config };
        },
        // 区域选择
        areaSelect(state: any, { payload }) {
            const name = payload.name || "";
            if (name === state.areaname) {
                return { ...state, areaname: "", cpposition: [], edited: false };
            }
            const curfile = getCurrentMapFileItem(state);
            const mapary = curfile && curfile.data && curfile.data.features || [];
            const item = mapary.find(s => s.properties && s.properties.name == name);
            if (item && item.properties) {
                return {
                    ...state,
                    areaname: name,
                    cpposition: (item.properties.cp || []).concat([]),
                    edited: false
                };
            } else {
                return { ...state };
            }
        },
        // 保存cpposition[临时]
        saveCPPosition(state: any, { payload: { value, ind } }) {
            let cp = (state.cpposition || []).concat([]);
            cp[ind] = value;
            return { ...state, cpposition: cp };
        },
        // 键盘移动触发cpposition改变
        movePosition(state: any, { payload: { ind, action } }) {
            let { mapfiles, config, areaname, cpposition } = state;
            const curfile = getCurrentMapFileItem(state);
            const mapary = curfile && curfile.data && curfile.data.features || [];
            const item = mapary.find(s => s.properties && s.properties.name == areaname);
            // 找到这个area
            if (item) {
                let nowcp = item.properties.cp || [];
                const gap = config[CONFIG_LABEL.MOVE_GAP];
                nowcp[ind] = action == "add" ? nowcp[ind] + gap : nowcp[ind] - gap;
                nowcp[ind] = numeral(numeral(nowcp[ind]).format(CP_FORMAT)).value();
                item.properties.cp = nowcp;
                cpposition = nowcp.concat([]);
                echarts.registerMap(curfile.uid + "", curfile.data);
            }
            return { ...state, mapfiles: mapfiles.concat([]), cpposition };
        },
        // 手动修改cpposition blur触发
        changeCPPositiion(state: any) {
            let cp = (state.cpposition || []).concat([]);
            const curfile = getCurrentMapFileItem(state);
            const mapary = curfile && curfile.data && curfile.data.features || [];
            const item = mapary.find(s => s.properties && s.properties.name == state.areaname);
            if (item) {
                let nowcp = item.properties.cp || [];
                const mergecp = (ind) => {
                    if (!isNaN(parseFloat(cp[ind]))) {
                        nowcp[ind] = numeral(numeral(cp[ind]).format(CP_FORMAT)).value();
                    }
                }
                mergecp(0);
                mergecp(1);
                cp = nowcp.concat([]);
                item.properties.cp = nowcp;
            }
            echarts.registerMap(curfile.uid + "", curfile.data);
            return { ...state, mapfiles: state.mapfiles.concat([]), cpposition: cp };
        },
        // 改变当前地图
        changeMap(state, { payload: { uid } }) {
            return { ...state, currentUid: uid, cpposition: [], areaname: "", edited: false };
        },
        // 删除地图
        removeMap(state, { payload: { uid } }) {
            let { mapfiles, currentUid } = state;
            mapfiles = mapfiles.concat([]);
            const index = mapfiles.findIndex(s => s.uid == uid);
            if (index >= 0) {
                mapfiles.splice(index, 1);
            }
            if (currentUid == uid) {
                currentUid = mapfiles && mapfiles[0] && mapfiles[0].uid || "";
                return { ...state, mapfiles, currentUid, cpposition: [], areaname: "", edited: false };
            } else {
                return { ...state, mapfiles, currentUid };
            }
        },
        // 地区名字更改
        saveEdited(state, { payload: { edited, name } }) {
            let { areaname } = state;
            if (edited === false && name && name.length) {
                const curfile = getCurrentMapFileItem(state);
                const mapary = curfile && curfile.data && curfile.data.features || [];
                const item = mapary.find(s => s.properties && s.properties.name == state.areaname);
                if (item) {
                    item.properties.name = name;
                    areaname = name;
                    echarts.registerMap(curfile.uid + "", curfile.data);
                }
            }
            return { ...state, edited, areaname };
        }
    }
}
