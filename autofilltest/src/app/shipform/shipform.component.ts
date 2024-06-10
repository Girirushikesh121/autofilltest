import { Component, OnInit} from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressModel, EnrollmentModel } from '../model';
import { AppConstants } from '../constants';



@Component({
  selector: 'app-shipform',
  templateUrl: './shipform.component.html',
  styleUrls: ['./shipform.component.css']
})
export class ShipformComponent implements OnInit {

  public shippingForm!: FormGroup;
  autoFillState = new FormControl();
  states = AppConstants.States;
  addressModel = new AddressModel();
  firstNameMaxLength: number = 20;
  lastNameMaxLength: number = 19;
  demo = new EnrollmentModel();

  isEnrollment: string = 'true';

  constructor( private titlecasePipe: TitleCasePipe) { }

  ngOnInit() {
    this.createShippingForm();
    this.autoFillState.valueChanges.subscribe((selectedValue) => {
      this.shippingForm.controls['State'].setValue(selectedValue);
    });  
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.shippingForm.controls[controlName].hasError(errorName);
  }

  createShippingForm() {

    this.shippingForm = new FormGroup({
      FirstName: new FormControl(this.titlecasePipe.transform(this.demo.ShippingAddress.FirstName), { validators: [Validators.required, Validators.maxLength(this.firstNameMaxLength)], updateOn: 'blur' }),
      LastName: new FormControl(this.titlecasePipe.transform(this.demo.ShippingAddress.LastName), { validators: [Validators.required, Validators.maxLength(this.lastNameMaxLength)], updateOn: 'blur' }),
      Street1: new FormControl(this.titlecasePipe.transform(this.demo.ShippingAddress.Street1), { validators: [Validators.required, Validators.pattern('^.{1,35}$')], updateOn: 'blur' }),
      Street2: new FormControl(this.titlecasePipe.transform(this.demo.ShippingAddress.Street2), { validators: [Validators.pattern('^.{1,35}$')], updateOn: 'blur' }),
      City: new FormControl(this.titlecasePipe.transform(this.demo.ShippingAddress.City), { validators: [Validators.required, Validators.pattern('^.{1,40}$')], updateOn: 'blur' }),
      State: new FormControl(this.demo.ShippingAddress.State, { validators: [Validators.required], updateOn: 'blur' }),
      PostalCode: new FormControl(this.demo.ShippingAddress.PostalCode, { validators: [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')], updateOn: 'blur' }),
      isPrimary: new FormControl(this.demo.ShippingAddress.Primary)
    }, { updateOn: 'submit' });

  }
  
  onContinue() {
    console.log("submit")
  }

  onKeyDown(event: any, controlName: string) {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      this.shippingForm.get(controlName)?.patchValue((event.target as HTMLInputElement).value);
      this.shippingForm.get(controlName)?.markAsTouched();
      this.onContinue();
    }
  }

  changeState(event: any, controlName: string) {
    this.shippingForm.get(controlName)?.patchValue(event.value);
  }

  onSateInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const state = this.states.find(state => state.name.toLowerCase() === inputValue.toLowerCase() || state.abbreviation.toLowerCase() === inputValue.toLowerCase());

    if (state) {
      this.shippingForm.controls['State'].setValue(state.abbreviation);
    } else {
      this.shippingForm.controls['State'].reset();
      this.shippingForm.controls['State'].markAsTouched();
    }
  }
}
