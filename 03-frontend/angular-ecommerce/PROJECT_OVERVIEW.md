# DoryShop - Angular E-commerce Frontend

## 1. Project Overview

DoryShop is the frontend application for an e-commerce platform, built with Angular. It aims to provide a responsive, user-friendly, and interactive online shopping experience. This application is responsible for presenting products, managing user interactions such as shopping cart functionality, and facilitating the checkout process.

The project was initially generated with Angular CLI version 8.3.18.

## 2. Key Features

Based on its nature as an e-commerce frontend, the application likely includes or aims to implement the following features:

*   **Product Catalog & Discovery:**
    *   Display a list of available products with details (name, price, description, images).
    *   Categorization and filtering of products.
    *   Search functionality to allow users to find specific products.
    *   Detailed product view pages.
*   **Shopping Cart Management:**
    *   Ability to add products to a virtual shopping cart.
    *   View and modify cart contents (e.g., update item quantities, remove items).
    *   Calculation of subtotal and total order value.
*   **User Account Management (Potential):**
    *   User registration and login capabilities.
    *   Access to order history and user profile management.
*   **Checkout Process:**
    *   A guided, multi-step process for users to place orders.
    *   Collection of shipping and billing information.
    *   (Potentially) Integration with payment gateways.
    *   Order confirmation display.
*   **Responsive Design:**
    *   The user interface should adapt to different screen sizes (desktop, tablet, mobile) for a consistent experience.

## 3. Technology Stack

*   **Core Framework:** Angular (v8.3.18)
*   **Language:** TypeScript, HTML, CSS/SCSS
*   **Package Manager:** npm (or Yarn)
*   **Build Tool:** Angular CLI
*   **Unit Testing:** Karma
*   **End-to-End Testing:** Protractor

## 4. Project Structure

The project follows the standard Angular CLI-generated directory structure:

*   `src/`: Contains the main application code.
    *   `src/app/`: Core application modules, components, services, routes, etc.
    *   `src/assets/`: Static assets like images, fonts, and global styles.
    *   `src/environments/`: Environment-specific configuration files (e.g., for development, production).
*   `angular.json`: Angular CLI workspace configuration.
*   `package.json`: Project dependencies and scripts.

## 5. Development and Build

For detailed instructions on setting up the development environment, running the application, building, and testing, please refer to the primary README.md file.

Key commands include:
*   `ng serve`: Runs the development server (typically on `http://localhost:4200/`).
*   `ng build`: Builds the project for deployment. Use `--prod` for a production build.
*   `ng test`: Executes unit tests.
*   `ng e2e`: Executes end-to-end tests.

**Important Note for Development Server:**

If you encounter OpenSSL-related errors when running `ng serve` with newer versions of Node.js, you might need to use the following command (as noted in the original `README.md`):

```bash
node --openssl-legacy-provider ./node_modules/@angular/cli/bin/ng serve
```
This command uses a legacy OpenSSL provider, which can resolve compatibility issues with older Angular CLI versions.