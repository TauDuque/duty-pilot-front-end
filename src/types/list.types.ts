export interface List {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateListInput {
  name: string;
}

export interface UpdateListInput {
  name: string;
}

