import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise';

import { profileFromData, Profile, ProfileData } from 'tabby-common/profile';
import { TabData } from 'tabby-common/tab';

@Injectable()
export class ProfileService {
  private RESTBaseUrl = "http://localhost:3000";
  //private RESTBaseUrl = "/api/profiles";
  private headers = new Headers({'Content-Type': 'application/json'});
  private cache: { [id: string] : ProfileData } = {};
  private saveRequest: Promise<Profile> = Promise.resolve(null);

  constructor( private http: Http ) { }

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

  save(profile: ProfileData): Promise<Profile> {
    console.log(`ProfileService.save(${profile.id})`);
    return this.saveRequest.then((v) => this.updateProfile(profile));
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

  private updateProfile(profile: ProfileData): Promise<Profile> {
    let cache = this.cache;
    const url = `${this.RESTBaseUrl}/profiles/${profile.id}`;
    return this.http
      .put(url, JSON.stringify(profile), {headers: this.headers})
      .toPromise()
      .then((response) => {
        if( profile.id in cache)
          delete cache[profile.id];
        return profile;
      })
      .catch(this.handleError);
  }

  saveTab(tab:TabData, profileId:string): Promise<any> {
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
