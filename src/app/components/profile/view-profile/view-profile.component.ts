import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, EditProfileComponent, RouterLink], // Add HttpClientModule
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  profile: any;

  constructor(private router: Router) {}
  dataService = inject(DataService);

  ngOnInit(){
    //this.animais = this.animaisService.getAnimais();
    this.dataService.getProfile().subscribe({
      next: (data) => {
        console.log(data);
        this.profile = data;
      },
      error: (error) => {
        console.log('Algo correu mal:', error);
      }

    });
  }

  navigateToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }
}
