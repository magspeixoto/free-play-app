import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamesList } from '../../interfaces/games-list';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.scss'
})
export class GamesListComponent {
  games: GamesList | undefined;

  
}
