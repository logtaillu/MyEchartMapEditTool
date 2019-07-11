// 文件导入和导出
import React from 'react';
import { Button, Upload, Icon, Modal, Switch } from "antd";
import { UploadProps } from 'antd/lib/upload';
import { connect } from "dva";
import FileSaver from "file-saver";
import compressFile from "./Compress";
import { getCurrentMapFileItem } from './GetCurrentMapFileItem';
@connect(({ file }: any) => ({ ...file }))
export default class FileAction extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.downloadFile = this.downloadFile.bind(this);
        this.changeCompress = this.changeCompress.bind(this);
    }

    downloadFile(onlyCurrent) {
        const { mapfiles, compress } = this.props;
        if (onlyCurrent) {
            const curfile = getCurrentMapFileItem(this.props);
            let newfile = compress ? compressFile(curfile.data) : curfile.data;
            let downloadFile = new Blob([JSON.stringify(newfile || "{}")], { type: "application/json" });
            FileSaver.saveAs(downloadFile, curfile.filename);
        } else {
            // 批量打包下载
        }
    }

    changeCompress(checked) {
        this.props.dispatch({ type: "file/changeCompress", payload: { checked } });
    }

    render() {
        const t = this;
        const { currentUid, mapfiles, compress } = this.props;
        const uploadProps: (append) => UploadProps = (append) => ({
            multiple: true,
            beforeUpload: (file, fileList) => {
                fileList = fileList || [];
                let uploadArr: any[] = [];
                let errarr: any[] = [];
                fileList.map(cur => {
                    if (/^.+\.json$/g.test(cur.name)) {
                        uploadArr.push(cur);
                    } else {
                        errarr.push(cur);
                    }
                });
                if (errarr && errarr.length) {
                    const names = errarr.map(s => s.name);
                    Modal.error({ title: "提示", content: `${names.join("、")}不是json文件，请导入json文件` });
                }
                if (uploadArr && uploadArr.length) {
                    let jsonarr: any[] = [];
                    uploadArr.map(cur => {
                        let reader = new FileReader();
                        reader.readAsText(file);
                        reader.onload = function () {
                            const result = reader.result as string;
                            const json = JSON.parse(result || "{}");
                            jsonarr.push({ data: json, filename: cur.name, uid: cur.uid });
                            if (jsonarr.length == uploadArr.length) {
                                t.props.dispatch({ type: "file/saveFileContent", payload: { mapfiles: jsonarr, append } });
                            }
                        }
                    });
                }
                return false;
            },
            showUploadList: false
        });
        return (
            <div className="file-action">
                <Upload {...uploadProps(false)}>
                    <Button type="primary"><Icon type="upload" /> 覆盖导入</Button>
                </Upload>
                <Upload {...uploadProps(true)}>
                    <Button type="primary"><Icon type="upload" /> 追加导入</Button>
                </Upload>
                <Button onClick={this.downloadFile.bind(this, true)} disabled={!currentUid} type="primary">导出当前文件</Button>
                <Button onClick={this.downloadFile.bind(this, false)} disabled={!currentUid} type="primary">导出全部文件</Button>
                <div className="encode-switch">
                    <span className="desc">是否压缩</span>
                    <Switch checked={compress} onChange={this.changeCompress} />
                    <span>*已压缩的不会重复压缩</span>
                </div>
            </div>
        )
    }
}
