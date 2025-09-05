import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../Models/FilterPipe';
@NgModule({
  declarations: [FilterPipe],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, FilterPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class SharedModule {}