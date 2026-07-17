'use client';

/**
 * @fileOverview Encryption Utility Protocol.
 * Implements high-fidelity AES-GCM encryption for message securing.
 * Synchronized with the platform's E2EE mission.
 */

/**
 * Encrypt Message Protocol.
 * Imports a raw string key and encrypts text using AES-GCM.
 */
export async function encryptMessage(text: string, key: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    data
  );

  return {
    cipherText: Array.from(new Uint8Array(encrypted)),
    iv: Array.from(iv)
  };
}

// ==========================================
// E2EE Key Agreement Protocol (ECDH-P256)
// ==========================================

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

export async function encryptText(text: string, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    new TextEncoder().encode(text)
  );

  return {
    cipherText: btoa(
      String.fromCharCode(...new Uint8Array(encrypted))
    ),
    iv: btoa(
      String.fromCharCode(...iv)
    )
  };
}

export async function decryptText(cipherText: string, iv: string, key: CryptoKey) {
  const encrypted = Uint8Array.from(
    atob(cipherText),
    c => c.charCodeAt(0)
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: Uint8Array.from(
        atob(iv),
        c => c.charCodeAt(0)
      )
    },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}
