import { h, FunctionComponent, JSX } from 'preact';
import AsyncRoute from 'preact-async-route';

interface IProps {
  path: string;
  component?: any;
  getComponent?: (
    this: AsyncRoute,
    url: string,
    callback: (component: any) => void,
    props: any
  ) => Promise<any> | void;
  loading?: () => JSX.Element;
  [key: string]: any;
}

const dynamicPanelLoader = (panelName: string) => () =>
  import(`@/panels/${panelName}`).then(module => module.default);

const AsyncPanel: FunctionComponent<IProps> = ({
  path,
  panelName,
  ...props
}) => {
  return (
    <AsyncRoute
      path={path}
      getComponent={dynamicPanelLoader(panelName)}
      loading={() => <div class="loading" />}
      {...props}
    />
  );
};

export default AsyncPanel;

