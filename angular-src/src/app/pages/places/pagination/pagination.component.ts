import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { PaginationState } from './../places.model';

@Component({
  selector: 'vn-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnChanges {
  @Input() public totalItems: number;
  @Input() public state: PaginationState;
  @Input() public paginationLength = 5;
  @Output() public pageChange = new EventEmitter<number>()
  public pages: number[];
  public totalPages: number;

  ngOnChanges() {
    this.totalPages = Math.ceil(this.totalItems / this.state.itemsPerPage);
    this.setPage(this.state.currentPage);
  }

  private setPage(page: number) {
    const pages: number[] = [];
    let start: number;
    let end: number;

    if (this.totalPages <= this.paginationLength) {
      start = 1;
      end = this.totalPages;
    }
    else {
      if (page <= Math.ceil(this.paginationLength / 2)) {
        start = 1;
        end = this.paginationLength;
      }
      else if (page + Math.floor(this.paginationLength / 2) >= this.totalPages) {
        start = this.totalPages - this.paginationLength - 1;
        end = this.totalPages;
      }
      else {
        start = page - (Math.floor(this.paginationLength / 2));
        end = page + (Math.floor(this.paginationLength / 2));
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    this.pages = pages;
    this.state.currentPage = page;
  }

  public onPageChange(page: number) {
    if (this.state.currentPage !== page) {
      this.setPage(page)
      this.pageChange.emit(page);
    }
  }
}
