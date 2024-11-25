export type ItemType = "player" | "backer";

export interface Item {
  id: string;
  name: string;
  lastSession: string;
}

export interface TabContentProps {
  type: ItemType;
  items: Item[];
}

