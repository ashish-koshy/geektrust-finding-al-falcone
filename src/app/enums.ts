export enum FindFalconeApiStatus {
    tokenExpired = 'Token not initialized. Please get a new token with the /token API',
    success = 'success',
    failure = 'false'
};

export enum FindFalconeUiStatus {
    success = 'Al Falcone has been found...King Shan is mighty pleased!',
    failure = 'Al Falcone was not found...King Shan is disappointed!',
    reset = `You can click on Al Falcone's head at the top to try your luck again!`
};

export enum ApiPaths {
    findFalcone = 'find',
    getVehicles = 'vehicles',
    getPlanets = 'planets',
    getToken = 'token'
}

export enum UiRoutes {
    home = '',
    result = 'result'
};

export enum ApiSourceType {
    default = 'herokuapp.com',
    fallback = 'ashishkoshy.me'
};

export enum ResultParameters {
    success = 'success',
    planetFound = 'planetFound',
    timeTaken = 'timeTaken',
    emptyResult = ''
};

export enum PageSections {
    top = 'top',
    convoy = 'convoy',
    planets = 'planets',
    vehicles = 'vehicles'
}