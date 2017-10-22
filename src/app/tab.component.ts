import { OnInit, SimpleChanges, Input, Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { ProfileService } from './profile.service';
import { Tab, TabData, tabFromData } from '../../../tabby-common/models/tab';
import { Profile } from '../../../tabby-common/models/profile';
import { Style } from '../../../tabby-common/models/style';
import { styles } from '../../../tabby-common/styles/styles';

@Component({
  selector: 'tabs',
  templateUrl: 'tab.component.html',
  styleUrls: ['./tab.component.css']

})
export class TabComponent  implements OnInit {
    @Input() renderPreview: Function;
    activeTab: Tab;
    profile: Profile;
    style: Style;
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
      let newTab = tabFromData(tabdata);
      newTab.OnChange = me.tabUpdated.bind(me, newTab, this.profile.id);
      me.add(newTab);
      this.profileService.newTab(tabdata, this.profile.id)
        .then((newTabData:TabData) => {
          console.log(`new tab has been created. Update id (${newTabData.id})...`);
          newTab.id = newTabData.id;
          console.log(newTab);
          this.tabUpdated(newTab);
        });
    }

    embedBgMusic(): string {
      let musicUrl = this.profile.bgMusicUrl;
      if(!musicUrl)
        return "";

      let ytWatchPattern = /https?\:\/\/(?:www.)?youtube.com\/watch\?v\=([a-zA-Y0-9]*).*/
      let ytEmbedPattern = /https?\:\/\/(?:www.)?youtube.com\/embed\/[a-zA-Y0-9]*.*/
      let match;
      if(match = ytWatchPattern.exec(musicUrl)) {
        return "<iframe width='0' height='0' "
          + "src='https://www.youtube.com/embed/" + match[1] + "?autoplay=1&loop=1' "
          + "frameborder='0' wmode='transparent' "
          + "allowfullscreen='0'></iframe>";
      } else if( match = ytEmbedPattern.exec(musicUrl) ) {
        return "<iframe width='0' height='0' "
          + "src='" + match[0] + "' "
          + "frameborder='0' wmode='transparent' "
          + "allowfullscreen='0'></iframe>";
      }

      return "";
    }

    export(): void {
      if(typeof this.profile === 'undefined' || typeof this.style === 'undefined') return;
      let profileSrc = this.embedBgMusic();
      profileSrc += "<div id='noeditmode'>"
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
                  + "\n" + this.style.exportString()
                  + "\n</style>";
      //console.log("profile src:");
      //console.log(profileSrc);
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

    loadStyle(style:Style) {
      console.log("loading style: " + style.id);
      this.style = style;
      this.export();
    }

    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.profileService.getProfile(params.get('id')))
        .subscribe((profile => {
          this.profile = profile;
          this.registerTabs();
        }));
      this.profileService.OnStyleUpdate(this.loadStyle.bind(this));
    }

}
