import { Routes } from '@angular/router';
import { ViewProfileComponent } from './components/profile/view-profile/view-profile.component';
import { GamesListComponent } from './components/games-list/games-list.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';


export const routes: Routes = [
    { path: 'profile', component: ViewProfileComponent },   
    { path: 'edit-profile', component: EditProfileComponent },  
    {path: 'games-list', component: GamesListComponent}
];
