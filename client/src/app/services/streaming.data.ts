
export interface streamresponse {
    chunk: string
    totalchunks: number
    bitdepth: number
    samplerate: number
    channels: number
}

export const playablebuffercount = 5
export const bufferdelay = 5
export const millisecond = 1000