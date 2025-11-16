export interface Category {
  id: string
  name: string
  group: string
}

export const categories: Category[] = [
  { id: "groceries", name: "Groceries", group: "everyday" },
  { id: "dining", name: "Dining & Food", group: "everyday" },
  { id: "fuel", name: "Fuel", group: "transport" },
  { id: "online", name: "Online Shopping", group: "ecommerce" },
  { id: "utilities", name: "Utilities", group: "bills" },
  { id: "travel_dom", name: "Domestic Travel", group: "travel" },
  { id: "travel_intl", name: "International Travel", group: "travel" },
  { id: "rent_education", name: "Rent / Education", group: "bills" },
  { id: "other", name: "Other", group: "other" }
];
