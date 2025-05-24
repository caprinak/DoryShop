import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminRoutingModule } from './admin-routing.module';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ImageUploadService } from '../services/image-upload.service';

@NgModule({
  declarations: [
    ProductManagementComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule,
    AdminRoutingModule
  ],
  providers: [
    ImageUploadService
  ]
})
export class AdminModule { }