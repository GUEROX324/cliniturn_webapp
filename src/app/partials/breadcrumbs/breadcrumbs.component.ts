import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  public items: string[] = ['Inicio', 'Dashboard'];

  constructor() {}

  ngOnInit(): void {
    console.log('BreadcrumbsComponent inicializado');
  }
}
