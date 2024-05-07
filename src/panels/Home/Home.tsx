import { Fragment, FunctionalComponent, createRef, h } from "preact";
import { useEffect, useRef } from "preact/hooks";

import Button from "../../components/Button";
import SimpleNavigationHelper from "../../helpers/simple_navigation_helper"

import "./Home.scss";


const Home: FunctionalComponent = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigatorRef = createRef();

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    if (!navigatorRef.current) {
      navigatorRef.current = new SimpleNavigationHelper('.pill-button', panel, '.home-container');
    }
    setTimeout(() => {console.log('home page focus');panel.focus()})
    return () => {};
  }, []);

  return (
    <Fragment>
      <div className="home" ref={panelRef} tabIndex={-1}>
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
