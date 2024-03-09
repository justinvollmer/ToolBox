/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Encrypts the given text using the AES-GCM algorithm with the provided key.
 *
 * @author Justin Vollmer
 * @justinvollmer
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

    // Concatenate IV and encrypted data
    const combinedData = new Uint8Array([
      ...iv,
      ...new Uint8Array(encryptedData),
    ]);

    // Convert to Base64 instead of hexadecimal
    const encryptedText = btoa(
      String.fromCharCode.apply(null, combinedData as any)
    );
    return encryptedText;
  } catch (err: any) {
    throw new Error(`Encryption error: ${err.message}`);
  }
}

/**
 * Decrypts a given Base64-encoded encrypted text using the AES-GCM algorithm and a provided key.
 * This function automatically extracts the IV from the beginning of the encrypted data (as the IV is stored in the first 16 bytes).
 * It then decrypts the remainder of the input using the provided key and returns the plaintext.
 *
 * @author Justin Vollmer
 * @justinvollmer
 *
 * @param {string} encryptedText - The Base64-encoded encrypted text to be decrypted.
 * @param {CryptoKey} key - The 256-bit decryption key.
 * @returns {Promise<string>} A Promise that resolves to the decrypted plaintext.
 * @throws {Error} Throws an error if decryption fails, including if the data is too small to contain both the IV and encrypted content.
 */
async function decrypt(encryptedText: string, key: CryptoKey): Promise<string> {
  // Convert Base64 encoded string to a Uint8Array
  const binaryString = atob(encryptedText);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Check if the data is large enough to contain the IV and encrypted content
  if (bytes.length < 32) {
    throw new Error(
      `Invalid encrypted data: Data is too small. Length: ${bytes.length}`
    );
  }

  try {
    // Extract IV and decrypt the data using AES-GCM algorithm
    const iv = bytes.slice(0, 16);
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      bytes.slice(16)
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
 * Exports a CryptoKey object to a hexadecimal string representation. This function is useful for storing or transmitting encryption keys in a human-readable format.
 *
 * @author Justin Vollmer
 * @justinvollmer
 *
 * @param {CryptoKey} key - The CryptoKey object to be exported.
 * @returns {Promise<string>} A Promise that resolves to the hexadecimal string representation of the key.
 * @throws {Error} Throws an error if key export fails.
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
 * Imports a cryptographic key from its hexadecimal string representation into a CryptoKey object.
 * This is useful for reconstructing a key from a stored or transmitted string format.
 *
 * @author Justin Vollmer
 * @justinvollmer
 *
 * @param {string} keyString - The hexadecimal string representing the key.
 * @returns {Promise<CryptoKey>} A Promise that resolves to the corresponding CryptoKey object.
 * @throws {Error} Throws an error if key import fails.
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

/**
 * Generates a new 256-bit cryptographic key suitable for use with the AES-GCM encryption algorithm.
 * This function can be used to create secure keys for encrypting new data.
 *
 * @returns {Promise<CryptoKey>} A Promise that resolves to a new CryptoKey object.
 */
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
