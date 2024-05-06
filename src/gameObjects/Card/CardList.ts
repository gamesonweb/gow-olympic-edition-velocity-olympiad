import {ICard} from "./ICard";

export class CardList extends Array {
    constructor() {
        super();
    }

    push(...items: ICard[]) {
        return super.push(...items);
    }
}


