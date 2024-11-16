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
  styleUrls: ['./my-games.component.scss']
})
export class MyGamesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'thumbnail', 'title', 'genre', 'menu'];
  dataSource = new MatTableDataSource<any>();
  profile: any = null; // Perfil do usuário
  listFilter: string = ''; // Tipo de lista atual

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      this.profile = JSON.parse(savedProfile);
      this.loadGames('all'); // Carrega todos os jogos no início
    } else {
      // Carrega do back-end se não houver dados locais
      this.dataService.getProfile().subscribe({
        next: (profile) => {
          this.profile = profile;
          localStorage.setItem('userProfile', JSON.stringify(this.profile));
          this.loadGames('all');
        },
        error: (error) => console.error('Erro ao carregar o perfil:', error),
      });
    }
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
    this.listFilter = listType; // Atualiza o filtro de lista

    // Mapeia os nomes das listas no JSON para os botões
    const listMap: { [key: string]: string } = {
      later: 'Play Later',
      playing: 'Currently Playing',
      played: 'Played',
      completed: 'Completed',
      all: 'All', // Para carregar todos os jogos
    };

    const selectedList = this.profile?.lists.find((list: any) => list.name === listMap[listType]);

    if (!selectedList && listType !== 'all') {
      console.warn('Lista não encontrada:', listType);
      this.dataSource.data = [];
      return;
    }

    // Para 'all', busca todos os jogos associados ao perfil
    const gameIds = listType !== 'all' ? selectedList?.gamesIds : this.profile?.lists.flatMap((list: any) => list.gamesIds);

    // Filtra os jogos no JSON com base nos IDs
    this.dataService.getGames().subscribe({
      next: (gamesList: any[]) => {
        const filteredGames = gamesList.filter(game => gameIds.includes(game.id));
        this.dataSource.data = filteredGames;

        // Reconfigura o paginator se os dados forem atualizados após a exibição
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
      error: (error) => console.error('Erro ao carregar os jogos:', error),
    });
  }

  moveGame(gameId: number, targetList: string) {
    if (!this.profile) return;

    // Lógica para mover o jogo para outra lista
    const gameIndex = this.profile.lists.findIndex((list: any) => list.name === targetList);
    if (gameIndex !== -1) {
      this.profile.lists[gameIndex].gamesIds.push(gameId);
    }

    // Salva no localStorage
    localStorage.setItem('userProfile', JSON.stringify(this.profile));
    this.loadGames(this.listFilter); // Atualiza a lista após mover o jogo
  }
}
