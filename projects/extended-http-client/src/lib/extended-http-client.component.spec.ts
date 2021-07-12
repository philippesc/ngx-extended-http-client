import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedHttpClientComponent } from './extended-http-client.component';

describe('ExtendedHttpClientComponent', () => {
  let component: ExtendedHttpClientComponent;
  let fixture: ComponentFixture<ExtendedHttpClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedHttpClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedHttpClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
