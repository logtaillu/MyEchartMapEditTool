import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  base: '/MyEchartMapEditTool/',
  publicPath: '/MyEchartMapEditTool/',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'MyEchartMapEditTool',
      dll: false,
      
      routes: {
        exclude: [
          /components\//,
          /config\//,
        ],
      },
    }]
  ],
}

export default config;
