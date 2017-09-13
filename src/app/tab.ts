export class TabData {
  title: string;
  content: string;

}

export class Tab {
    private _title: string;
    private _content: string;
    get title(): string {
      return this._title;
    };
    set title(theTitle: string) {
      console.log("set Tab.title");
      this._title = theTitle;
      this.OnChange();
    }
    get content(): string {
      return this._content;
    }
    set content(theContent: string) {
      console.log("set Tab.content");
      this._content = theContent;
      this.OnChange();
    }
    active: false;

    constructor(title: string, onChange?: Function) {
      this._title = title;
      this._content = '';
      this.OnChange = onChange || (()=>{});
    }

    OnChange: Function;

    toData(): TabData {
      return { title: this._title, content: this._content }
    }
}

export function tabFromData(data: TabData): Tab {
      let tab = new Tab(data.title);
      tab.content = data.content;
      return tab;
}
