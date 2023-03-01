export type Dormitory = 'sareum' | 'chungwoon'

export type QueuedMusic = {
  id?: string
  title: string
  artist: string
  user: string
  userName: string
  appliedOn: Date
}

export type PlayedMusic = QueuedMusic & { playedOn: Date }

export type CensoredMusic = QueuedMusic & { censoredOn: Date; reason: string }

export type ReveilleConfig = {
  bannedUsers: { [k: string]: Timestamp }
  maxReveilleApplies: { default: number; [k: string]: number }
  playsPerDay: { sareum: number; chungwoon: number }
}
