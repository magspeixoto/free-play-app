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
      console.log('Perfil carregado do localStorage:', this.profile); // Log do perfil
      this.loadGames('all'); // Carrega todos os jogos no início
    } else {
      // Carrega do back-end se não houver dados locais
      this.dataService.getProfile().subscribe({
        next: (profile) => {
          this.profile = profile;
          console.log('Perfil carregado do backend:', this.profile); // Log do perfil carregado do backend
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
  
    const selectedListName = listMap[listType];
  
    // Tenta encontrar a lista correspondente no perfil
    const selectedList = this.profile?.lists.find((list: any) => list.name === selectedListName);
  
    if (!selectedList && listType !== 'all') {
      console.warn('Lista não encontrada:', selectedListName);
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
  
  

  moveGame(gameId: string, targetListName: string) {
    if (!this.profile) return;
  
    // Mapeamento dos nomes das listas para correspondência exata com o perfil do usuário
    const listMap: { [key: string]: string } = {
      later: 'Play Later',
      playing: 'Currently Playing',
      played: 'Played',
      completed: 'Completed',
    };
  
    // Obter o nome correto da lista de destino a partir do mapeamento
    const targetListCorrectName = listMap[targetListName];
  
    // Verifica se a lista de destino existe no perfil
    const targetList = this.profile.lists.find((list: any) => list.name === targetListCorrectName);
  
    if (!targetList) {
      console.warn('Lista de destino não encontrada:', targetListCorrectName);
      return;
    }
  
    // Encontrar o jogo em todas as listas e removê-lo da lista atual
    let gameFoundAndRemoved = false;
    this.profile.lists.forEach((list: any) => {
      const gameIndex = list.gamesIds.indexOf(gameId);
      if (gameIndex !== -1) {
        // Remover o jogo da lista atual
        list.gamesIds.splice(gameIndex, 1);
        gameFoundAndRemoved = true;
      }
    });
  
    if (!gameFoundAndRemoved) {
      console.warn('Jogo não encontrado nas listas do perfil');
      return;
    }
  
    // Adicionar o jogo à lista de destino
    targetList.gamesIds.push(gameId);
  
    // Atualizar o localStorage com o novo perfil
    localStorage.setItem('userProfile', JSON.stringify(this.profile));
  
    // Recarregar a lista de jogos para refletir a mudança
    this.loadGames(this.listFilter); // Atualiza a lista de jogos exibida
  }
  
}
