import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
// 文件选择切换
@connect(({ file }: any) => ({ ...file }))
export default class FileTabs extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.changePane = this.changePane.bind(this);
        this.removePane = this.removePane.bind(this);
    }

    changePane(uid) {
        this.props.dispatch({ type: "file/changeMap", payload: { uid } });
    }

    removePane(uid, action) {
        if (action == "remove") {
            this.props.dispatch({ type: "file/removeMap", payload: { uid } });
        }
    }

    render() {
        const { currentUid, mapfiles } = this.props;
        const panes = mapfiles.map(s => <TabPane tab={s.filename} key={s.uid} closable={true} />);
        return (
            <div className="filename">
                <Tabs type="editable-card" activeKey={currentUid} onChange={this.changePane} onEdit={this.removePane}>
                    {panes}
                </Tabs>
            </div>
        )
    }
}
