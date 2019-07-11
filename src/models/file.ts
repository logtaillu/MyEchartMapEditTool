import { getDefaultConfig, CONFIG_LABEL, CP_FORMAT } from "../pages/config/config";
import echarts from "echarts";
import numeral from "numeral";
export default {
    namespace: "file",
    state: {
        mapfile: null,
        filename: "",
        config: getDefaultConfig(),
        areaname: "",
        cpposition: []
    },
    reducers: {
        // 读取文件后保存内容
        saveFileContent(state: any, { payload: { data, filename, uid } }: any) {
            return {
                ...state, mapfile: data, filename, uid, areaname: "",
                cpposition: []
            };
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
                return { ...state, areaname: "", cpposition: [] };
            }
            const mapary = state && state.mapfile && state.mapfile.features || [];
            const item = mapary.find(s => s.properties && s.properties.name == name);
            if (item && item.properties.cp) {
                return {
                    ...state,
                    areaname: name,
                    cpposition: (item.properties.cp || []).concat([])
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
            let { mapfile, config, areaname,cpposition } = state;
            const mapary = mapfile && mapfile.features || [];
            const item = mapary.find(s => s.properties && s.properties.name == areaname);
            // 找到这个area
            if (item) {
                let nowcp = item.properties.cp || [];
                const gap = config[CONFIG_LABEL.MOVE_GAP];
                nowcp[ind] = action == "add" ? nowcp[ind] + gap : nowcp[ind] - gap;
                nowcp[ind] = numeral(numeral(nowcp[ind]).format(CP_FORMAT)).value();
                item.properties.cp = nowcp;
                cpposition = nowcp.concat([]);
                echarts.registerMap(state.uid + "", mapfile);
            }
            return { ...state, mapfile, cpposition };
        },
        // 手动修改cpposition blur触发
        changeCPPositiion(state: any) {
            let cp = (state.cpposition || []).concat([]);
            const mapfile = state && state.mapfile;
            const mapary = mapfile && mapfile.features || [];
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
            echarts.registerMap(state.uid + "", mapfile);
            return { ...state, mapfile, cpposition: cp };
        }
    }
}
