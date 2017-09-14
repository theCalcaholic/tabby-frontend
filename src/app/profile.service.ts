import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise';

import { profileFromData, Profile, ProfileData } from 'tabby-common/profile';

@Injectable()
export class ProfileService {
  private RESTBaseUrl = "http://localhost:3000/profiles";
  //private RESTBaseUrl = "/api/profiles";
  private headers = new Headers({'Content-Type': 'application/json'});
  private cache: { [id: string] : ProfileData } = {};
  private saveRequest: Promise<Profile> = Promise.resolve(null);

  constructor( private http: Http ) { }

  getProfile(id: string): Promise<Profile> {
    if(id in this.cache)
      return Promise.resolve(profileFromData(this.cache[id]));

    let url = `${this.RESTBaseUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        console.log("received response:");
        console.log(response);
        let profileData = response.json().data as ProfileData;
        this.cache[profileData.id] = profileData;
        return profileFromData(profileData);
      })
      .catch(this.handleError);
  }

  save(profile: ProfileData): Promise<Profile> {
    console.log(`ProfileService.save(${profile.id})`);
    return this.saveRequest.then((v) => this.updateProfile(profile));
  }

  new(): Promise<Profile> {
    let url = `${this.RESTBaseUrl}/new`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let profileData = response.json().data as ProfileData;
        this.cache[profileData.id] = profileData;
        return profileFromData(profileData);
      })
      .catch(this.handleError);
  }

  private updateProfile(profile: ProfileData): Promise<Profile> {
    let cache = this.cache;
    const url = `${this.RESTBaseUrl}/${profile.id}`;
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

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
