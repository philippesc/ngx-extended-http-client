import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class ExtendedHttpClientService {
  constructor(private httpClient: HttpClient) {}

  uploadFileWithMultipartPixed<T>(url: string, file: File): Observable<T> {
    return new Observable((subscriber) =>
      this.readFileAsObservable(subscriber, file, url)
    );
  }

  private readFileAsObservable<T>(
    subscriber: Subscriber<T>,
    file: File,
    url: string
  ) {
    const reader = new FileReader();

    reader.onloadend = () =>
      this.continueWithReadFile<T>(subscriber, reader, file, url);

    reader.readAsArrayBuffer(file);
  }

  private continueWithReadFile<T>(
    subscriber: Subscriber<T>,
    reader: FileReader,
    file: File,
    url: string
  ) {
    const fileContents = reader.result;

    const boundary = this.getBoundary();
    const header = this.getHeader(boundary);
    const footer = this.getFooter(boundary);
    const contents = this.getContents(file, header);

    if (!fileContents) {
      console.error('Could not read file.');
      return;
    }

    const blob = new Blob([contents, fileContents, footer]);

    this.httpClient
      .post<T>(url, blob, {
        headers: { 'Content-Type': 'multipart/mixed; boundary=' + boundary },
      })
      .subscribe(subscriber);
  }

  private getBoundary(): string {
    const epochTicks = 621355968000000000;
    const ticksPerMillisecond = 10000;
    const yourTicks = epochTicks + new Date().getTime() * ticksPerMillisecond;

    const boundary = '---------------------------' + yourTicks;

    return boundary;
  }

  private getHeader(boundary: string): string {
    return '--' + boundary + '\r\n';
  }

  private getFooter(boundary: string): string {
    return '\r\n--' + boundary + '--\r\n';
  }

  private getContents(file: File, header: string): string {
    let contents;

    contents =
      header +
      'Content-Disposition: form-data; name="params"; filename="' +
      file.name +
      '"\r\n';
    contents += 'Content-Transfer-Encoding: binary\r\n';
    contents += 'Content-Type: ' + file.type + '\r\n';
    contents += 'Content-Length: ' + file.size + '\r\n\r\n';

    return contents;
  }
}
