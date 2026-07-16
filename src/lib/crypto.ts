'use client';

/**
 * @fileOverview Modern End-to-End Encryption (E2EE) using ECDH and AES-GCM.
 * Optimized for performance and secure key agreement in messaging.
 */

const isBrowser = typeof window !== 'undefined' && typeof window.crypto !== 'undefined';

export async function generateKeyPair() {
  if (!isBrowser) return null;
  return await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
}

export async function exportKey(key: CryptoKey, format: "raw" | "pkcs8" | "spki" = "raw") {
  if (!isBrowser) return '';
  const exported = await window.crypto.subtle.exportKey(format, key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

export async function importPublicKey(keyStr: string) {
  if (!isBrowser || !keyStr) return null;
  try {
    const binary = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0));
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
  } catch (e) {
    console.error("Public key import failed", e);
    return null;
  }
}

export async function importPrivateKey(keyStr: string) {
  if (!isBrowser || !keyStr) return null;
  try {
    const binary = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0));
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
  } catch (e) {
    console.error("Private key import failed", e);
    return null;
  }
}

export async function createSharedKey(privateKey: CryptoKey, publicKey: CryptoKey) {
  if (!isBrowser) return null;
  try {
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
  } catch (e) {
    console.error("Shared key derivation failed", e);
    return null;
  }
}

export async function encryptMessage(key: CryptoKey, text: string) {
  if (!isBrowser) return null;
  try {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      key,
      new TextEncoder().encode(text)
    );

    return {
      cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv))
    };
  } catch (e) {
    console.error("Encryption failed", e);
    return null;
  }
}

export async function decryptMessage(key: CryptoKey, cipherText: string, iv: string) {
  if (!isBrowser || !cipherText || !iv) return "[Decryption Ripple]";
  try {
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
  } catch (e) {
    console.warn("Decryption failed", e);
    return "[Encrypted Message]";
  }
}
