# MyEchartMapEditTool
导入地图geojson查看在echarts中的效果，手动调整文字和文字位置并导出结果，方便文字重叠调整
功能：  
1. 导入地图，查看echart显示效果
2. 设置项：
    1. width、height：绘图区域
    2. aspectRadio、fontSize:echart配置项
    3. 步距：地区文字单次移动量，对方向键盘和input的增减按钮生效s
3. 选择地区后，可以修改地区文字的名字、位置[调整json数据里的name、cp实现]，或方向键盘移动位置(没有cp的目前不允许进行移动)
4. 导出文件
5. 压缩选项[copy from echarts-map-tools]，在echarts中会被解码，在其他geojson工具中不一定能识别

## Task
1. show part map of selected area and save part cp
2. question: 在region map里存下part cp[好像不符合geojson格式]还是单独做一个part json，命名xxx_part.json，part map的时候取这个json?