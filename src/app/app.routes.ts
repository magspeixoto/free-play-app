import { Routes } from '@angular/router';
import { ViewProfileComponent } from './components/profile/view-profile/view-profile.component';
import { GamesListComponent } from './components/games-list/games-list.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';

import { GamesDetailsComponent } from './games-details/games-details.component';
import { MyGamesComponent } from './components/my-games/my-games.component';

export const routes: Routes = [
    {path: 'profile', component: ViewProfileComponent },   
    {path: 'edit-profile', component: EditProfileComponent },  
    {path:'games-list', component: GamesListComponent},
    {path:'games-details', component: GamesDetailsComponent},
    {path:'my-games', component: MyGamesComponent}



];
