import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { route } from "preact-router";

import "./Card.scss";
import { getFakeData, nfcRecordsConvert, playRingtone, uint8ArrayTo16String } from "@/helpers/commonHelper";

const Card: FunctionalComponent = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [balance, setBalance] = useState('');
  const [deduction, setDeduction] = useState('');
  const [aId, setAId] = useState('');

  const handleKeydown = (event: KeyboardEvent) => {
    const {key} = event;
    switch(key) {
      case 'Backspace':
        console.log('handle event backspace');
        event.preventDefault();
        event.stopPropagation();
        route('/');
        break;
      case '5':
        getFakeData('hci-event').then(res => {
          handleNfcHciEvent(res);
        })
      default:
        break;
    }
  }

  const updateCardInfo = (e: any) => {
    const { aid, payload } = e;
    console.log('updateCardInfo: ', aid, payload);
    const balanceRecord = nfcRecordsConvert(payload.slice(20, 23));
    const priceRecord = nfcRecordsConvert(payload.slice(2, 5));


    setBalance(balanceRecord);
    setDeduction(priceRecord);
    setAId(uint8ArrayTo16String(aid));

  };

  const handleNfcHciEvent = (e: any) => {
    console.log('receive NfcHciEvent---->', e);
    playRingtone();
    updateCardInfo(e);
    // TODO: logic for cards
  };

  useEffect(() => {
    const panel = panelRef.current;
    if (panel) {
      panel.focus();
    }
    if (navigator.mozSetMessageHandler) {
      console.log('add nfc-hci-event-transaction event listener');
      navigator.mozSetMessageHandler('nfc-hci-event-transaction', handleNfcHciEvent);
    }

    return ()=> {
      if (navigator.mozSetMessageHandler) {
        console.log('remove nfc-hci-event-transaction event listener');
        navigator.mozSetMessageHandler('nfc-hci-event-transaction', () => {});
      }
    }
  }, []);

  return (
    <Fragment>
      <div className="card" ref={panelRef} onKeyDown={handleKeydown} tabIndex={-1}>
        <div className="card-container">
          <div className="card-hint">
            <div className="card-name">
              <i data-icon="credit-card"></i>
              <span data-l10n-id="kai-travel-card"></span>
            </div>
            <i className="nfc-icon" data-icon="nfc"></i>
          </div>
          { aId.length ?
            <Fragment>
              <div className="transaction-title" data-l10n-id="newest-transaction"></div>
              <div className="transaction-message">
                <div className="message-item">
                  <label data-l10n-id="deduction-colon"></label>
                  <span>{`- ${deduction}`}</span>
                </div>
                <div className="message-item">
                  <label data-l10n-id="balance-colon"></label>
                  <span>{balance}</span>
                </div>
              </div>
            </Fragment>: '' }
        </div>
      </div>
    </Fragment>
  );
}

export default Card;
