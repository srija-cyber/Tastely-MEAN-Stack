import { TestBed } from '@angular/core/testing';

import { NewrecipeService } from './newrecipe.service';

describe('NewrecipeService', () => {
  let service: NewrecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewrecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
