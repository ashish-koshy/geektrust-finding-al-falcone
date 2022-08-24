import { HttpErrorResponse } from '@angular/common/http';

export type FalconePlanet = {
    name: string;
    distance: number;
    imageUrl: string;
};

export type FalconeVehicle = {
    name: string;
    total_no: number;
    available_no: number;
    max_distance: number;
    speed: number;
};

export type FindFalconeRequest = {
    token?: string;
    planet_names: string[];
    vehicle_names: string[];
}

export type FindFalconeResponse = {
    planet_name: string;
    status: string;
};

export type GetTokenResponse = {
    token: string;
};

export type FalconeSearch = {
    loading: boolean,
    planets: FalconePlanet[],
    vehicles: FalconeVehicle[], 
    request: FindFalconeRequest,
    response: FindFalconeResponse,
    error?: HttpErrorResponse
};

export type ConvoySelection = {
    currentIndex: number | undefined,
    planetSelection: Map<string, string>;
    vehicleSelection: Map<string, string>;
}
