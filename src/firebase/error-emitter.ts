/**
 * @fileOverview A lightweight event emitter for Firestore permission errors.
 * Replaces the Node.js 'events' module to ensure compatibility with browser builds.
 */

type Handler = (...args: any[]) => void;

class SimpleEmitter {
  private listeners: Record<string, Handler[]> = {};

  on(event: string, handler: Handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  off(event: string, handler: Handler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(handler => {
      try {
        handler(...args);
      } catch (e) {
        console.error('Error in event handler:', e);
      }
    });
  }
}

export const errorEmitter = new SimpleEmitter();
