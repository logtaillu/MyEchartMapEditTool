import React from 'react';
import FileAction from './components/FileAction';
import MapConfigLine from './components/MapConfigLine';
import RegionMap from './components/RegionMap';
import { connect } from "dva";
import SelectArea from './components/SelectArea';

@connect(({ file }: any) => ({ ...file }))
export default class Index extends React.Component<any, any> {
  render() {
    return (
      <div className="root-wrapper">
        <FileAction />
        <MapConfigLine />
        <div className="filename">{this.props.filename}</div>
        <SelectArea/>
        {this.props.uid ? <RegionMap /> : null}
      </div>
    );
  }
}
