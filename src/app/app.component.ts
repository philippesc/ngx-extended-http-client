import { Component } from '@angular/core';
import { ExtendedHttpClientService } from 'projects/extended-http-client/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ExtendedHttpClient';

  constructor(private extendedHttpClient: ExtendedHttpClientService) {}

  test(event: any) {
    console.log(event);
    if (event.target.files[0]) {
      this.extendedHttpClient
        .uploadFileWithMultipartMixed('/test-123', event.target.files[0])
        .subscribe((result) => console.log(result));
    }
  }
}
