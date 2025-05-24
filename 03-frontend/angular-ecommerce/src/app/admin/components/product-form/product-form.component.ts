import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: ProductCategory[] = [];
  isEditMode = false;
  productId: string;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isSubmitting = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    // Get product data from router state if available
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.product) {
      const product = navigation.extras.state.product as Product;
      this.productId = product.id;
      this.isEditMode = true;
      this.previewUrl = product.imageUrl;
      
      // Initialize form with product data
      this.initializeForm(product);
    } else {
      this.initializeForm();
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    
    // Only load product from API if we don't have it in router state
    this.productId = this.route.snapshot.params['id'];
    if (this.productId && !this.productForm.value.name) {
      this.isEditMode = true;
      this.isLoading = true;
      this.loadProduct();
      this.isLoading = false;
    }
  }

  private initializeForm(product?: Product) {
    this.productForm = this.formBuilder.group({
      name: [product?.name || '', [Validators.required, Validators.minLength(2)]],
      description: [product?.description || '', Validators.required],
      unitPrice: [product?.unitPrice || '', [Validators.required, Validators.min(0)]],
      imageUrl: [product?.imageUrl || '', Validators.required],
      unitsInStock: [product?.unitsInStock || '', [Validators.required, Validators.min(0)]],
      categoryId: [product?.category?.id || '', Validators.required],
      active: [product?.active ?? true]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.valid && !this.isSubmitting && !this.isLoading) {
      this.isSubmitting = true;
      const productData = this.productForm.value;
      
      if (this.isEditMode) {
        this.productService.updateProduct(this.productId, productData, this.selectedFile).subscribe({
          next: () => {
            this.router.navigate(['/admin/products']);
          },
          error: error => {
            console.error('Error updating product:', error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      } else {
        this.productService.createProduct(productData).subscribe({
          next: () => {
            this.router.navigate(['/admin/products']);
          },
          error: error => {
            console.error('Error creating product:', error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      }
    }
  }

  private loadCategories() {
    this.productService.getProductCategories().subscribe({
      next: data => this.categories = data,
      error: error => console.error('Error loading categories:', error)
    });
  }

  private loadProduct() {
    this.productService.getProduct(+this.productId).subscribe({
      next: product => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          unitPrice: product.unitPrice,
          imageUrl: product.imageUrl,
          unitsInStock: product.unitsInStock,
          categoryId: product.category?.id,
          active: product.active
        });
        this.previewUrl = product.imageUrl;
      },
      error: error => console.error('Error loading product:', error),
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/products']);
  }
}