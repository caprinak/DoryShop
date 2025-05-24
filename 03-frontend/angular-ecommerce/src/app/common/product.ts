export class Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    unitPrice: number;
    imageUrl: string;
    active: boolean = true;
    unitsInStock: number;
    dateCreated: Date;
    lastUpdated: Date;
    category?: {
        id: number;
        name: string;
    };
}
