import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private adminUrl = 'http://localhost:8080/api/admin';
  private categoryUrl = 'http://localhost:8080/api/product-category';
  private imageBaseUrl = 'http://localhost:8080/api/dory/images';  // Add this line

  constructor(private httpClient: HttpClient) { }

  formatImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    // If the URL is already absolute (starts with http:// or https://), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // Otherwise, prepend the image base URL
    return `${this.imageBaseUrl}/${imageUrl}`;
  }

  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl).pipe(
      map(product => {
        product.imageUrl = this.formatImageUrl(product.imageUrl);
        return product;
      })
    );
  }

  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetResponseProducts> {

    // need to build URL based on category id, page and size 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, 
                        thePageSize: number, 
                        theKeyword: string): Observable<GetResponseProducts> {

    // need to build URL based on keyword, page and size 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getAllProducts(page: number = 0, size: number = 10): Observable<GetResponseProducts> {
    console.log(`Fetching products - page: ${page}, size: ${size}`);
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProducts>(url)
      .pipe(
        map(response => {
          console.log('Raw API response:', response);
          if (!response._embedded?.products) {
            console.error('Invalid API response format:', response);
            throw new Error('Invalid API response format');
          }
          // Format image URLs for all products
          response._embedded.products.forEach(product => {
            product.imageUrl = this.formatImageUrl(product.imageUrl);
          });
          return response;
        })
      );
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => {
        const products = response._embedded.products;
        // Format image URLs for all products
        products.forEach(product => {
          product.imageUrl = this.formatImageUrl(product.imageUrl);
        });
        return products;
      })
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.baseUrl, product);
  }

  updateProduct(id: string, product: any, file?: File): Observable<Product> {
    const formData = new FormData();
    
    // Append each product field individually instead of as a JSON blob
    Object.keys(product).forEach(key => {
      // Handle nested category object specially
      if (key === 'category' && product[key]) {
        formData.append('categoryId', product[key].id);
      } else if (product[key] !== null && product[key] !== undefined) {
        // Only append if value is not null/undefined
        formData.append(key, product[key]);
      }
    });
    
    // Only append file if one is provided
    if (file) {
      formData.append('file', file);
    }

    return this.httpClient.put<Product>(`${this.adminUrl}/products/${id}`, formData);
  }

  deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}