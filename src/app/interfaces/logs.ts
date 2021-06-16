export interface Logs {
    number: string
    type: number
    date: Date
    duration: number
    name: string
    messageSent: boolean
    photo?: string
    new?: number
    cachedName: string
    cachedNumberType?: number
    cachedNumberLabel?: string
    phoneAccountId?: string
    viaNumber?: string
    contact?: string
    thumbPhoto?: string
    history?:any
    expanded?:boolean
}