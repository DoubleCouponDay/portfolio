import { portfolioapi, randomdeserttrackroute } from './environment.data';

export const baseroute = "http://localhost:60257/api"

export const api: portfolioapi = {
    getrandomtrack: `${baseroute}/${randomdeserttrackroute}`
}

