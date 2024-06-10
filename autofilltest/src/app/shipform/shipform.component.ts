import { Component, ViewChild, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { AddressModel, EnrollmentModel } from '../model';
import { AppConstants } from '../constants';



@Component({
  selector: 'app-shipform',
  templateUrl: './shipform.component.html',
  styleUrls: ['./shipform.component.css']
})
export class ShipformComponent implements OnInit {
 
  @Input() address!: AddressModel;
  @Output() messageEvent: EventEmitter<any> = new EventEmitter();
  @Output() isShppingDrawerOpened = new EventEmitter<{ isShppingDrawerOpened: boolean }>();
  @Input() isNoDevicePresent: boolean = false;

  public shippingForm!: FormGroup;
  autoFillState = new FormControl();
  states = AppConstants.States;
  successMessage: string = "";
  errorMessage: string = "";
  addressModel = new AddressModel();
  enrollmentLocalStorage: any;
  loadSavedAddressComponent = false;
  @ViewChild('shippingList') shippingList!: MatDrawer;
  disableContinue: boolean = false;
  firstNameMaxLength: number = 20;
  lastNameMaxLength: number = 19;
  enrollmentModel = new EnrollmentModel();
  savedAddressInfo: any;  
  isMatDrawerOpen: boolean = false;

  isEnrollment: string = 'true';

  constructor( private titlecasePipe: TitleCasePipe) { }

  ngOnInit() {
    this.createShippingForm();

    // Fix for Auto Fill state Drop down.
    this.autoFillState.valueChanges.subscribe((selectedValue) => {
      this.shippingForm.controls['State'].setValue(selectedValue);
    });

    this.getSelectedAddress({ selectedAddress: this.address });
  
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.shippingForm.controls[controlName].hasError(errorName);
  }

  createShippingForm() {
    if (this.isEnrollment == "true") {
      this.prePopulateShippingInfo();
    }

    this.shippingForm = new FormGroup({
      FirstName: new FormControl(this.titlecasePipe.transform(this.enrollmentModel.ShippingAddress.FirstName), { validators: [Validators.required, Validators.maxLength(this.firstNameMaxLength)], updateOn: 'blur' }),
      LastName: new FormControl(this.titlecasePipe.transform(this.enrollmentModel.ShippingAddress.LastName), { validators: [Validators.required, Validators.maxLength(this.lastNameMaxLength)], updateOn: 'blur' }),
      Street1: new FormControl(this.titlecasePipe.transform(this.enrollmentModel.ShippingAddress.Street1), { validators: [Validators.required, Validators.pattern('^.{1,35}$')], updateOn: 'blur' }),
      Street2: new FormControl(this.titlecasePipe.transform(this.enrollmentModel.ShippingAddress.Street2), { validators: [Validators.pattern('^.{1,35}$')], updateOn: 'blur' }),
      City: new FormControl(this.titlecasePipe.transform(this.enrollmentModel.ShippingAddress.City), { validators: [Validators.required, Validators.pattern('^.{1,40}$')], updateOn: 'blur' }),
      State: new FormControl(this.enrollmentModel.ShippingAddress.State, { validators: [Validators.required], updateOn: 'blur' }),
      PostalCode: new FormControl(this.enrollmentModel.ShippingAddress.PostalCode, { validators: [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')], updateOn: 'blur' }),
      isPrimary: new FormControl(this.enrollmentModel.ShippingAddress.Primary)
    }, { updateOn: 'submit' });

  }
  

  openSavedAddress() {
    this.loadSavedAddressComponent = true;

    // Disable Continue and Back buttons when Choose Saved Address drawer is open
    this.disableContinue = true;

    this.shippingList.toggle();
  }

  onContinue() {
    console.log("submit")
  }

   getSelectedAddress(valueEmitted: { selectedAddress: AddressModel }) {
  //   // Populate shipping form from the model
  //   this.savedAddressInfo = valueEmitted?.selectedAddress;
  //   this.shippingForm.setValue({
  //     FirstName: this.titlecasePipe.transform(valueEmitted.selectedAddress.FirstName),
  //     LastName: this.titlecasePipe.transform(valueEmitted.selectedAddress.LastName),
  //     Street1: this.titlecasePipe.transform(valueEmitted.selectedAddress.Street1),
  //     Street2: this.titlecasePipe.transform(valueEmitted.selectedAddress.Street2),
  //     City: this.titlecasePipe.transform(valueEmitted.selectedAddress.City),
  //     State: valueEmitted.selectedAddress.State,
  //     PostalCode: valueEmitted.selectedAddress.PostalCode,
  //     isPrimary: valueEmitted.selectedAddress.Primary
  //   });
   }

  onOpenedChange(e: boolean) {
    // Check for false value. That means mat-drawer was closed.
    if (e == false) {
      // Enable Continue and Back buttons when the drawer is closed.
      this.disableContinue = false;
    }
  } 

  prePopulateShippingInfo() {   
    // this.shippingForm.setValue({
    //   AddressNumber: "",
    //   FirstName: 'demo',
    //   LastName: 'test',
    //   Street1: "",
    //   Street2: "",
    //   City: "",
    //   State: "",
    //   PostalCode: "",
    //   isPrimary: "X"
    // });
    // this.shippingForm.patchValue({ isPrimary: "X" }, { emitEvent: false });
    // this.savedAddressInfo.Primary = "X";
       
  }

  onKeyDown(event: any, controlName: string) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      // Update the form control's value
      this.shippingForm.get(controlName)?.patchValue((event.target as HTMLInputElement).value);
      // Trigger validation for the specific control
      this.shippingForm.get(controlName)?.markAsTouched();
      this.onContinue();
    }
  }

  changeState(event: any, controlName: string) {
    this.shippingForm.get(controlName)?.patchValue(event.value);
  }

  //Populate State value when autofill is triggered
  onSateInputChange(event: Event) {
    console.log("this.shippingForm.controls['State'].value  from autofill menthod", this.shippingForm.controls['State'].value);

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
