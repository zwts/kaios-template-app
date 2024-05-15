import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { route } from "preact-router";
import MifareClassic from "../../helpers/mifare_classic_helper";
import { playRingtone } from "@/helpers/commonHelper";


import "./Reader.scss";

const Reader: FunctionalComponent = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [balance, setBalance] = useState('');
  const [readerState, setReaderState] = useState('lost');
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
        setReaderState('debited');
        setBalance(getBlockRecordsValue(records));
      }).catch((err: any) => {
        console.log('NfcDemo readBlock 1 after decrement 300 error:', err);
      });
    }).catch((err: any) => {
      console.log('NfcDemo authenticate err:', err);
    });
  };

  const handleTagFound = (event: any) => {
    const { tag } = event;
    if (tag) {
      navigator.vibrate(100);
      playRingtone();
      if (tag.techList.includes('MIFARE-Classic')) {
        // prevent default, or nfc tag API will fire on tag lost
        event.preventDefault();
        decrement(tag);
      }
    }
  };

  const handleTagLost = (event: any) => {
    setReaderState('lost');
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const {key} = event;
    switch(key) {
      case 'Backspace':
        console.log('handle event backspace');
        event.preventDefault();
        event.stopPropagation();
        route('/');
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const panel = panelRef.current;
    if (panel) {
      panel.focus();
    }
    const nfc = window.navigator.mozNfc;
    nfc.ontagfound = handleTagFound;
    nfc.ontaglost = handleTagLost;
    return ()=> {
      nfc.ontagfound = null;
      nfc.ontaglost = null;
    }
  }, []);

  return (
    <Fragment>
      <div className="reader" ref={panelRef} onKeyDown={handleKeydown} tabIndex={-1}>
        <div className="reader-container">
          <div className="card-info-container">
            {readerState === 'lost' ? (
              <Fragment>
                <div className="card-des">
                  <label data-l10n-id="place-card"></label>
                </div>
                <div className="card-image-container">
                  <i data-icon="nfc-pay" />
                </div>
              </Fragment>
            ) : ''}
            {readerState === 'debited' ? (
              <Fragment>
                <div className="card-des" >
                  <label data-l10n-id="debit-success"></label>
                  <div className="card-info">
                    <label data-l10n-id="balance"></label>
                    <span>{balance}</span>
                  </div>
                </div>
                <div className="card-deduction">
                  <label data-l10n-id="deduction-colon"></label>
                  <span>{`-${(PRICE/100).toPrecision(3)}`}</span>
                </div>
              </Fragment>
            ) : ''}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Reader;
