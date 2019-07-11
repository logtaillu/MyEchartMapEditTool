export function getCurrentMapFileItem(state) {
    let { mapfiles, currentUid } = state;
    const item = (mapfiles || []).find(item => item.uid == currentUid);
    return item;
}
