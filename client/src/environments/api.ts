import { portfolioapi, randomdeserttrackroute } from './environment.data';

export const baseroute = "http://localhost:5000"

export const api: portfolioapi = {
    getrandomtrack: `${baseroute}/${randomdeserttrackroute}`
}

