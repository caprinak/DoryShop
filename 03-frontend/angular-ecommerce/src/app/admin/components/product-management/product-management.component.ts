import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1;
  pageSize = 8;
  totalElements = 0;
  loading = false;
  categories: ProductCategory[] = [];
  currentCategoryId: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.productService.getProductCategories().subscribe(
      data => this.categories = data
    );
  }

  loadProducts() {
    this.loading = true;
    console.log(`Loading products... Page: ${this.currentPage}, Size: ${this.pageSize}`);
    
    if (this.currentCategoryId > 0) {
      // Load products by category
      this.productService.getProductListPaginate(this.currentPage - 1, this.pageSize, this.currentCategoryId).subscribe({
        next: (response) => {
          if (response._embedded?.products) {
            this.products = response._embedded.products;
            this.totalElements = response.page.totalElements;
            console.log(`Loaded ${this.products.length} products out of ${this.totalElements} total`);
          } else {
            console.error('Invalid response format:', response);
            this.products = [];
          }
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.products = [];
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      // Load all products
      this.productService.getAllProducts(this.currentPage - 1, this.pageSize).subscribe({
        next: (response) => {
          if (response._embedded?.products) {
            this.products = response._embedded.products;
            this.totalElements = response.page.totalElements;
            console.log(`Loaded ${this.products.length} products out of ${this.totalElements} total`);
          } else {
            console.error('Invalid response format:', response);
            this.products = [];
          }
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.products = [];
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  addProduct() {
    this.router.navigate(['/admin/products/new']);
  }

  editProduct(product: Product) {
    // Navigate with full product state
    this.router.navigate(['/admin/products/edit', product.id], {
      state: { product }
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  updatePageSize(pageSizeStr: string) {
    const newSize = parseInt(pageSizeStr, 10);
    if (!isNaN(newSize) && newSize > 0) {
      this.pageSize = newSize;
      this.currentPage = 1; // Reset to first page
      this.loadProducts();
    }
  }

  handlePageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  onCategoryChange(categoryId: string) {
    this.currentCategoryId = parseInt(categoryId);
    this.currentPage = 1; // Reset to first page when changing category
    this.loadProducts();
  }
}