import { TestBed } from '@angular/core/testing';

import { SubmitrecipeService } from './submitrecipe.service';

describe('SubmitrecipeService', () => {
  let service: SubmitrecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmitrecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
