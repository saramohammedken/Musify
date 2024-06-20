import { TestBed } from '@angular/core/testing';

import { AudioDataService } from './audio-data.service';

describe('AudioDataService', () => {
  let service: AudioDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
