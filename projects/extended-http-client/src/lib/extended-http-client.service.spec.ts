import { TestBed } from '@angular/core/testing';

import { ExtendedHttpClientService } from './extended-http-client.service';

describe('ExtendedHttpClientService', () => {
  let service: ExtendedHttpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtendedHttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
