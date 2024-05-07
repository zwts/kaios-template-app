// import l10n.js first
import "kaios-gaia-l10n";
import { h, render } from "preact";
import { Router, route } from 'preact-router';
import "./App.scss";
import Home from "./panels/Home/Home";
import Reader from "./panels/Reader/Reader";
import { useEffect } from "preact/hooks";

const App = () => {

  useEffect(() => {
    route('/');
  }, []);


  return (
    <Router>
      <Home path="/" />
      <Reader path="/reader" />
    </Router>
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
