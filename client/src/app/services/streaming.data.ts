
export interface streamresponse {
    chunk: string
    totalchunks: number
    bitdepth: number
    samplerate: number
    channels: number
    encoding: string
}

export const playablebuffercount = 3
export const bufferdelay = 0.006
export const millisecond = 1000