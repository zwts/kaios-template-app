// import l10n.js first
import "kaios-gaia-l10n";
import { Fragment, h, render } from "preact";
import { Router, route } from 'preact-router';
import "./App.scss";
import { useEffect } from "preact/hooks";
import { PATH } from "./constants";
import AsyncPanel from "./components/AsyncPanel";

const App = () => {

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
    render(<App />, root);
  });
} else {
  console.error("Could not find root element to render!!");
}
