import { TestBed } from '@angular/core/testing';

import { VoicecallService } from './voicecall.service';

describe('VoicecallService', () => {
  let service: VoicecallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoicecallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
