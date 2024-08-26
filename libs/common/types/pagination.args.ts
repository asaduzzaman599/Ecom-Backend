export class PaginationArgs {
  readonly page: number = 1;
  readonly limit: number = 10;
  readonly search: string = null;
}

export class NonPaginationArgs {
  readonly search: string = null;
}
