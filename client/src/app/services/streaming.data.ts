
export interface streamresponse {
    chunk: number[]
    totalchunks: number
    bitdepth: number
    samplerate: number
    channels: number
}

export const playablebuffercount = 2
export const bufferdelay = 5
export const millisecond = 1000

export interface playablechunk {
    chunk: AudioBufferSourceNode
    time: number
    volume: GainNode
}