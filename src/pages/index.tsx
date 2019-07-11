import React from 'react';
import FileAction from './components/FileAction';
import MapConfigLine from './components/MapConfigLine';
import RegionMap from './components/RegionMap';
import { connect } from "dva";
import SelectArea from './components/SelectArea';
import { getCurrentMapFileItem } from './components/GetCurrentMapFileItem';

@connect(({ file }: any) => ({ ...file }))
export default class Index extends React.Component<any, any> {
  render() {
    const cur = getCurrentMapFileItem(this.props);
    return (
      <div className="root-wrapper">
        <FileAction />
        <MapConfigLine />
        <div className="filename">{cur && cur.filename || ""}</div>
        <SelectArea />
        {this.props.currentUid ? <RegionMap /> : null}
      </div>
    );
  }
}
