// 文件导入和导出
import React from 'react';
import { Button, Upload, Icon, Modal } from "antd";
import { UploadProps } from 'antd/lib/upload';
import { connect } from "dva";
import FileSaver from "file-saver";
@connect(({ file }: any) => ({ ...file }))
export default class FileAction extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.downloadFile = this.downloadFile.bind(this);
    }

    downloadFile() {
        const { mapfile, filename } = this.props;
        let downloadFile = new Blob([JSON.stringify(mapfile || "{}")], { type: "application/json" });
        FileSaver.saveAs(downloadFile, filename);
    }

    render() {
        const t = this;
        const { uid } = this.props;
        const uploadProps: UploadProps = {
            beforeUpload: (file, fileList) => {
                if (/^.+\.json$/g.test(file.name)) {
                    let reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = function () {
                        const result = reader.result as string;
                        const json = JSON.parse(result || "{}");
                        t.props.dispatch({ type: "file/saveFileContent", payload: { data: json, filename: file.name, uid: file.uid } });
                    }
                } else {
                    Modal.error({ content: "请上传json文件" });
                }
                return false;
            },
            onRemove: () => {
                t.props.dispatch({ type: "file/saveFileContent", payload: { data: {}, filename: "", uid: "" } });
            },
            showUploadList: false
        }
        return (
            <div className="file-action">
                <Upload {...uploadProps}>
                    <Button type="primary"><Icon type="upload" /> 导入文件</Button>
                </Upload>
                <Button onClick={this.downloadFile} disabled={!uid} type="primary">导出文件</Button>
            </div>
        )
    }
}
