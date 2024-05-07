import { Fragment, FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";

import "./Reader.scss";

const Reader: FunctionalComponent = () => {
  const [id, setId] = useState('11112');
  const [tech, setTech] = useState('NFC-A');
  const [balance, setBalance] = useState('5000');

  return (
    <Fragment>
      <div className="reader">
        <div className="reader-header" data-l10n-id="nfc-card-reader"></div>
        <div className="reader-container">
          <div className="card-info-container">
            <div className="card-info">
              <label data-l10n-id="card-id"></label>
              <span>{id}</span>
            </div>
            <div className="card-info">
              <label data-l10n-id="card-tech"></label>
              <span>{tech}</span>
            </div>
            <div className="card-info">
              <label data-l10n-id="card-balance"></label>
              <span>{balance}</span>
            </div>
          </div>
          <div className="card-image-container">
            <i data-icon="nfc-pay" />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Reader;
