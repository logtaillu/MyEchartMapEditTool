import { getDefaultConfig } from "../pages/config/config";
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
        saveFileContent(state: any, { payload: { data, filename, uid } }: any) {
            return {
                ...state, mapfile: data, filename, uid, areaname: "",
                cpposition: []
            };
        },
        saveConfig(state: any, { payload: { data } }) {
            const config = Object.assign({}, state.config, data);
            return { ...state, config };
        },
        areaSelect(state: any, { payload }) {
            const name = payload.name || "";
            const mapary = state && state.mapfile && state.mapfile.features || [];
            const item = mapary.find(s => s.properties && s.properties.name == name);
            if (item) {
                return {
                    ...state,
                    areaname: name,
                    cpposition: item.properties.cp || []
                };
            } else {
                return { ...state };
            }
        }
    }
}
