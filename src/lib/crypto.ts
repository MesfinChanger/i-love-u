'use client';

/**
 * @fileOverview Modern End-to-End Encryption (E2EE) using ECDH and AES-GCM.
 * Optimized for high-performance key agreement and authenticated encryption.
 */

export async function generateKeyPair() {
  return await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}

export async function exportPublicKey(publicKey: CryptoKey) {
  const exported = await window.crypto.subtle.exportKey("raw", publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

export async function exportPrivateKey(privateKey: CryptoKey) {
  const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

export async function importPublicKey(key: string) {
  const binary = Uint8Array.from(atob(key), c => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    "raw",
    binary,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
}

export async function importPrivateKey(key: string) {
  const binary = Uint8Array.from(atob(key), c => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    "pkcs8",
    binary,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}

export async function createSharedKey(privateKey: CryptoKey, publicKey: CryptoKey) {
  return await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: publicKey
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(key: CryptoKey, text: string) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    new TextEncoder().encode(text)
  );

  return {
    cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv))
  };
}

export async function decryptMessage(key: CryptoKey, cipherText: string, iv: string) {
  const encrypted = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
  const ivArray = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivArray
    },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}
