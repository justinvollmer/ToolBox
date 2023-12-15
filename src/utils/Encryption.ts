/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Encrypts the given text using the AES-GCM algorithm with the provided key.
 *
 * @param {string} text - The unencrypted text to be encrypted.
 * @param {CryptoKey} key - The 256-bit encryption key for encrypting the text.
 * @returns {Promise<string>} A Promise resolving to the hexadecimal string representing the encrypted text.
 * @throws {Error} If an error occurs during encryption.
 */
async function encrypt(text: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(16));

  try {
    // Encrypt the data using AES-GCM algorithm
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    // Concatenate IV and encrypted data, then convert to a hexadecimal string
    const encryptedText = Array.from(
      new Uint8Array([...iv, ...new Uint8Array(encryptedData)])
    )
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return encryptedText;
  } catch (err: any) {
    throw new Error(`Encryption error: ${err.message}`);
  }
}

/**
 * Decrypts the given encrypted text using the AES-GCM algorithm with the provided key.
 *
 * @param {string} encryptedText - The hexadecimal string representing the encrypted text.
 * @param {CryptoKey} key - The 256-bit encryption key for decrypting the text.
 * @returns {Promise<string>} A Promise resolving to the decrypted text.
 * @throws {Error} If the provided data is too small or if an error occurs during decryption.
 */
async function decrypt(encryptedText: string, key: CryptoKey): Promise<string> {
  // Convert the hexadecimal string to a Uint8Array
  const encryptedData = new Uint8Array(
    encryptedText.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  // Check if the data is large enough to contain the IV and encrypted content
  if (encryptedData.length < 32) {
    throw new Error(
      `Invalid encrypted data: Data is too small. Length: ${encryptedData.length}`
    );
  }

  try {
    // Extract IV and decrypt the data using AES-GCM algorithm
    const iv = encryptedData.slice(0, 16);
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData.slice(16)
    );

    // Convert the decrypted data to a string
    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedData);

    return decryptedText;
  } catch (err: any) {
    throw new Error(`Decryption error: ${err.message}`);
  }
}

/**
 * Converts a CryptoKey object to a hexadecimal string representation.
 *
 * @param {CryptoKey} key - The CryptoKey object to be exported.
 * @returns {Promise<string>} A Promise resolving to the hexadecimal string representing the key.
 * @throws {Error} If an error occurs during key export.
 */
async function exportKeyToString(key: CryptoKey): Promise<string> {
  try {
    const exportedKey = await crypto.subtle.exportKey("raw", key);
    const keyString = Array.from(new Uint8Array(exportedKey))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return keyString;
  } catch (err: any) {
    throw new Error(`Key export error: ${err.message}`);
  }
}

/**
 * Converts a hexadecimal string representation of a key into a CryptoKey object.
 *
 * @param {string} keyString - The hexadecimal string representing the key.
 * @returns {Promise<CryptoKey>} A Promise resolving to the CryptoKey object.
 * @throws {Error} If an error occurs during key conversion.
 */
async function importStringToKey(keyString: string): Promise<CryptoKey> {
  const keyData = new Uint8Array(
    keyString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
    return key;
  } catch (err: any) {
    throw new Error(`Key import error: ${err.message}`);
  }
}

async function generateCryptoKey(): Promise<CryptoKey> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  return key;
}

export {
  encrypt,
  decrypt,
  exportKeyToString,
  importStringToKey,
  generateCryptoKey,
};
