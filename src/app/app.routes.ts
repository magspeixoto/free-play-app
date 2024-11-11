import { Routes } from '@angular/router';
import { ViewProfileComponent } from './components/profile/view-profile/view-profile.component';
import { GamesListComponent } from './components/games-list/games-list.component';


export const routes: Routes = [
    { path: 'profile', component: ViewProfileComponent },     
    {path: 'games-list', component: GamesListComponent}
];
