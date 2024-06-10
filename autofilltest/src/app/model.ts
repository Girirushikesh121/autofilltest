export class AddressModel {
    FullName: string = "";
    FirstName: string = "";
    LastName: string = "";
    Street1: string = "";
    Street2: string = "";
    City: string = "";
    State: string = "";
    StateName: string = "";
    PostalCode: string = "";
    AddressNumber: string = "";
    Primary: string = "";
    ConnectedDevices: string = "";
  }

  export class EnrollmentModel{
   public ShippingAddress: AddressModel = new AddressModel();
  }