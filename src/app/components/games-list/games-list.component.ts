import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamesList } from '../../interfaces/games-list';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.scss'
})
export class GamesListComponent {
  games: Array<any> = []
  

  constructor(private dataService: DataService){
  }

  ngOnInit(){
    this.getGames()
  }

  getGames(){
    this.dataService.getGames().subscribe({
      next: (data) => {
        console.log(data);
        this.games = data;
        
      }, error: (error) => {
        console.log('Deu erro ', error);
      }
    })
  }



  
}
