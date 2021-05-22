import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { Logs } from '../interfaces/logs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private key: string = 'smsLogs';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    console.log('Setting', value)
    this._storage?.set(key, value);
  }

  public async get(key: string) {
    return await this._storage?.get(key);
  }

  public setSMSLogs(value?: Logs) {
    console.info('pushing value', value)
    this._storage?.set(this.key, value);
  }

  public async getSmsLogs() {
    return await this._storage?.get(this.key);
  }
}