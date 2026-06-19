
'use client';

/**
 * Utility for End-to-End Encryption (E2EE) using Web Crypto API.
 * Optimized for SSR safety and maximum compatibility.
 */

const isBrowser = typeof window !== 'undefined' && typeof window.crypto !== 'undefined';

// Helper to convert ArrayBuffer to Base64 string in browser
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  if (!isBrowser) return '';
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper to convert Base64 string to ArrayBuffer in browser
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  if (!isBrowser) return new ArrayBuffer(0);
  try {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (e) {
    return new ArrayBuffer(0);
  }
}

export async function generateKeyPair() {
  if (!isBrowser) return { publicKey: '', privateKey: '' };
  
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
    publicKey: arrayBufferToBase64(publicKey),
    privateKey: arrayBufferToBase64(privateKey)
  };
}

export async function encryptText(text: string, publicKeyBase64: string) {
  if (!isBrowser || !publicKeyBase64) return null;
  
  try {
    const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64);
    if (publicKeyBuffer.byteLength === 0) return null;

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

    return arrayBufferToBase64(encrypted);
  } catch (e) {
    console.error("Encryption failed", e);
    return null;
  }
}

export async function decryptText(encryptedBase64: string, privateKeyBase64: string) {
  if (!isBrowser || !encryptedBase64 || !privateKeyBase64) return "[Encrypted Message]";
  
  try {
    const privateKeyBuffer = base64ToArrayBuffer(privateKeyBase64);
    if (privateKeyBuffer.byteLength === 0) return "[Encrypted Message]";

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

    const encryptedBuffer = base64ToArrayBuffer(encryptedBase64);
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
