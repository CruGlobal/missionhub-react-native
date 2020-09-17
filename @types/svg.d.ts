declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  // eslint-disable-next-line import/no-unused-modules
  export default content;
}
