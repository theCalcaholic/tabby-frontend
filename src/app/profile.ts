import { Tab, TabData, tabFromData } from './tab';

export class ProfileData {
  id: string;
  tabs: TabData[]
}

export class Profile {
  id: string;
  tabs: Tab[];

  toData(): ProfileData {
    let data = new ProfileData();
    data.id = this.id;
    data.tabs = this.tabs.map((tab) => tab.toData());
    return data;
  }
}

export function profileFromData(data: ProfileData): Profile {
    let profile = new Profile();
    profile.id = data.id;
    profile.tabs = new Array<Tab>();
    data.tabs.forEach((tab) => {
      profile.tabs.push(tabFromData(tab));
    });
    return profile;
}
