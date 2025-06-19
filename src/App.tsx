// import l10n.js first
import "kaios-gaia-l10n";
import { Fragment, FunctionComponent, h, render } from "preact";
import { Router, route } from 'preact-router';
import "./App.scss";
import { useEffect } from "preact/hooks";
import { PATH } from "./constants";
import AsyncPanel from "./components/AsyncPanel";
import { store } from './redux/store';
import { Provider } from "react-redux";

const App: FunctionComponent = () => {
  useEffect(() => {
    route(PATH.HOME);
  }, []);


  return (
    <Fragment> 
      <Router>
        <AsyncPanel path={PATH.HOME} panelName="Home/Home" />
      </Router>
    </Fragment>
  );
};

const root: HTMLElement | null = document.getElementById("root");

if (root) {
  navigator.mozL10n.once(() => {
    // @ts-ignore
    render(<Provider store={store}><App /></Provider>, root);
  });
} else {
  console.error("Could not find root element to render!!");
}
