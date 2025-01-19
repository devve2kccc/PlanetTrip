export interface Travel {
    id?: string;
    description: string;
    type: string;
    state: string;
    startAt: Date | null;
    endAt: Date | null;
    createdBy: string;
    isFav: boolean;
    locations?: Location[]; 
    comments?: TravelComment[];
}

export interface Location {
    id?: string;
    travelId: string;
    description: string;
    type: string;
    state: string;
    map: string;
}

export interface Comment {
    id?: string;
    comment: string;
}

export interface TravelComment {
    id?: string;
    travelId?: string; // Optional for travel comments
    locationId?: string; // Optional for location comments
    comment: string;
    createdAt: Date;
  }