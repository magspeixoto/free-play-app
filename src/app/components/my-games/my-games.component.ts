import { RouterLink } from '@angular/router';
import { GamesList } from '../../interfaces/games-list';
import { DataService } from '../../services/data.service';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-games',
  standalone: true,
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, FormsModule],
  templateUrl: './my-games.component.html',
  styleUrl: './my-games.component.scss'
})
export class MyGamesComponent implements AfterViewInit, OnInit {
  games: GamesList[] = []
  displayedColumns: string[] = ['id', 'thumbnail', 'title', 'genre']
  dataSource: MatTableDataSource<GamesList>;

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  //constructor(private dataService: DataService) {
    // Assign the data to the data source for the table to render
  //  this.dataSource = new MatTableDataSource<GamesList>()
  //}
  constructor(private dataService: DataService) {}

  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(){
    this.dataService.getGames().subscribe({
      next: (data) => {
        this.games = data;
        this.dataSource = new MatTableDataSource(this.games);  // Cria o dataSource após os dados carregarem
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => console.log('Erro ao carregar dados: ', error)
    });
  }    
}

