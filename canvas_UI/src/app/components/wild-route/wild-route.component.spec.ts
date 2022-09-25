import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WildRouteComponent } from './wild-route.component';

describe('WildRouteComponent', () => {
  let component: WildRouteComponent;
  let fixture: ComponentFixture<WildRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WildRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WildRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
