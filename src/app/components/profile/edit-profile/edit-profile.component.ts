import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profile: any;
  isEditing: { [key: string]: boolean } = {
    name: false,
    email: false,
    password: false
  };

  dataService = inject(DataService);

  ngOnInit() {
    this.dataService.getProfile().subscribe({
      next: (data) => {
        this.profile = { ...data };
      },
      error: (error) => {
        console.log('Failed to load profile:', error);
      }
    });
  }

  toggleEdit(field: string) {
    this.isEditing[field] = !this.isEditing[field];
  }

  saveProfile() {
    this.dataService.updateProfile(this.profile).subscribe({
      next: () => {
        console.log('Profile updated successfully');
      },
      error: (error) => {
        console.log('Error updating profile:', error);
      }
    });
  }

  deleteAvatar() {
    this.profile.avatar = null;
  }
}
