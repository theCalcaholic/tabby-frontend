import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const profiles = [
      {
        id: "9as9u2ob3bonal",
        tabs: [
          {
            "id": 0,
            "title": "Tab 1",
            "content": "<p>Content of tab 1</p>"
          }
        ]
      }
    ];
    return {profiles};
  }
}
