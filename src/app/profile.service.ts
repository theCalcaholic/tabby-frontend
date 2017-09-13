import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise';

import { profileFromData, Profile, ProfileData } from './profile';

@Injectable()
export class ProfileService {
  private RESTBaseUrl = "api/profiles/";

  constructor( private http: Http ) { }

  getProfile(id: string): Promise<Profile> {
    return this.http.get(this.RESTBaseUrl + id)
      .toPromise()
      .then(response => {console.log(response); return profileFromData(response.json().data as ProfileData)})
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
