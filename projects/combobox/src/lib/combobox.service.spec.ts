import { TestBed } from '@angular/core/testing';

import { ComboboxService } from './combobox.service';

describe('ComboboxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComboboxService = TestBed.get(ComboboxService);
    expect(service).toBeTruthy();
  });
});
