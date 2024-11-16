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

  moveGame(gameId: string, targetList: string) {
    if (!this.profile) return;
  
    // Encontre a lista de origem, onde o jogo está atualmente
    const currentList = this.profile.lists.find((list: any) => list.gamesIds.includes(gameId));
    console.log('Lista atual do jogo:', currentList); // Log para depuração
  
    // Encontre o índice da lista de destino no perfil
    const targetListIndex = this.profile.lists.findIndex((list: any) => list.name === targetList);
    console.log('Índice da lista de destino:', targetListIndex); // Log para depuração
  
    // Verifica se a lista de origem e a lista de destino foram encontradas
    if (!currentList) {
      console.warn('Lista de origem não encontrada para o jogo ID:', gameId);
      return;
    }
  
    if (targetListIndex === -1) {
      console.warn('Lista de destino não encontrada:', targetList);
      return;
    }
  
    // Remover o jogo da lista atual (se encontrado)
    const currentGameIndex = currentList.gamesIds.indexOf(gameId);
    if (currentGameIndex !== -1) {
      currentList.gamesIds.splice(currentGameIndex, 1); // Remove o jogo
    }
  
    // Adicionar o jogo à lista de destino
    const targetListObj = this.profile.lists[targetListIndex];
    targetListObj.gamesIds.push(gameId); // Adiciona o ID do jogo à lista de destino
  
    console.log('Lista de destino após adição:', targetListObj); // Log para depuração
  
    // Salve o perfil atualizado no localStorage
    localStorage.setItem('userProfile', JSON.stringify(this.profile));
  
    // Recarregar a lista de jogos após mover o jogo
    this.loadGames(this.listFilter);
  }
}
