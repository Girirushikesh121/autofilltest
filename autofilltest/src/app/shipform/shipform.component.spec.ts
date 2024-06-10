import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipformComponent } from './shipform.component';

describe('ShipformComponent', () => {
  let component: ShipformComponent;
  let fixture: ComponentFixture<ShipformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
