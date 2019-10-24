import { portfolioapi, randomdeserttrackroute } from './environment.data';

export const baseroute = "localhost:4200"

export const api: portfolioapi = {
    getrandomtrack: `${baseroute}/${randomdeserttrackroute}`
}

