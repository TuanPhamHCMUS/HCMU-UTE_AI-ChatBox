export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
}
