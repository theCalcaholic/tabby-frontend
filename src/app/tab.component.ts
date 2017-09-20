import { OnInit, SimpleChanges, Input, Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { ProfileService } from './profile.service';
import { Tab, TabData, tabFromData } from 'tabby-common/tab';
import { Profile } from 'tabby-common/profile';

@Component({
  selector: 'tabs',
  templateUrl: 'tab.component.html',
  styles: [`.active {
          color: red;
      }`]

})
export class TabComponent  implements OnInit {
    @Input() renderPreview: Function;
    activeTab: Tab;
    profile: Profile;
    tabs: Tab[];
    private tabComponent: this;

    constructor(
      private profileService: ProfileService,
      private route: ActivatedRoute,
      private location: Location
    ) {
      this.profileService = profileService;
    }

    add(tab: Tab): void {
        this.profile.tabs.push(tab);
        this.activate(this.profile.tabs[this.profile.tabs.length - 1]);
        this.export();
    }

    activate(tab: Tab): void {
      if(this.activeTab === tab)
      {
        let resp = prompt(
          "Gebe einen neuen Titel f&uuml;r den Tab ein:",
          tab.title);
        if( resp !== null )
        {
          tab.title = resp;
        }
      }
      else {
        this.activeTab = tab;
      }
      this.export();
    }

    addNewTab(): void {
      let me = this;
      let tabdata:TabData = {title:"Tab" + (me.profile.tabs.length + 1), content:'', id:undefined};
      this.profileService.newTab(tabdata, this.profile.id)
        .then((newTabData:TabData) => {
          console.log("new tab has been created");
          let newTab = tabFromData(newTabData);
          newTab.OnChange = me.tabUpdated.bind(me, newTab, this.profile.id);
          me.add(newTab);
        });
    }

    export(): void {
      console.log(this.profile);
      let profileSrc = "<div id='noeditmode'>"
                     + "\n<div class='contentcontainer'>";
      this.profile.tabs.forEach((tab: Tab, i: number, allTabs: Tab[]) => {
        profileSrc += "\n<label class='tabtitle' for='tab" + i + "'>"
                    + tab.title + "</label>";
      });
      this.profile.tabs.forEach((tab: Tab, i: number, allTabs: Tab[]) => {
        profileSrc += "\n<input type='radio' id='tab" + i + "' class='tab'"
                    + (tab == this.activeTab ? " checked='checked'" : "")
                    + " name='tabs'>";
        profileSrc += "\n<div class='tabcontent'>";
        profileSrc += "\n" + tab.content;
        profileSrc += "\n</div>";
      });
      profileSrc += "\n</div>\n</div>";
      profileSrc += "\n<style type='text/css'>"
                  + "\n" + profileCss
                  + "\n</style>";
      this.renderPreview(profileSrc);
    }

    registerTabs(): void {
      console.log("registering tabs");
      if( !this.profile ) return;
      console.log("iterating...");
      let me = this;
      this.profile.tabs.forEach((tab: Tab) => {
        tab.OnChange = me.tabUpdated.bind(me, tab, this.profile.id);
      }, this);
      if(this.profile.tabs.length > 0)
        this.activate(this.profile.tabs[0]);
      this.export();
      /*this.profile.tabs.forEach((tab: Tab) => {
        this.add(new Tab(tab.title, this.export.bind(this)));
      }, this);*/
    }

    profileUpdated(): void {
      this.profileService.saveProfile(this.profile.toData());
    }

    tabUpdated(tab:Tab): void {
      console.log("tabUpdated(<Tab>)");
      this.profileService.saveTab(tab.toData(), this.profile.id);
      this.export();
    }

    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.profileService.getProfile(params.get('id')))
        .subscribe((profile => {
          this.profile = profile;
          this.registerTabs();
        }));
    }

}

const profileCss = `\
body {
  background-image: url(https://www.bienenfisch-design.com/wp-content/uploads/wpsg_produktbilder/6410/tn/s-800-600-feine-pergament-textur-003.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}
.tab {
  visibility: hidden;
  appearance: none;
  border-color: red;
  border-width: 1px;
  border-style: solid;
}
.tab + div {
  display: none;
}
.tab:checked + div {
  display: block;
}
.tabcontent p, .tabtitle, .tabcontent li {
  font-family: Calibri, Arial, sans-serif;
  color: #880F0F;
  font-size: medium;
}
.tabcontent a {
  color: #FF2222;
}
.tabcontent ul {
  list-style: none;
  padding-left: 0;
}
.tabcontent li {
  margin-bottom: 1em;
}
.tabcontent img {
  max-width: 300px;
  margin: 10px;
  border-style: solid;
  border-width: 2px;
  border-color: #440808;
}
.tabtitle {
  margin: 5px 10px;
  padding: 5px;
  font-size: 1.1em;
  line-height: 2em;
  background-color: #880F0F;
  color: white;/*#440808;*/
  cursor: pointer;
  /*font-weight: bold;*/
  border-radius: 5px;
}
.tabtitle:hover {
  background-color: #EEEEEE;
  color: #880F0F;
}
/*.profilepic {
  border-width: 2px;
  border-style: solid;
  margin: 20px 30px;
  width: 250px;
  height: 273px;
  border-radius: 15em;
  float: right;
}*/
.contentcontainer {
  padding: 10px;
  min-height: 80%;
}
#editmode .tab + div {
  display: block;
}`;
