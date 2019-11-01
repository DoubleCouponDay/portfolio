

export const volumedecrement = 0.01
export const volumeincrement = volumedecrement * 2
export const maxvolume  = 1

export const gratingsoundaddress = 'assets/stone-grinding.mp3'
export const drawbridgesoundaddress = 'assets/drawbridge.flac'
export const tabletsoundaddress = 'assets/tabletscraping.mp3'

export interface streamresponse {
    stream: ArrayBuffer,
    filename: string,
    filetype: string
}