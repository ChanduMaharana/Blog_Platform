import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Postlist } from '../../core/postlist/postlist';
import { Ad } from '../../core/ad/ad';
import { Header } from "../../core/header/header";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Postlist, Ad],
  templateUrl: './home.html',
})
export class Home {}
