import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GamesListComponent } from './components/games-list/games-list.component';
import { NavigationComponent } from "./navigation/navigation.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, GamesListComponent, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FreePlay';
}
