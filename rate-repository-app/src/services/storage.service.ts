import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native"

class StorageService {
  platform = Platform.select({android: 'android',ios: 'ios',default: 'default',})
  storage =  this.platform === 'default' ? localStorage: AsyncStorage
  async getItem(key: string) {
    return await this.storage.getItem(key)
  }
  async setItem(key: string, val: string) {
    return await this.storage.setItem(key, val)
  }
  async removeItem(key: string) {
    return await this.storage.removeItem(key)
  }
}

class AuthStorage extends StorageService {
  accessTokenKey = 'accessToken'

  constructor(public namespace = 'auth'){
    super()
  }
  buildKey = (key: string)=> `${this.namespace}:${key}`
  async getAccessToken() {
    return await super.getItem(this.buildKey(this.accessTokenKey))
  }
  async setAccessToken( val: string) {
    return await super.setItem(this.buildKey(this.accessTokenKey), val)
  }
  async removeAccessToken() {
    return await super.removeItem(this.buildKey(this.accessTokenKey))
  }
}
export const authStorage = new AuthStorage()

