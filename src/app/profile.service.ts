import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise';

import { profileFromData, Profile, ProfileData } from '../../../tabby-common/models/profile';
import { TabData } from '../../../tabby-common/models/tab';
import { Style } from '../../../tabby-common/models/style';
import { styles } from '../../../tabby-common/styles/styles';

import { environment } from '../environments/environment';

@Injectable()
export class ProfileService {
  private RESTBaseUrl = environment.RESTURL;
  //private RESTBaseUrl = "/api/profiles";
  private headers = new Headers({'Content-Type': 'application/json'});
  private cache:Profile;
  private styleCallbacks = new Array<Function>();
  private musicCallbacks = new Array<Function>();
  private styleUrlCallbacks = new Array<Function>();

  constructor( private http: Http)
  {
    console.log("RESTURL: " + this.RESTBaseUrl);
  }

  getProfile(id: string): Promise<Profile> {
    if(typeof this.cache !== 'undefined')
      return Promise.resolve(profileFromData(this.cache));

    let url = `${this.RESTBaseUrl}/profiles/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log("received response:");
        console.log(response);
        let profileData = response.json().data as ProfileData;
        this.cache = profileFromData(profileData);
        this.updateStyle();
        this.updateBgMusic();
        this.broadcastStyleUrl();
        return this.cache;
      })
      .catch(this.handleError);
  }

  saveAll(profile: ProfileData): Promise<any> {
    console.log(`ProfileService.save(${profile.id})`);
    let promises:Promise<any>[] = new Array<Promise<any>>();
    profile.tabs.forEach((tab) => {
      promises.push(this.saveTab(tab, profile.id));
    });
    promises.push(this.saveProfile(profile));
    return Promise.all(promises);
  }

  newProfile(): Promise<Profile> {
    let url = `${this.RESTBaseUrl}/profiles/new`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log("received response:");
        console.log(response);
        let profileData = response.json().data as ProfileData;
        this.cache = profileFromData(profileData);
        this.updateStyle();
        return this.cache;
      })
      .catch(this.handleError);
  }

  newTab(tab:TabData, profileId:string): Promise<TabData> {
    let url = `${this.RESTBaseUrl}/tabs/new`;
    console.log("raw data: {")
    console.log("  tab:");
    console.log(tab);
    console.log(`  profileId: ${profileId}`);
    console.log("}");
    console.log("data to transmit:");
    console.log(JSON.stringify({ "tab": tab, "profileId": profileId }));
    return this.http.
      put(url, JSON.stringify({"tab": tab, "profileId": profileId}), {headers: this.headers})
      .toPromise()
      .then((response) => {
        return response.json().data as TabData
      });
  }

  saveProfile(profile: ProfileData): Promise<Profile> {
    let cache = this.cache;
    const url = `${this.RESTBaseUrl}/profiles/${profile.id}`;
    return this.http
      .put(url, JSON.stringify({ "id": profile.id, "title": profile.title }), {headers: this.headers})
      .toPromise()
      .then((response) => {
        if( profile.id in cache)
          delete cache[profile.id];
        return profile;
      })
      .catch(this.handleError);
  }

  saveTab(tab:TabData, profileId:string): Promise<any> {
    console.log(`saveTab(<TabData>, '${profileId}')`);
    if(typeof tab.id === 'undefined'){
      console.log("drop save request - no id defined.");
      return new Promise((res, rej) => {res();});
    }
    let url = `${this.RESTBaseUrl}/tabs/${tab.id}`
    return this.http.
      put(url, JSON.stringify({"tab": tab, "profileId": profileId}), {headers: this.headers})
      .toPromise();
  }

  updateStyle(style?:Style) {
    console.log("ProfileService.updateStyle()");
    console.log("cache:");
    console.log(this.cache);
    if(typeof style === 'undefined') {
      console.log('style parameter is not defined - load style from profile.')
      console.log(this.cache);
      if(typeof this.cache === 'undefined') {
        return;
      } else {
        styles.forEach((StyleType) => {
          let tmpStyle = new StyleType();
          if(tmpStyle.id === this.cache.styleId) {
            tmpStyle.loadParameters(this.cache.styleParameters);
            style = tmpStyle;
          }
        });
      }
    } else if(typeof this.cache !== 'undefined') {
      console.log("save style to db...");
      const url = `${this.RESTBaseUrl}/profiles/${this.cache.id}/style`;

      let data = JSON.stringify({ "styleId": style.id, "styleParameters": style.parameters });
      console.log(data);
      this.http.put(url, data, {headers: this.headers})
      .toPromise().catch((error) => {
      console.error(error.stack);
      });
    }
    if(style) {
      this.styleCallbacks.forEach((callback) => {
        callback(style);
      })
    }
  }

  updateBgMusic(musicUrl?:string) {
    console.log("ProfileService.updateBgMusic()");
    if(typeof musicUrl === 'undefined') {
      console.log("url parameter is not defined - load bg music url from profile.")
      if(typeof this.cache === 'undefined') {
        return;
      } else {
        musicUrl = this.cache.bgMusicUrl;
      }
    } else if( typeof this.cache !== 'undefined' ){
      console.log("save bg music url to db...");
      const url = `${this.RESTBaseUrl}/profiles/${this.cache.id}/background-music`;

      let data = JSON.stringify({ "bgMusicUrl": musicUrl });
      this.http.put(url, data, {headers: this.headers})
        .toPromise().catch((error) => {
          this.handleError(error);
        });
    }
    if(musicUrl) {
      this.musicCallbacks.forEach((callback) => {
        callback(musicUrl);
      })
    }
  }

  OnStyleUpdate(callback:Function) {
    this.styleCallbacks.push(callback)
  }

  OnMusicUpdate(callback:Function) {
    this.musicCallbacks.push(callback);
  }

  OnStyleUrlUpdate(callback:Function) {
    this.styleUrlCallbacks.push(callback);
  }

  getStyleUrl() {
    if(this.cache) {
      return `${this.RESTBaseUrl}/profiles/${this.cache.id}/style`;
    }
    return "";
  }

  broadcastStyleUrl() {
    console.log("broadcastStyleUrl()");
    if(!this.cache) return;
    let styleUrl = `${this.RESTBaseUrl}/profiles/${this.cache.id}/style`;
    console.log("style url: " + styleUrl);

    this.styleUrlCallbacks.forEach((cb) => {
      cb(styleUrl);
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error, error.stack);
    return Promise.reject(error.message || error);
  }
}
