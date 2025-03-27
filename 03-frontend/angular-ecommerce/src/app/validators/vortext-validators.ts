import { FormControl, ValidationErrors } from "@angular/forms";

export class VortextValidators {
  //whitespace validation
  static onlyWhitespace(control: FormControl): ValidationErrors {
    // check if string only contains whitespace
    if (control.value != null && control.value.trim().length === 0) {
      //invalid return error objects
      return { onlyWhitespace: true };
    }
    //valid return null
    return null;
  }
}
