import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { WeatherComponent } from './weather/weather.component';
import { ProductsComponent } from './products/products.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { ProductAvailabilitiesComponent } from './product-availabilities/product-availabilities.component';
import { UsersComponent } from './users/users.component';
import { PostsComponent } from './posts/posts.component';
import { PostCategoriesComponent } from './post-categories/post-categories.component';
import { PostTagsComponent } from './post-tags/post-tags.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

export const routes: Routes = [
    { path: 'admin', component: HomeComponent, data: { activeMenu: 'home' } },
    { path: 'weather', component: WeatherComponent, data: { activeMenu: 'weather' } },
    { path: 'configuration', component: ConfigurationComponent, data: { activeMenu: 'configuration' } },
    { path: 'products', component: ProductsComponent, data: { activeMenu: 'products' } },
    { path: 'product-categories', component: ProductCategoriesComponent, data: { activeMenu: 'products' } },
    { path: 'product-availabilities', component: ProductAvailabilitiesComponent, data: { activeMenu: 'products' } },
    { path: 'product-details', component: ProductDetailsComponent, data: { activeMenu: 'products' } },
    { path: 'users', component: UsersComponent, data: { activeMenu: 'users' } },
    { path: 'posts', component: PostsComponent, data: { activeMenu: 'posts' } },
    { path: 'post-categories', component: PostCategoriesComponent, data: { activeMenu: 'posts' } },
    { path: 'post-tags', component: PostTagsComponent, data: { activeMenu: 'posts' } },
    { path: 'post-details/:id', component: PostDetailsComponent, data: { activeMenu: 'posts' } },
    { path: 'login', component: LoginComponent, data: { activeMenu: null } },
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: '**', redirectTo: '/admin' },
];
