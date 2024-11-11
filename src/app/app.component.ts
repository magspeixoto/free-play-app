import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ViewProfileComponent } from './components/profile/view-profile/view-profile.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, RouterLink, RouterLinkActive, ViewProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FreePlay';
}
