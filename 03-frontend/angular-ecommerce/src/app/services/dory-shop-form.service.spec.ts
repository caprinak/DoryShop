import { TestBed } from "@angular/core/testing";

import { DoryFormService } from "./dory-shop-form.service";

describe("DoryFormService", () => {
  let service: DoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoryFormService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
