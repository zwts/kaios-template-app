import { Fragment, FunctionalComponent, h } from "preact";

import Button from "../../components/Button";

import "./Home.scss";

const Home: FunctionalComponent = () => {

  return (
    <Fragment>
      <div className="home">
        <div className="home-header" data-l10n-id="reader-or-card"></div>
        <div className="home-container">
          <Button l10nId="reader"></Button>
          <Button l10nId="card"></Button>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
