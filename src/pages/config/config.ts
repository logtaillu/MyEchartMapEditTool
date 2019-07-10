export const CONFIG_LABEL = {
    MAP_WIDTH: "width",
    MAP_HEIGHT: "height",
    MAP_LABELSIZE: "labelfont",
    MOVE_GAP: "gap"
};
export const TEMP_PREFIX = "inp";

export const DEFAULT_CONFIG = {
    [CONFIG_LABEL.MAP_WIDTH]: 600,
    [CONFIG_LABEL.MAP_HEIGHT]: 650,
    [CONFIG_LABEL.MAP_LABELSIZE]: 16,
    [CONFIG_LABEL.MOVE_GAP]: 1
};
export function getDefaultConfig() {
    let config = {};
    Object.keys(DEFAULT_CONFIG).map(key => {
        config[key] = DEFAULT_CONFIG[key];
        config[TEMP_PREFIX + key] = DEFAULT_CONFIG[key];
    });
    return config;
}
