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
export class MyGamesComponent {
  games: Array<GamesList> = []
  displayedColumns: string[] = ['id', 'thumbnail', 'title', 'genre'];
  //dataSource = new MatTableDataSource<GamesList>(this.getGames());
  
  dataSource: GamesList[]

  /* @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; */

  /* constructor(private dataService: DataService){
    //this.dataSource = new MatTableDataSource(dataSource);
  } */
    constructor(private dataService: DataService){

    }

  /* ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } */

  /* applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } */

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
