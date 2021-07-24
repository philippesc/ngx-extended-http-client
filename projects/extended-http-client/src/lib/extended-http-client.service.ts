import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Files } from './files';

@Injectable()
export class ExtendedHttpClientService {
  constructor(private httpClient: HttpClient) {}

  uploadFilesWithMultipartMixed<T>(url: string, files: Files): Observable<T> {
    const readFiles$: Observable<
      {
        result: string | ArrayBuffer | null;
        file: File;
        partName: string;
      }[]
    > = forkJoin(
      Object.keys(files).map((key) =>
        this.readFile(files[key]).pipe(
          map((result) => ({
            result,
            file: files[key],
            partName: key,
          }))
        )
      )
    );

    return readFiles$.pipe(
      map((files) => files.filter((file) => file?.result != null)),
      map((readFiles) => {
        const boundary = this.getBoundary();

        const blobParts: BlobPart[] = new Array();

        readFiles.forEach((file) => {
          const fileBlobParts = this.getFileBlobPart(
            boundary,
            file.file,
            file.partName,
            file.result as string | ArrayBuffer
          );
          blobParts.push(fileBlobParts.part, fileBlobParts.fileContent, '\r\n');
        });

        return {
          boundary,
          payload: new Blob([...blobParts, '\r\n--' + boundary + '--\r\n']),
        };
      }),
      concatMap((dataToSendRequestWith) =>
        this.httpClient.post<T>(url, dataToSendRequestWith.payload, {
          headers: {
            'Content-Type':
              'multipart/mixed; boundary=' + dataToSendRequestWith.boundary,
          },
        })
      )
    );
  }

  private readFile(file: File): Observable<string | ArrayBuffer | null> {
    return new Observable((subscriber) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        subscriber.next(reader.result);
        subscriber.complete();
      };

      reader.readAsArrayBuffer(file);
    });
  }

  private getBoundary(): string {
    const epochTicks = 621355968000000000;
    const ticksPerMillisecond = 10000;
    const yourTicks = epochTicks + new Date().getTime() * ticksPerMillisecond;

    const boundary = '---------------------------' + yourTicks;

    return boundary;
  }

  private getFileBlobPart(
    boundary: string,
    file: File,
    partName: string,
    readerResult: string | ArrayBuffer
  ): {
    part: BlobPart;
    fileContent: BlobPart;
  } {
    let part = `--${boundary}\r\n`;
    part += `Content-Disposition: form-data; name="${partName}"; filename="${file.name}"\r\n`;
    part += 'Content-Transfer-Encoding: binary\r\n';
    part += 'Content-Type: ' + file.type + '\r\n';
    part += 'Content-Length: ' + file.size + '\r\n\r\n';

    return {
      part,
      fileContent: readerResult,
    };
  }
}
