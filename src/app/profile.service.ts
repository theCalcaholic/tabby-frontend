import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { profileFromData, Profile, ProfileData } from '../../../tabby-common/models/profile';
import { TabData } from '../../../tabby-common/models/tab';
import { Style } from '../../../tabby-common/models/style';
import { styles } from '../../../tabby-common/styles/styles';

import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {AsyncSubject} from "rxjs/AsyncSubject";
import {Observer} from "rxjs/Observer";

@Injectable()
export class ProfileService {
  public profileSubject: Subject<ProfileData>;
  public musicSubject: Subject<string>;
  public styleUrlSubject: Subject<Style>;
  private RESTBaseUrl = environment.RESTURL;
  // private RESTBaseUrl = "/api/profiles";
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private profileCache: ProfileData;

  private styleCallbacks = new Array<Function>();
  private musicCallbacks = new Array<Function>();
  private styleUrlCallbacks = new Array<Function>();

  constructor( private http: HttpClient) {
    console.log('RESTURL: ' + this.RESTBaseUrl);
    this.profileSubject = new Subject<ProfileData>();
    this.musicSubject = new Subject<string>();
    this.styleUrlSubject = new Subject<Style>();
    this.profileSubject.subscribe({
      next: (profile) => {
        console.log('profile updated.');
        this.profileCache = profile;
        if ( profile) {
          this.musicSubject.next(profile.bgMusicUrl);
        }
      }
    });
    this.subscribeStyleToProfile();
    console.log(this.profileSubject.observers);
  }

  setProfileId(id: string): void {
    if ( typeof this.profileCache !== 'undefined' && this.profileCache.id === id) {
      return;
    }

    this.refreshProfile(id);
  }

  refreshProfile(id?: string): void {
    const url = `${this.RESTBaseUrl}/profiles/${id}`;
    this.http.get(url)
        .subscribe((response: HttpResponse<ProfileData>) => {
          this.profileSubject.next(response.body);
        }, this.handleError);
  }

  saveAll(profile: ProfileData): Promise<any> {
    console.log(`ProfileService.save(${profile.id})`);
    const promises: Promise<any>[] = new Array<Promise<any>>();
    profile.tabs.forEach((tab) => {
      promises.push(this.saveTab(tab, profile.id));
    });
    promises.push(this.saveProfile(profile));
    return Promise.all(promises);
  }

  newProfile(): void {
    const url = `${this.RESTBaseUrl}/profiles/new`;
    this.http.get(url)
      .subscribe((response: HttpResponse<ProfileData>) => {
        console.log(`received profile:`);
        console.log(response.body as ProfileData);
        console.log(this.profileSubject);
        this.profileSubject.next(response.body as ProfileData);
      }, this.handleError);
  }

  newTab(tab: TabData, profileId: string): Observable<TabData> {
    const url = `${this.RESTBaseUrl}/tabs/new`;
    console.log('raw data: {');
    console.log('  tab:');
    console.log(tab);
    console.log(`  profileId: ${profileId}`);
    console.log('}');
    console.log('data to transmit:');
    console.log(JSON.stringify({ 'tab': tab, 'profileId': profileId }));
    const subject = new AsyncSubject<TabData>();
    this.http.
      put(url, JSON.stringify({'tab': tab, 'profileId': profileId}), {headers: this.headers})
      .subscribe((response: HttpResponse<TabData>) => {
        subject.next(response.body);
      });
    return subject;
  }

  saveProfile(profile: ProfileData): Promise<Profile> {
    const url = `${this.RESTBaseUrl}/profiles/${profile.id}`;
    return this.http
      .put(url, JSON.stringify({ 'id': profile.id, 'title': profile.title }), {headers: this.headers})
      .toPromise()
      .then((response) => {
        return profile;
      })
      .catch(this.handleError);
  }

  saveTab(tab: TabData, profileId: string): Promise<any> {
    console.log(`saveTab(<TabData>, '${profileId}')`);
    if (typeof tab.id === 'undefined') {
      console.log('drop save request - no id defined.');
      return Promise.resolve();
    }
    const url = `${this.RESTBaseUrl}/tabs/${tab.id}`;
    return this.http.
      put(url, JSON.stringify({'tab': tab, 'profileId': profileId}), {headers: this.headers})
      .toPromise();
  }

  deleteTab(tabId: number, profileId: string): Observable<HttpResponse<TabData>> {
    console.log(`saveTab(<TabData>, '${profileId}')`);
    const url = `${this.RESTBaseUrl}/tabs/${tabId}`;
    return this.http.put(
        url,
        JSON.stringify({'tab': null, 'profileId': profileId}), {headers: this.headers}
        ) as Observable<HttpResponse<TabData>>;
  }

  setStyle(style?: Style) {
    console.log('ProfileService.updateStyle()');
    console.log('cache:');
    console.log(this.profileCache);
    if (typeof this.profileCache !== 'undefined') {
      console.log('save style to db...');
      const url = `${this.RESTBaseUrl}/profiles/${this.profileCache.id}/style`;

      const data = JSON.stringify({ 'styleId': style.id, 'styleParameters': style.parameters });
      console.log(data);
      this.http.put(url, data, {headers: this.headers}).subscribe(undefined, this.handleError);
    }
    this.styleUrlSubject.next(style);
  }

  setBgMusic(musicUrl: string) {
    console.log('ProfileService.updateBgMusic()');
    if ( typeof this.profileCache !== 'undefined' ) {
      console.log('save bg music url to db...');
      const url = `${this.RESTBaseUrl}/profiles/${this.profileCache.id}/background-music`;

      const data = JSON.stringify({ 'bgMusicUrl': musicUrl });
      this.http.put(url, data, {headers: this.headers})
          .subscribe(undefined, this.handleError);
    }
    this.musicSubject.next(musicUrl);
  }

  getStyleUrl() {
    if (this.profileCache) {
      return `${this.RESTBaseUrl}/profiles/${this.profileCache.id}/style`;
    }
    return '';
  }

  broadcastStyleUrl_deprec() {
    console.log('broadcastStyleUrl()');
    if (!this.profileCache) {
      return;
    }
    const styleUrl = `${this.RESTBaseUrl}/profiles/${this.profileCache.id}/style`;
    console.log('style url: ' + styleUrl);

    this.styleUrlCallbacks.forEach((cb) => {
      cb(styleUrl);
    });
  }

  private subscribeStyleToProfile() {
    this.profileSubject.subscribe({
      next: (profile: ProfileData) => {
        console.log("profile update (style observer)!");
        if (!profile) {
          return;
        }

        styles.forEach((StyleType) => {
          const style = new StyleType();
          if (style.id === profile.styleId) {
            style.loadParameters(this.profileCache.styleParameters);
            this.styleUrlSubject.next(style);
          }
        });
      }
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error, error.stack);
    return Promise.reject(error.message || error);
  }
}
