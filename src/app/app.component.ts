import { Component } from '@angular/core';
import { ExtendedHttpClientService } from 'projects/extended-http-client/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  multiparts: {
    name: string;
    file: File | undefined;
  }[] = [
    {
      name: 'params',
      file: undefined,
    },
  ];

  url = '';

  constructor(private extendedHttpClient: ExtendedHttpClientService) {}

  onFileSelected(partName: string, event: any) {
    if (event.target.files[0]) {
      const index = this.multiparts.findIndex(
        (multipart) => multipart.name === partName
      );
      this.multiparts[index].file = event.target.files[0];
    }
  }

  send() {
    this.extendedHttpClient
      .uploadFilesWithMultipartMixed(
        this.url,
        this.multiparts.reduce((a, x) => ({ ...a, [x.name]: x.file }), {})
      )
      .subscribe((result) => console.log(result));
  }

  addPart() {
    this.multiparts.push({
      name: '',
      file: undefined,
    });
  }
}
