import { Fragment, FunctionalComponent, createRef, h } from "preact";
import { useEffect, useState } from "preact/hooks";

import "./Reader.scss";
import MifareClassic from "../../helpers/mifare_classic_helper";

const Reader: FunctionalComponent = () => {
  const [id, setId] = useState('');
  const [tech, setTech] = useState('');
  const [balance, setBalance] = useState('');
  const PRICE = 100;

  const getBlockRecordsValue = (records: Uint8Array) => {
    return ((records[0] + records[1] * 256 + records[2] * 256 * 256)/100).toString();
  };

  const decrement = (tag: mozNFCTag) => {
    let mcTag = new MifareClassic(tag, "NFC-A");
    mcTag.authenticateSectorWithKeyA(0, mcTag.getDefaultKey()).then(() => {
      mcTag.decrement(1, PRICE);
      mcTag.transfer(1);
      mcTag.readBlock(1).then((records: Uint8Array) => {
        setBalance(getBlockRecordsValue(records));
      }).catch((err: any) => {
        console.log('NfcDemo readBlock 1 after decrement 300 error:', err);
      });
    }).catch((err: any) => {
      console.log('NfcDemo authenticate err:', err);
    });
  };

  const uint8ArrayTo16String = (arr: Uint8Array) => {
    let str = '';
    if (arr.length) {
      for (var i = 0; i < arr.length; i++) {
        str += arr[i].toString(16);
      }
    }
    return str;
  };

  const handleTagFound = (event: any) => {
    const { tag } = event;
    if (tag) {
      navigator.vibrate(200);
      setTech(tag.techList.toString());
      setId(uint8ArrayTo16String(tag.id));

      if (tag.techList.includes('MIFARE-Classic')) {
        // prevent default, or nfc tag API will fire on tag lost
        event.preventDefault();
        decrement(tag);
      }
    }
  };

  useEffect(() => {
    const nfc = window.navigator.mozNfc;
    nfc.ontagfound = handleTagFound;
    return ()=> {
      nfc.ontagfound = null;
    }
  }, []);

  return (
    <Fragment>
      <div className="reader">
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
