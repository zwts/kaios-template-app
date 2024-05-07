import { Fragment, FunctionalComponent, createRef, h } from "preact";
import { route } from "preact-router";
import { useEffect, useRef } from "preact/hooks";

import Button from "../../components/Button";
import SimpleNavigationHelper from "../../helpers/simple_navigation_helper"

import "./Home.scss";

const Home: FunctionalComponent = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigatorRef = createRef();


  const handleKeydown = (event: KeyboardEvent) => {
    const { key } = event;
    switch (key) {
      case 'Enter':
        event.stopPropagation();
        const target = event.target as HTMLElement;
        const itemId = target.dataset.id;
        handleItemSelect(itemId);
        break;
      default:
        break;
    }
  }

  const handleItemSelect = (id: string | undefined) => {
    switch (id) {
      case 'reader':
        route('/reader');
        break;
      case 'card':
        route('/card');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }
    if (!navigatorRef.current) {
      navigatorRef.current = new SimpleNavigationHelper('.pill-button', panel, '.home-container');
    }

    panel.focus()
    return () => {
      navigatorRef.current.destroy();
    };
  }, []);

  return (
    <Fragment>
      <div className="home" ref={panelRef} tabIndex={-1} onKeyDown={handleKeydown}>
        <div className="home-header" data-l10n-id="reader-or-card"></div>
        <div className="home-container">
          <Button l10nId="reader" id="reader"></Button>
          <Button l10nId="card" id="card"></Button>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
