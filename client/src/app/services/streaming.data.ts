
export interface streamresponse {
    binarystring: string
    totalchunks: number
    bitdepth: number
    samplerate: number
    channels: number
    encoding: string
}

export const playablebuffercount = 1
export const bufferdelay = 0.006
export const musicvolume = 0.7
export const millisecond = 1000