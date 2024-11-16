import { RouterLink } from '@angular/router';
import { GamesList } from '../../interfaces/games-list';
import { DataService } from '../../services/data.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-my-games',
  standalone: true,
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, FormsModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.scss'
})
export class MyGamesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'thumbnail', 'title', 'genre', 'menu'];
  dataSource = new MatTableDataSource<any>();
  profile: any; // Perfil do usuário
  listFilter: string = ''; // Tipo de lista atual

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Carrega o perfil do usuário
    this.dataService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loadGames('later'); // Carrega a lista padrão (Play Later)
      },
      error: (error) => console.error('Erro ao carregar o perfil: ', error),
    });
  }

  ngAfterViewInit() {
    // Configura paginator e sort após a inicialização do DOM
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadGames(listType: string) {
    // Define o tipo de lista a ser carregado
    this.listFilter = listType;
  
    // Mapeia os nomes das listas para os tipos internos
    const listMap: { [key: string]: string } = {
      later: 'Play Later',
      playing: 'Currently Playing',
      played: 'Played',
      completed: 'Completed',
    };
  
    const selectedList = this.profile?.lists.find((list: any) => list.name === listMap[listType]);
    if (!selectedList) {
      console.warn('Lista não encontrada:', listType);
      this.dataSource.data = [];
      return;
    }
  
    // Obtém os IDs dos jogos
    const gameIds = selectedList.gamesIds;
    console.log('Carregando jogos para a lista:', gameIds);
  
    // Requisição para buscar os jogos
    this.dataService.getGamesByIds(gameIds).subscribe({
      next: (games: any[]) => { // Esperamos que a resposta seja um array de jogos diretamente
        console.log('Jogos carregados:', games);
        this.dataSource.data = games;
  
        // Reconfigure o paginator se os dados forem atualizados após a exibição
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
      error: (error) => console.error('Erro ao carregar os jogos:', error),
    });
  }
}