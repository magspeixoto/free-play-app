import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GamesList } from '../interfaces/games-list';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private games: Array<GamesList> = []

  private apiUrl = 'http://localhost:3000'; // Base URL of json-server

  constructor(private http: HttpClient) {}

  // Fetch the profile data from json-server
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`);
  }

  getGames(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/games`)
  }
}
