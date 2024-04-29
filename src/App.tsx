// import l10n.js first
import "kaios-gaia-l10n";
import { h, render, Fragment } from "preact";

import "./App.scss";

const App = () => {
  return (
    <Fragment>
      <div>
        <label data-l10n-id="hello-world"></label>
      </div>
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
