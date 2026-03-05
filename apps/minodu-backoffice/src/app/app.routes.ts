import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { WeatherComponent } from './weather/weather.component';
import { ProductsComponent } from './products/products.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { ProductAvailabilitiesComponent } from './product-availabilities/product-availabilities.component';
import { UsersComponent } from './users/users.component';
import { PartnersComponent } from './partners/partners.component';
import { PostsComponent } from './posts/posts.component';
import { PostCategoriesComponent } from './post-categories/post-categories.component';
import { PostTagsComponent } from './post-tags/post-tags.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductRequestsComponent } from './product-requests/product-requests.component';
import { ProductDemandsComponent } from './product-demands/product-demands.component';
import { ForumComponent } from './forum/forum.component';
import { LogsComponent } from './logs/logs.component';
import { AuthGuard } from './_helpers/auth.guard';

export const routes: Routes = [
    { path: 'admin', component: HomeComponent, data: { activeMenu: 'home' }, canActivate: [AuthGuard] },
    { path: 'weather', component: WeatherComponent, data: { activeMenu: 'weather' }, canActivate: [AuthGuard] },
    { path: 'configuration', component: ConfigurationComponent, data: { activeMenu: 'configuration' }, canActivate: [AuthGuard] },
    { path: 'products', component: ProductsComponent, data: { activeMenu: 'products' }, canActivate: [AuthGuard] },
    { path: 'product-categories', component: ProductCategoriesComponent, data: { activeMenu: 'products' }, canActivate: [AuthGuard] },
    { path: 'product-availabilities', component: ProductAvailabilitiesComponent, data: { activeMenu: 'market' }, canActivate: [AuthGuard] },
    // { path: 'product-requests', component: ProductRequestsComponent, data: { activeMenu: 'market' }, canActivate: [AuthGuard] },
    { path: 'product-demands', component: ProductDemandsComponent, data: { activeMenu: 'market' }, canActivate: [AuthGuard] },
    { path: 'product-details', component: ProductDetailsComponent, data: { activeMenu: 'products' }, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, data: { activeMenu: 'users' }, canActivate: [AuthGuard] },
    { path: 'partners', component: PartnersComponent, data: { activeMenu: 'users' }, canActivate: [AuthGuard] },
    { path: 'posts', component: PostsComponent, data: { activeMenu: 'posts' }, canActivate: [AuthGuard] },
    { path: 'post-categories', component: PostCategoriesComponent, data: { activeMenu: 'posts' }, canActivate: [AuthGuard] },
    { path: 'post-tags', component: PostTagsComponent, data: { activeMenu: 'posts' }, canActivate: [AuthGuard] },
    { path: 'post-details/:id', component: PostDetailsComponent, data: { activeMenu: 'posts' }, canActivate: [AuthGuard] },
    { path: 'forum', component: ForumComponent, data: { activeMenu: 'forum' }, canActivate: [AuthGuard] },
    { path: 'logs', component: LogsComponent, data: { activeMenu: 'logs' }, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent, data: { activeMenu: null } },
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: '**', redirectTo: '/admin' },
];
