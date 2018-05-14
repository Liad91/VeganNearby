import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';

@Component({
  selector: 'vn-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PaginationComponent implements OnChanges {
  @Input() public totalItems: number;
  @Input() public currentPage: number;
  @Input() public itemsPerPage: number;
  @Input() public paginationLength = 5;
  @Output() public pageChange = new EventEmitter<number>();
  public pages: number[];
  public totalPages: number;

  ngOnChanges() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.setPage(this.currentPage);
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
        start = this.totalPages - (this.paginationLength - 1);
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
  }

  public onPageChange(page: number) {
    if (this.currentPage !== page && page > 0 && page <= this.totalPages) {
      this.setPage(page);
      this.pageChange.emit(page);
    }
  }
}
