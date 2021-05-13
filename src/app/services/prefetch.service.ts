import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrefetchService {
  private readonly _list: { path: string; loaded: () => void; cached: boolean }[] = [];
  private _fullList: string[] = [];
  private _totalCount: number = 0;

  public init(allPaths: string[]) {
    this._fullList = allPaths;
    this._totalCount = allPaths.length;
  }

  public prefetch(path: string) {
    if (!this._list.some((x) => x.path === path)) {
      const newItem = {
        path,
        loaded: () => {
          newItem.cached = true;
          if (!this._list.some((x) => !x.cached) && this._fullList.length > 0) {
            this.prefetch(this._fullList.pop()!);
          }
          console.log(
            `prefetching images: ${Math.floor(
              (this._list.filter((x) => x.cached).length / this._totalCount) *
                100
            )}%`
          );
        },
        cached: false,
      };
      this._list.push(newItem);
    } else {
      if (!this._list.some((x) => !x.cached) && this._fullList.length > 0) {
        this.prefetch(this._fullList.pop()!);
      }
    }
  }

  public isCached(path: string) {
    return this._list.some((x) => x.path === path && x.cached);
  }

  public get preloadData() {
    return this._list;
  }
}
