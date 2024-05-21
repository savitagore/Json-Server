import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  age: number;
  state?: string[];
  country?: string[];
  addressType: string;
  address1?: string;
  address2?: string;
  companyAddress1?: string;
  companyAddress2?: string;
  tags: string[];
  subscribe: boolean;
  images: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  userForm: FormGroup;
  addressType: string = 'Home';
  selectedFile: File | null = null;
  tags: string[] = [];
  tooltipValue: number = 0;
  countries: string[] = ['USA', 'Canada'];
  states: string[] = [];

  constructor(private fb: FormBuilder, private regSer: RegisterService, private http: HttpClient) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{1,20}$')]],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      number: ['', Validators.required],
      age: [0, Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      addressType: ['Home', Validators.required],
      address1: [''],
      address2: [''],
      companyAddress1: [''],
      companyAddress2: [''],
      tags: [''],
      subscribe: [false]
    });

    this.userForm.get('age')?.valueChanges.subscribe(value => {
      this.tooltipValue = value;
    });

    this.userForm.get('country')?.valueChanges.subscribe(selectedCountry => {
      this.onCountryChange(selectedCountry);
    });
  }

  ngOnInit(): void {}

  get firstName() {
    return this.userForm.get('firstName');
  }

  updateTooltip(event: any): void {
    this.tooltipValue = event.target.value;
  }

  onCountryChange(country: string): void {
    switch (country) {
      case 'USA':
        this.states = ['California', 'Texas', 'New York'];
        break;
      case 'Canada':
        this.states = ['Ontario', 'Quebec', 'British Columbia'];
        break;
      default:
        this.states = [];
        break;
    }
    this.userForm.get('state')?.setValue('');
  }

  onAddressTypeChange(): void {
    this.addressType = this.userForm.get('addressType')?.value;
  }

  get user() {
    return this.userForm.controls;
  }

  addInterest() {
    const newInterest = this.userForm.get('tags')?.value.trim();
    if (newInterest !== '') {
      this.tags.push(newInterest);
      this.userForm.get('tags')?.patchValue('');
    }
  }

  removeInterest(interest: string) {
    const index = this.tags.indexOf(interest);
    if (index !== -1) {
      this.tags.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      this.regSer.addRegister(user).subscribe(newUser => {
        alert("Registration Successful");
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        if (img.width === 310 && img.height === 325) {
          this.selectedFile = file;
        } else {
          alert('Please upload an image with dimensions 310x325 pixels.');
          input.value = '';
        }
      };
    }
  }
}
