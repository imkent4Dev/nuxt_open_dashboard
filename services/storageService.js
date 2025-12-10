// services/storageService.js
export class StorageService {
  constructor(storage = typeof window !== 'undefined' ? window.localStorage : null) {
    this.storage = storage
  }

  get(key) {
    if (!this.storage) return null
    return this.storage.getItem(key)
  }

  set(key, value) {
    if (!this.storage) return
    this.storage.setItem(key, value)
  }

  remove(key) {
    if (!this.storage) return
    this.storage.removeItem(key)
  }

  getJSON(key) {
    const value = this.get(key)
    if (!value) return null
    
    try {
      return JSON.parse(value)
    } catch (e) {
      console.error(`Failed to parse JSON for key ${key}:`, e)
      return null
    }
  }

  setJSON(key, value) {
    this.set(key, JSON.stringify(value))
  }

  clear() {
    if (!this.storage) return
    this.storage.clear()
  }
}