import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitIdeaComponent } from './submit-idea.component';

describe('SubmitIdeaComponent', () => {
  let component: SubmitIdeaComponent;
  let fixture: ComponentFixture<SubmitIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitIdeaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
