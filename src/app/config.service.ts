import { Injectable } from '@angular/core';
import { Configuration } from './configuration';
import { config as devConfig } from './config/dev.config';
import { config as prodConfig } from './config/prod.config';

@Injectable()
export class ConfigService {

  private config = config;

  get(id:string) {
    if(id in config) {
      return config[id];
    }
    return undefined;
  }
}


// Define which config to load
let config = devConfig;
