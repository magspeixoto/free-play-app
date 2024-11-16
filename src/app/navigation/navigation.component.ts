import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';
import { GamesList } from '../interfaces/games-list';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  searchTerm: string = '';  // Bind to the input field
  games: GamesList[] = [];  // Store the list of games
  filteredGames: GamesList[] = [];  // Store the filtered results
  isLoading: boolean = false;  // For loading state
  userProfile: any = null;  // Store user profile info

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Carregar o perfil do usuário do localStorage
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    this.userProfile = JSON.parse(savedProfile);
  }
  }

  // Fetch games from the service and filter based on search term
  searchGames(): void {
    if (!this.searchTerm.trim()) return;  // Avoid searching if the input is empty
  
    this.isLoading = true;  // Set loading to true while fetching data
    this.dataService.getGames().subscribe({
      next: (data) => {
        this.games = data;  // Store the list of games
        this.filteredGames = this.games.filter(game => 
          game.title.toLowerCase().includes(this.searchTerm.toLowerCase())  // Use game.name
        );
        console.log('Filtered games:', this.filteredGames);  // Log filtered games to verify the results
        this.isLoading = false;  // Reset loading state after data is fetched
      },
      error: (err) => {
        console.error('Error fetching games:', err);
        this.isLoading = false;
      }
    });
  }
}
