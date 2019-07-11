import React from 'react';
import FileAction from './components/FileAction';
import MapConfigLine from './components/MapConfigLine';
import RegionMap from './components/RegionMap';
import { connect } from "dva";
import SelectArea from './components/SelectArea';
import FileTabs from './components/FileTabs';

@connect(({ file }: any) => ({ ...file }))
export default class Index extends React.Component<any, any> {
  render() {
    return (
      <div className="root-wrapper">
        <FileAction />
        <MapConfigLine />
        <FileTabs/>
        <SelectArea />
        {this.props.currentUid ? <RegionMap /> : null}
      </div>
    );
  }
}
