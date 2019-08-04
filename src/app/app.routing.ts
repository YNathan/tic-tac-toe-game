import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent }, 
    { path: 'table', component: TableComponent }, 
    // otherwise redirect to home
    { path: '**', redirectTo: 'home' }
];

export const routing = RouterModule.forRoot(appRoutes,{onSameUrlNavigation: 'reload' });