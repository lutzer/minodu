export class ProductOffer {
    id: number;
    productId: number;
    product: any;
    quantity: number;
    price: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    user: any;
    status: string;

    constructor(
        id: number,
        productId: number,
        product: any,
        quantity: number,
        price: number,
        description: string,
        createdAt: Date,
        updatedAt: Date,
        userId: number,
        user: any,
        status: string
    ) {
        this.id = id;
        this.productId = productId;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
        this.user = user;
        this.status = status;
    }

    static fromJson(json: any): ProductOffer {
        return new ProductOffer(
            json.id,
            json.product_id,
            json.product,
            json.quantity,
            json.price,
            json.description,
            new Date(json.created_at),
            new Date(json.updated_at),
            json.user_id,
            json.user,
            json.status
        );
    }
}