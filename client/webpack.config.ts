import { Configuration } from 'webpack';

const webpackConfig: Configuration = {
  // 기존 웹팩 설정
  // ...
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify'),
      fs: false, // 또는 필요한 경우에만 사용: require.resolve('fs'),
    },
  },
};

export default webpackConfig;