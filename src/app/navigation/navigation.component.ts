import { Component } from '@angular/core';
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
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  searchTerm: string = '';  // Bind to the input field
  games: GamesList[] = [];  // Store the list of games
  filteredGames: GamesList[] = [];  // Store the filtered results
  isLoading: boolean = false;  // For loading state

  constructor(private dataService: DataService) {}

  // Fetch games from the service and filter based on search term
  searchGames(): void {
    if (!this.searchTerm.trim()) return;  // Avoid searching if the input is empty
  
    this.isLoading = true;  // Set loading to true while fetching data
    this.dataService.getGames().subscribe({
      next: (games) => {
        this.games = games;  // Store the list of games
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




