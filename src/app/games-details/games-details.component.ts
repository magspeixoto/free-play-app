import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GamesList } from '../interfaces/games-list';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-games-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './games-details.component.html',
  styleUrl: './games-details.component.scss'
})
export class GamesDetailsComponent {

  game: GamesList | undefined;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute){}
  ngOnInit() {
    //buscar info do id epassarpor rota
    /* console.log(this.route.snapshot.paramMap.get('id')) */
    const id = this.route.snapshot.paramMap.get('id') || '5';
    

    this.dataService.getGame(id).subscribe({
      next: data => {
        console.log(data);
        this.game = data;
      },
      error: error => {
        console.error('Algo correu mal:', error)
      }
    })
}


}