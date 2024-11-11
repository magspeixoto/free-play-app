import { Routes } from '@angular/router';
import { GamesListComponent } from './components/games-list/games-list.component';
import { GamesDetailsComponent } from './games-details/games-details.component';

export const routes: Routes = [
    {path:'games-list', component: GamesListComponent},
    {path:'games-details', component: GamesDetailsComponent}


];
