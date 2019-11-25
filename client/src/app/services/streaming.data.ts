
export interface streamresponse {
    chunk: number[]
    totalchunks: number
    bitdepth: number
    samplerate: number
    channels: number
}

export const playablebuffercount = 50