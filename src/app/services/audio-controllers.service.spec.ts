import { TestBed } from '@angular/core/testing';

import { AudioControllersService } from './audio-controllers.service';

describe('AudioControllersService', () => {
  let service: AudioControllersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioControllersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
