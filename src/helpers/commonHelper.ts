export const playRingtone = () => {
  const ringtonePlayer = new Audio();
  ringtonePlayer.src = 'assets/media/notifier_bell.ogg';
  // @ts-ignore
  ringtonePlayer.mozAudioChannelType = 'notification';
  ringtonePlayer.play();
  window.setTimeout(() => {
    ringtonePlayer.pause();
    ringtonePlayer.src = '';
  }, 2000);
};

// Convert tag id:  uint8ArrayTo16String(tag.id)
export const uint8ArrayTo16String = (arr: Uint8Array) => {
  let str = '';
  if (arr.length) {
    for (var i = 0; i < arr.length; i++) {
      str += arr[i].toString(16);
    }
  }
  return str;
};

export const nfcRecordsConvert = (records: Uint8Array) => {
  return(((records[0] * 256 * 256 + records[1] * 256 + records[2]))/100).toFixed(2);
};

let fakeData: any = null;
export const getFakeData = (type: string) => {
  return new Promise(resolve => {
    if (fakeData) {
      resolve(fakeData[type]);
    } else {
      // fetch fake data from json
      fetch('fake-data.json').then(response => {
        return response.json();
      }).then(data => {
        fakeData = data;
        resolve(fakeData[type])
      });
    }
  });
}


