import { OnInit, Input, Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ProfileService } from './profile.service';
import { Tab, TabData, tabFromData } from '../../../tabby-common/models/tab';
import {Profile, profileFromData} from '../../../tabby-common/models/profile';
import { Style } from '../../../tabby-common/models/style';
import { HtmlTemplateContainer } from './html.template.container';

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

    constructor(
      private profileService: ProfileService,
      private route: ActivatedRoute,
    ) { }

    add(tab: Tab): void {
        this.profile.tabs.push(tab);
        this.activate(this.profile.tabs[this.profile.tabs.length - 1]);
        this.export();
    }

    delete(tab: Tab): boolean {
      let tabId = -1;
      for (let i = 0; i < this.profile.tabs.length; i++ ) {
        if ( tab === this.profile.tabs[i] ) {
          const confirmed = confirm(`Do you really want to delete tab ${i + 1} ('${tab.title}')?`);
          if (!confirmed) {
            return false;
          }
          tabId = this.profile.tabs[i].id;
          this.profile.tabs.splice(i, 1);
        }
      }
      if (tabId !== -1) {
        this.profileService.deleteTab(tabId, this.profile.id);
        this.export();
      }
      return false;
    }

    activate(tab: Tab): void {
      if (this.activeTab === tab) {
        const resp = prompt(
          'Gebe einen neuen Titel f&uuml;r den Tab ein:',
          tab.title);
        if ( resp !== null ) {
          tab.title = resp;
        }
      } else {
        this.activeTab = tab;
      }
      this.export();
    }

    addNewTab(): void {
      const me = this;
      const tabdata: TabData = {title: 'Tab' + (me.profile.tabs.length + 1), content: '', id: undefined};
      const newTab = tabFromData(tabdata);
      newTab.OnChange = me.tabUpdated.bind(me, newTab, this.profile.id);
      me.add(newTab);
      this.profileService.newTab(tabdata, this.profile.id)
          .subscribe({
            next: (tab: TabData) => {
              console.log(`new tab has been created. Update id (${tab.id})...`);
              newTab.id = tab.id;
              this.tabUpdated(newTab);
              console.log(newTab);
            }
          });
    }

    embedBgMusic(): string {
      let musicUrl = this.profile.bgMusicUrl;
      if (!musicUrl) {
        return '';
      }

      const ytEmbedCode = '<iframe width="0" height="0" '
        + 'src="\${url}" '
        + 'frameborder="0" wmode="transparent" '
        + 'allowfullscreen="0"></iframe>';
      const mp3EmbedCode = `
      <audio autoplay='1' loop>
          <source src='\${url}' type='audio/mp3'>
      </audio>`;

      const mp3Pattern = /^https?\:\/\/(?:www\.)?.*\.mp3(?:\?.*)?$/;
      const ytWatchPattern = /https?\:\/\/(?:www\.)?youtube.com\/watch\?v\=([a-zA-Z0-9_-]*).*/;
      const ytEmbedPattern1 = /https?\:\/\/(?:www\.)?youtube.com\/embed\/([a-zA-Z0-9_-]*).*/;
      let videoId;
      let match;
      if ( match = mp3Pattern.exec(musicUrl)) {
        return mp3EmbedCode.replace('${url}', musicUrl);
      } else if (match = ytWatchPattern.exec(musicUrl)) {
        videoId = match[1];
      } else if ( match = ytEmbedPattern1.exec(musicUrl) ) {
        videoId = match[1];
        if (!musicUrl.search('playlist=')) {
          musicUrl += `${musicUrl.search('?') ? '&' : '?'}`
            + `&playlist=${videoId}`;
        }
        return ytEmbedCode.replace('${url}', musicUrl);
      }

      if ( videoId ) {
        return ytEmbedCode.replace(
          '${url}',
          `https://www.youtube.com/embed/${videoId}?playlist=${videoId}&autoplay=1&loop=1`
        );
      }

      return '';
    }

    export(): void {
      if (typeof this.profile === 'undefined' || typeof this.style === 'undefined') {
        return;
      }
      let profileSrc = this.embedBgMusic();
      switch (this.style.htmlTemplate) {
        case 0:
          profileSrc += this.exportTemplate1();
          break;
        case 1:
          profileSrc += this.exportTemplate2();
          break;
        default:
          profileSrc += this.exportTemplate1();
          break;
      }
      profileSrc += '\n<style type="text/css">'
                  + '\n' + this.style.exportString()
                  + '\n</style>';
      this.renderPreview(profileSrc);

    }

    exportTemplate1(): string {
      let profileSrc = '<div class="contentcontainer">';
      this.profile.tabs.forEach((tab: Tab, i: number, allTabs: Tab[]) => {
        profileSrc += '\n<label class="tabtitle" for="tab' + i + '">'
                    + tab.title + '</label>';
      });
      this.profile.tabs.forEach((tab: Tab, i: number, allTabs: Tab[]) => {
        profileSrc += '\n<input type="radio" id="tab' + i + '" class="tab"'
                    + (tab === this.activeTab ? ' checked="checked"' : '')
                    + ' name="tabs">';
        profileSrc += '\n<div class="tabcontent">';
        profileSrc += '\n' + tab.content;
        profileSrc += '\n</div>';
      });
      profileSrc += '\n</div>';
      return profileSrc;
    }

    exportTemplate2(): string {
      const template = new HtmlTemplateContainer().template2;
      let profileSrc = template.parts[0];
      this.profile.tabs.forEach((tab: Tab, i: number, allTabs: Tab[]) => {
        profileSrc += template.tablink_template
          .replace(new RegExp('\\$\\{id\\}', 'g'), 'tab' + i)
          .replace(new RegExp('\\$\\{title\\}', 'g'), tab.title);
      });
      profileSrc += template.parts[1];
      this.profile.tabs.forEach((tab: Tab, i: number, allTabs: Tab[]) => {
        profileSrc += template.tab_template
          .replace(new RegExp('\\$\\{id\\}', 'g'), 'tab' + i)
          .replace(new RegExp('\\$\\{content\\}', 'g'), tab.content);
      });
      profileSrc += template.parts[2];
      return profileSrc;
    }

    registerTabs(): void {
      console.log('registering tabs');
      if ( !this.profile ) {
        return;
      }
      console.log('iterating...');
      const me = this;
      this.profile.tabs.forEach((tab: Tab) => {
        tab.OnChange = me.tabUpdated.bind(me, tab);
      }, this);
      if (this.profile.tabs.length > 0) {
        this.activate(this.profile.tabs[0]);
      }
      this.export();
      /*this.profile.tabs.forEach((tab: Tab) => {
        this.add(new Tab(tab.title, this.export.bind(this)));
      }, this);*/
    }

    profileUpdated(): void {
      this.profileService.saveProfile(this.profile.toData());
    }

    tabUpdated(tab: Tab): void {
      console.log('tabUpdated(<Tab>)');
      this.profileService.saveTab(tab.toData(), this.profile.id);
      this.export();
    }

    loadStyle(style: Style) {
      console.log('loading style: ' + style.id);
      this.style = style;
      this.export();
    }

    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => {
          this.profileService.setProfileId(params.get('id'));
          return this.profileService.profileSubject;
        })
        .subscribe((profile => {
          this.profile = profileFromData(profile);
          this.registerTabs();
        }));
      // this.profileService.OnStyleUpdate(this.loadStyle.bind(this));
      this.profileService.styleUrlSubject.subscribe({
        next: (style: Style) => {
          this.loadStyle(style);
        }
      });
    }

}
