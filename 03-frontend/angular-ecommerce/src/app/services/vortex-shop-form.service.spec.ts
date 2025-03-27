import { TestBed } from "@angular/core/testing";

import { ThevortexFormService } from "./vortex-shop-form.service";

describe("ThevortexFormService", () => {
  let service: ThevortexFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThevortexFormService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
