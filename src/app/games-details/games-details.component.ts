import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GamesList } from '../interfaces/games-list';
import { DataService } from '../services/data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-games-details',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './games-details.component.html',
  styleUrl: './games-details.component.scss',
})
export class GamesDetailsComponent {
  game: GamesList | undefined;
  profile: any; // Perfil do usuário
  selectedList: string | undefined = undefined;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '5';

    // Carrega os detalhes do jogo
    this.dataService.getGame(id).subscribe({
      next: (data) => {
        console.log(data);
        this.game = data;
      },
      error: (error) => {
        console.error('Algo correu mal:', error);
      },
    });

    // Carrega o perfil do usuário para manipular listas
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      this.profile = JSON.parse(savedProfile);
    } else {
      this.dataService.getProfile().subscribe({
        next: (profile) => {
          this.profile = profile;
          localStorage.setItem('userProfile', JSON.stringify(this.profile));
        },
        error: (error) => console.error('Erro ao carregar o perfil:', error),
      });
    }
  }

  /**
   * Verifica as listas nas quais o jogo já está.
   */
  getGameLists(): string[] {
    if (!this.profile || !this.game || !this.game.id) return []; // Verificação adicional para garantir que `game` e `game.id` estão definidos

    return this.profile.lists
        .filter((list: any) => list.gamesIds.includes(this.game!.id)) // O operador `!` confirma ao TypeScript que `this.game.id` é definido aqui
        .map((list: any) => list.name);
  }

  /**
   * Retorna as listas disponíveis para adicionar o jogo.
   */
  availableLists(): { key: string; display: string }[] {
    const listMap: { [key: string]: string } = {
      later: 'Play Later',
      playing: 'Currently Playing',
      played: 'Played',
      completed: 'Completed',
    };

    return Object.keys(listMap)
      .filter((key) => !this.getGameLists().includes(listMap[key]))
      .map((key) => ({ key, display: listMap[key] }));
  }

  /**
   * Adiciona o jogo à lista selecionada.
   */
  addToList(gameId: number | undefined, listKey: string) {
    if (!gameId || !this.profile || !listKey) return;

    const listMap: { [key: string]: string } = {
      later: 'Play Later',
      playing: 'Currently Playing',
      played: 'Played',
      completed: 'Completed',
    };

    const targetList = this.profile.lists.find((list: any) => list.name === listMap[listKey]);

    if (!targetList) {
      alert('Lista inválida!');
      return;
    }

    // Adicionar o jogo à lista selecionada
    if (!targetList.gamesIds.includes(gameId)) {
      targetList.gamesIds.push(gameId);

      // Atualizar o perfil no localStorage
      localStorage.setItem('userProfile', JSON.stringify(this.profile));
      alert(`Jogo adicionado à lista: ${listMap[listKey]}`);

      // Atualiza a lista de jogos associadas
      this.selectedList = ''; // Limpa o campo de seleção
    } else {
      alert('O jogo já está nessa lista!');
    }
  }
}
