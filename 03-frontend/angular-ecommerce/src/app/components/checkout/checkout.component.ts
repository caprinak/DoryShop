import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { Country } from "src/app/common/country";
import { State } from "src/app/common/state";
import { ThevortexFormService } from "src/app/services/vortex-shop-form.service";
import { VortextValidators } from "src/app/validators/vortext-validators";
import { CartService } from "src/app/services/cart.service"; // Import CartService

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;
  countries: Country[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  shippingAdressstates: State[] = [];
  billingAdressstates: State[] = [];
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private thevortexFormService: ThevortexFormService,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit(): void {
    this.reviewCartInfos();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          VortextValidators.onlyWhitespace,
        ]),
        lastName: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          VortextValidators.onlyWhitespace,
        ]),
        email: new FormControl("", [
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*.[a-zA-Z]{2,4}$"
          ),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          VortextValidators.onlyWhitespace,
        ]),
        city: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          VortextValidators.onlyWhitespace,
        ]),
        state: new FormControl("", [Validators.required]),
        country: new FormControl("", [Validators.required]), // Removed minLength(2)
        zipCode: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$"), // US ZIP code pattern
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""], // Removed minLength(2)
        zipCode: [""],
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl("", [Validators.required]),
        nameOnCard: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          VortextValidators.onlyWhitespace,
        ]),
        cardNumber: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]{16}$"), // 16-digit card number
        ]),
        securityCode: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]{3}$"), // 3-digit CVV
        ]),
        expirationMonth: new FormControl("", [Validators.required]),
        expirationYear: new FormControl("", [Validators.required]),
      }),
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.thevortexFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      });

    // populate credit card years

    this.thevortexFormService.getCreditCardYears().subscribe((data) => {
      console.log("Retrieved credit card years: " + JSON.stringify(data));
      this.creditCardYears = data;
    });

    //populate countries
    this.thevortexFormService.getCountries().subscribe((data) => {
      console.log("Retrieved countries : " + JSON.stringify(data));
      this.countries = data;
    });

    // //populate states
    // this.thevortexFormService.getStates().subscribe(
    //   data => {
    //     console.log("Retrieved countries : " + JSON.stringify(data));
    //     this.countries = data;
    //   }
    // )
  }
  private reviewCartInfos() {
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
  }

  get firstName() {
    return this.checkoutFormGroup.get("customer.firstName");
  }

  get lastName() {
    return this.checkoutFormGroup.get("customer.lastName");
  }

  get email() {
    return this.checkoutFormGroup.get("customer.email");
  }

  // Getter methods for shippingAddress fields
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get("shippingAddress.country");
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get("shippingAddress.street");
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get("shippingAddress.city");
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get("shippingAddress.state");
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get("shippingAddress.zipCode");
  }

  // Getter methods for creditCard fields
  get cardType() {
    return this.checkoutFormGroup.get("creditCard.cardType");
  }

  get nameOnCard() {
    return this.checkoutFormGroup.get("creditCard.nameOnCard");
  }

  get cardNumber() {
    return this.checkoutFormGroup.get("creditCard.cardNumber");
  }

  get securityCode() {
    return this.checkoutFormGroup.get("creditCard.securityCode");
  }

  get expirationMonth() {
    return this.checkoutFormGroup.get("creditCard.expirationMonth");
  }

  get expirationYear() {
    return this.checkoutFormGroup.get("creditCard.expirationYear");
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );
      console.log("the adress" + JSON.stringify(this.shippingAdressstates));

      console.log(
        "the copied adress" + JSON.stringify(this.billingAdressstates)
      );
      //bug fix for states
      this.billingAdressstates = this.shippingAdressstates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }

  onSubmit() {
    const shippingAddress = this.checkoutFormGroup.get("shippingAddress");
    console.log("Handling the submit button");
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get("customer").value);
    console.log(this.checkoutFormGroup.controls.customer.value);
    console.log(
      `The email address is ${
        this.checkoutFormGroup.get("customer").value.email
      }`
    );
    console.log(
      `The shipping address is ${shippingAddress.value.state.name} , ${shippingAddress.value.country.name}`
    );
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup.value.expirationYear
    );

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.thevortexFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      });
  }
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    console.dir("form Group : " + JSON.stringify(formGroup.value));

    this.thevortexFormService.getStates(countryCode).subscribe((data) => {
      console.log("Retrieved states : " + JSON.stringify(data));
      if (formGroupName === "shippingAddress") {
        this.shippingAdressstates = data;
      } else {
        this.billingAdressstates = data;
      }
      //set default
      formGroup.get("state").setValue(data[0]);
    });
  }
}
