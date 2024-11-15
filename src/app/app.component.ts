import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ViewProfileComponent } from './components/profile/view-profile/view-profile.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GamesListComponent } from './components/games-list/games-list.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { NavigationComponent } from "./navigation/navigation.component";
import { MyGamesComponent } from './components/my-games/my-games.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, RouterLink, RouterLinkActive, ViewProfileComponent, GamesListComponent,NavigationComponent, EditProfileComponent, MyGamesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FreePlay';
}
