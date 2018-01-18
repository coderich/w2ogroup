import { TestBed, inject } from '@angular/core/testing';

import { SeeClickFixService } from './see-click-fix.service';

describe('SeeClickFixService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeeClickFixService]
    });
  });

  it('should be created', inject([SeeClickFixService], (service: SeeClickFixService) => {
    expect(service).toBeTruthy();
  }));
});
