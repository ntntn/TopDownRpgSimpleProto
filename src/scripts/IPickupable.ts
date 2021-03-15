import { Player } from "./Player";

// declare interface IPickupable {
//     item: Item;
//     pickUp(player: Player)
// }

export interface IPickupable {
    item: Item;
    pickUp(player: Player)
}

export interface Item {
    use(): Item;
    iconTexture: string;
}