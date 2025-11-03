import { customAlphabet } from 'nanoid'
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserStatus } from '../user_status/entities/user_status.entity';
import { PostResource } from 'src/post_resources/entities/post_resources.entity';
import { BaseConfig } from './common.util';
import { PostTag } from 'src/post_tags/entities/post_tag.entity';
import { PostCategory } from 'src/post_categories/entities/post_categories.entity';
import { ProductCategory } from 'src/product_categories/entities/product_category.entity';
import { Product } from 'src/products/entities/product.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Partner } from 'src/partners/entities/partner.entity';
import { ProductDemand } from 'src/product_demands/entities/demand.entity';
import { ProductOffer } from 'src/product_offers/entities/product_offer.entity';

export abstract class DataFormater {

  static noId() {
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMOPQRSTUVWXYZ', 12)
    return nanoid(12)
  }

  static getUser(user: User) {
    if (user) {
      return {
        id: user.id,
        fullname: user.fullname,
        gender: user.gender,
        phone: user?.phone,
        role: this.getRole(user.role),
        status: this.getUserStatus(user.status),
        lastConnexion: user.lastConnexion
      }
    }
  }

  static getRole(role: Role) {
    if (role) {
      return {
        id: role.id,
        name: role.name
      }
    }
  }

  static getUserStatus(userStatus: UserStatus) {
    if (userStatus) {
      return {
        id: userStatus.id,
        name: userStatus.name
      }
    }
  }

  static getResource(resource: PostResource) {
    if (resource) {
      return {
        id: resource.id,
        name: resource.name,
        image: resource.image? BaseConfig.getFileUrl(resource.image): BaseConfig.getFileUrl("default-img.png")
      }
    }
  }

  static getTag(tag: PostTag) {
    if (tag) {
      return {
        id: tag.id,
        name: tag.name,
        image: BaseConfig.getFileUrl(tag.image)
      }
    }
  }

  static getPostCategory(category: PostCategory) {
    if (category) {
      return {
        id: category.id,
        name: category.name,
        image: category.image? BaseConfig.getFileUrl(category.image): BaseConfig.getFileUrl("default-img.png")
      }
    }
  }

  static getPartner(partner: Partner) {
    if (partner) {
      return {
        id: partner.id,
        name: partner.name,
        adresse: partner.adresse,
        phone: partner.phone
      }
    }
  }

  static getProductCategory(category: ProductCategory) {
    if (category) {
      return {
        id: category.id,
        name: category.name,
        image: BaseConfig.getFileUrl(category.image)
      }
    }
  }

  static getProductOffer(productOffer: ProductOffer) {
    if (productOffer) {
      return {
        id: productOffer.id,
        quantity: productOffer.quantity,
        user: this.getUser(productOffer.user),
        product: this.getProduct(productOffer.product),
      }
    }
  }

  static getProductDemand(productDemand: ProductDemand) {
    if (productDemand) {
      return {
        id: productDemand.id,
        quantity: productDemand.quantity,
        partner: this.getPartner(productDemand.partner),
        product: this.getProduct(productDemand.product),
        deadline: productDemand.deadline
      }
    }
  }

  static getProduct(product: Product) {
    if (product) {
      return {
        id: product.id,
        category: this.getProductCategory(product.productCategory),
        name: product.name,
        description: product.description,
        sales_unit: product.sales_unit,
        price: product.price,
        image: product.image? BaseConfig.getFileUrl(product.image): BaseConfig.getFileUrl("default-img.png"),
        // offers: product.productOffers? product.productOffers.map(this.getProductOffer).filter(offer => !!offer):[],
      }
    }
  }

  static getPost(post: Post) {
    if (post) {
      return {
        id: post.id,
        author: post.author,
        category: this.getPostCategory(post.postCategory),
        title: post.title,
        description: post.description,
        image: BaseConfig.getFileUrl(post.image),
        attachment: BaseConfig.getFileUrl(post.attachment),
        attachment_kb: BaseConfig.getFileUrl(post.attachmentKb),
        tags: post.tags.map(this.getTag).filter(tag => !!tag),
        resources: (post.resources) ?post.resources.map(this.getResource).filter(resource => !!resource):[],
      }
    }
  }
}