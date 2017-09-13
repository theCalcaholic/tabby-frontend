import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise';

import { profileFromData, Profile, ProfileData } from './profile';

@Injectable()
export class ProfileService {
  private RESTBaseUrl = "api/profiles";
  private headers = new Headers({'Content-Type': 'application/json'});
  private cache: { [id: string] : ProfileData } = {};

  constructor( private http: Http ) { }

  getProfile(id: string): Promise<Profile> {
    if(id in this.cache)
      return Promise.resolve(profileFromData(this.cache[id]));

    let url = `${this.RESTBaseUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let profileData = response.json().data as ProfileData;
        this.cache[profileData.id] = profileData;
        return profileFromData(profileData);
      })
      .catch(this.handleError);
  }

  save(profile: ProfileData): Promise<Profile> {
    const url = `${this.RESTBaseUrl}/${profile.id}`;
    return this.http
      .put(url, JSON.stringify(profile), {headers: this.headers})
      .toPromise()
      .then(() => profile)
      .catch(this.handleError);
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

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}