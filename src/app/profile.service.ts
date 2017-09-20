import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise';

import { ConfigService } from './config.service';
import { profileFromData, Profile, ProfileData } from 'tabby-common/profile';
import { TabData } from 'tabby-common/tab';

@Injectable()
export class ProfileService {
  private RESTBaseUrl:string;
  //private RESTBaseUrl = "/api/profiles";
  private headers = new Headers({'Content-Type': 'application/json'});
  private cache: { [id: string] : ProfileData } = {};

  constructor( private http: Http, private config:ConfigService )
  {
    this.RESTBaseUrl = config.get("RESTURL");
  }

  getProfile(id: string): Promise<Profile> {
    if(id in this.cache)
      return Promise.resolve(profileFromData(this.cache[id]));

    let url = `${this.RESTBaseUrl}/profiles/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log("received response:");
        console.log(response);
        let profileData = response.json().data as ProfileData;
        //this.cache[profileData.id] = profileData;
        return profileFromData(profileData);
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
        //this.cache[profileData.id] = profileData;
        return profileFromData(profileData);
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
    let url = `${this.RESTBaseUrl}/tabs/${tab.id}`
    return this.http.
      put(url, JSON.stringify({"tab": tab, "profileId": profileId}), {headers: this.headers})
      .toPromise();
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
