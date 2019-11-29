
export interface streamresponse {
    chunk: number[] //actually an arraybuffer
    totalchunks: number
    bitdepth: number
    samplerate: number
    channels: number
    encoding: string
}

export const playablebuffercount = 1
export const bufferdelay = 0.007
export const musicvolume = 0.7