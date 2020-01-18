import { TestBed } from '@angular/core/testing';

import { AngularDropdownService } from './angular-dropdown.service';

describe('AngularDropdownService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularDropdownService = TestBed.get(AngularDropdownService);
    expect(service).toBeTruthy();
  });
});
