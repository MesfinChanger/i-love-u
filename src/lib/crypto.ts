
'use client';

/**
 * Utility for End-to-End Encryption (E2EE) using Web Crypto API.
 */

export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: Buffer.from(publicKey).toString('base64'),
    privateKey: Buffer.from(privateKey).toString('base64')
  };
}

export async function encryptText(text: string, publicKeyBase64: string) {
  try {
    const publicKeyBuffer = Buffer.from(publicKeyBase64, 'base64');
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );

    const encoded = new TextEncoder().encode(text);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      encoded
    );

    return Buffer.from(encrypted).toString('base64');
  } catch (e) {
    console.error("Encryption failed", e);
    return null;
  }
}

export async function decryptText(encryptedBase64: string, privateKeyBase64: string) {
  try {
    const privateKeyBuffer = Buffer.from(privateKeyBase64, 'base64');
    const privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["decrypt"]
    );

    const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedBuffer
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error("Decryption failed", e);
    return "[Encrypted Message]";
  }
}
