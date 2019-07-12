import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  base: '/MyMapTest/',
  publicPath: '/MyMapTest/',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'MyMapTest',
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
