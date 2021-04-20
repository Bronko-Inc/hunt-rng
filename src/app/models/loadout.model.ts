export abstract class Loadout {
  public name: string;
  public imagePath: string;
  public price: number;
  public locked: boolean;

  constructor(name: string, imagePath: string, price: number) {
    this.name = name;
    this.imagePath = imagePath.toLowerCase();
    this.price = price;
    this.locked = false;
  }

  public lock() {
    this.locked = !this.locked;
  }
}
