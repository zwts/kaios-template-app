export default class MifareClassic {
  // ST default keyA
  KEY_DEFAULT: Uint8Array = new Uint8Array([0x00,0x00,0x00,0x00,0x00,0xE0]);
  mTech: any;
  mTag: any;
  constructor(tag: any, techType: string) {
    this.mTag = tag;
    this.mTech = tag.selectTech(techType);
  }
  
  getDefaultKey() {
    return this.KEY_DEFAULT;
  }

  /**
   * Return the first block of a given sector.
   * <p>Does not cause any RF activity and does not block.
   *
   * @param sectorIndex index of sector to lookup, starting from 0
   * @return block index of first block in sector
   */
  sectorToBlock(sectorIndex: number) {
      if (sectorIndex < 32) {
          return sectorIndex * 4;
      } else {
          return 32 * 4 + (sectorIndex - 32) * 16;
      }
  }

  /**
   * Authenticate a sector with key A.
   *
   * <p>Successful authentication of a sector with key A enables other
   * I/O operations on that sector. The set of operations granted by key A
   * key depends on the ACL bits set in that sector. For more information
   * see the MIFARE Classic specification on {@see http://www.nxp.com}.
   *
   * <p>A failed authentication attempt causes an implicit reconnection to the
   * tag, so authentication to other sectors will be lost.
   *
   * <p>This is an I/O operation and will block until complete. It must
   * not be called from the main application thread. A blocked call will be canceled with
   * {@link IOException} if {@link #close} is called from another thread.
   *
   * <p class="note">Requires the {@link android.Manifest.permission#NFC} permission.
   *
   * @param sectorIndex index of sector to authenticate, starting from 0
   * @param key 6-byte authentication key
   * @return true on success, false on authentication failure
   * @throws TagLostException if the tag leaves the field
   * @throws IOException if there is an I/O failure, or the operation is canceled
   */
  authenticateSectorWithKeyA(sectorIndex: number, key: Uint8Array) {
      return this.authenticate(sectorIndex, key, true);
  }

  /**
   * Authenticate a sector with key B.
   *
   * <p>Successful authentication of a sector with key B enables other
   * I/O operations on that sector. The set of operations granted by key B
   * depends on the ACL bits set in that sector. For more information
   * see the MIFARE Classic specification on {@see http://www.nxp.com}.
   *
   * <p>A failed authentication attempt causes an implicit reconnection to the
   * tag, so authentication to other sectors will be lost.
   *
   * <p>This is an I/O operation and will block until complete. It must
   * not be called from the main application thread. A blocked call will be canceled with
   * {@link IOException} if {@link #close} is called from another thread.
   *
   * <p class="note">Requires the {@link android.Manifest.permission#NFC} permission.
   *
   * @param sectorIndex index of sector to authenticate, starting from 0
   * @param key 6-byte authentication key
   * @return true on success, false on authentication failure
   * @throws TagLostException if the tag leaves the field
   * @throws IOException if there is an I/O failure, or the operation is canceled
   */
  authenticateSectorWithKeyB(sectorIndex: number, key: Uint8Array) {
      return this.authenticate(sectorIndex, key, false);
  }

  authenticate(sector: number, key: Uint8Array, useKeyA: boolean) {
      let cmd = new Uint8Array(12);

      // First byte is the command
      if (useKeyA) {
          cmd[0] = 0x60; // phHal_eMifareAuthentA
      } else {
          cmd[0] = 0x61; // phHal_eMifareAuthentB
      }

      // Second byte is block address
      // Authenticate command takes a block address. Authenticating a block
      // of a sector will authenticate the entire sector.
      cmd[1] = this.sectorToBlock(sector);

      // Next 4 bytes are last 4 bytes of UID
      let uid = this.mTag.id;
      for (var i=0;i<4;i++) { 
        cmd[2+i] = uid[uid.length - 4+i];
      }

      // Next 6 bytes are key
      for (var i=0;i<6;i++) { 
        cmd[6+i] = key[i];
      }

      return this.transceive(cmd, false);
  }

  /**
   * Read 16-byte block.
   *
   * <p>This is an I/O operation and will block until complete. It must
   * not be called from the main application thread. A blocked call will be canceled with
   * {@link IOException} if {@link #close} is called from another thread.
   *
   * <p class="note">Requires the {@link android.Manifest.permission#NFC} permission.
   *
   * @param blockIndex index of block to read, starting from 0
   * @return 16 byte block
   * @throws TagLostException if the tag leaves the field
   * @throws IOException if there is an I/O failure, or the operation is canceled
   */
  readBlock(blockIndex: number) {
      let cmd = new Uint8Array([0x30, blockIndex]);
      return this.transceive(cmd, false);
  }

  /**
   * Write 16-byte block.
   *
   * <p>This is an I/O operation and will block until complete. It must
   * not be called from the main application thread. A blocked call will be canceled with
   * {@link IOException} if {@link #close} is called from another thread.
   *
   * <p class="note">Requires the {@link android.Manifest.permission#NFC} permission.
   *
   * @param blockIndex index of block to write, starting from 0
   * @param data 16 bytes of data to write
   * @throws TagLostException if the tag leaves the field
   * @throws IOException if there is an I/O failure, or the operation is canceled
   */
  writeBlock(blockIndex: number, data: Uint8Array) {
      if (data.length != 16) {
          //throw new IllegalArgumentException("must write 16-bytes");
          return;
      }

      let cmd = new Uint8Array(data.length + 2);
      cmd[0] = 0xA0; // MF write command
      cmd[1] = blockIndex;
      for (var i=0;i<data.length;i++) { 
        cmd[2+i] = data[i];
      }

      this.transceive(cmd, false);
  }

  /**
   * Increment a value block, storing the result in the temporary block on the tag.
   *
   * <p>This is an I/O operation and will block until complete. It must
   * not be called from the main application thread. A blocked call will be canceled with
   * {@link IOException} if {@link #close} is called from another thread.
   *
   * <p class="note">Requires the {@link android.Manifest.permission#NFC} permission.
   *
   * @param blockIndex index of block to increment, starting from 0
   * @param value non-negative to increment by
   * @throws TagLostException if the tag leaves the field
   * @throws IOException if there is an I/O failure, or the operation is canceled
   */
  increment(blockIndex: number, value: number) {
    if (value > 0) {
      let data = this.intToLittleEndianUint8Array(value);
      let cmd = new Uint8Array([0xC1, blockIndex, ...data]);
  
      this.transceive(cmd, false);
    }
  }

  /**
   * Decrement a value block, storing the result in the temporary block on the tag.
   *
   * <p>This is an I/O operation and will block until complete. It must
   * not be called from the main application thread. A blocked call will be canceled with
   * {@link IOException} if {@link #close} is called from another thread.
   *
   * <p class="note">Requires the {@link android.Manifest.permission#NFC} permission.
   *
   * @param blockIndex index of block to decrement, starting from 0
   * @param value non-negative to decrement by
   * @throws TagLostException if the tag leaves the field
   * @throws IOException if there is an I/O failure, or the operation is canceled
   */
  decrement(blockIndex: number, value: number) {
    if (value > 0) {
      let data = this.intToLittleEndianUint8Array(value);
      let cmd = new Uint8Array([0xC0, blockIndex, ...data]);
  
      this.transceive(cmd, false);
    }
  }


  intToLittleEndianUint8Array(value: number) {
    const byteLength = 4;
    const buffer = new ArrayBuffer(byteLength);
    const view = new Uint8Array(buffer);
    const int32View = new Int32Array(buffer);
  
    // 将整数以小端字节序写入缓冲区
    int32View[0] = value;
  
    return view;
  }

  /**
   * Copy from the temporary block to a value block.
   *
   * <p>This is an I/O operation and will block until complete. It must
   * not be called from the main application thread. A blocked call will be canceled with
   * {@link IOException} if {@link #close} is called from another thread.
   *
   * <p class="note">Requires the {@link android.Manifest.permission#NFC} permission.
   *
   * @param blockIndex index of block to copy to
   * @throws TagLostException if the tag leaves the field
   * @throws IOException if there is an I/O failure, or the operation is canceled
   */
  transfer(blockIndex: number) {
      let cmd = new Uint8Array([0xB0, blockIndex]);

      this.transceive(cmd, false);
  }


  /**
   * Send raw NfcA data to a tag and receive the response.
   *
   * <p>This is equivalent to connecting to this tag via {@link NfcA}
   * and calling {@link NfcA#transceive}. Note that all MIFARE Classic
   * tags are based on {@link NfcA} technology.
   *
   * <p>Use {@link #getMaxTransceiveLength} to retrieve the maximum number of bytes
   * that can be sent with {@link #transceive}.
   *
   * <p>This is an I/O operation and will block until complete. It must
   * not be called from the main application thread. A blocked call will be canceled with
   * {@link IOException} if {@link #close} is called from another thread.
   *
   * <p class="note">Requires the {@link android.Manifest.permission#NFC} permission.
   *
   * @see NfcA#transceive
   */
  transceive(data: any, raw: boolean) {
    return this.mTech.transceive(data);
  }
}