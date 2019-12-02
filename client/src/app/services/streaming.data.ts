
export interface streamresponse {
    chunk: string
    totalchunks: number
    bitdepth: number
    samplerate: number
    channels: number
    encoding: string
}

export const playablebuffercount = 5
export const bufferdelay = 5
export const millisecond = 1000