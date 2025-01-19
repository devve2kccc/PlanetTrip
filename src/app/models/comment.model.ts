export interface Comment {
  id?: string;
  travelId?: string; // Optional for travel comments
  locationId?: string; // Optional for location comments
  comment: string;
  createdAt: Date;
  }