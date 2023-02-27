import { FieldValue } from 'firebase/firestore'
type Dormitory = 'sareum' | 'chungwoon'

type QueuedMusic = {
  id?: string
  title: string
  artist: string
  user: string
  userName: string
  appliedOn: Date
}

type PlayedMusic = QueuedMusic & { playedOn: Date }

type CensoredMusic = QueuedMusic & { censoredOn: Date; reason: string }

type ReveilleConfig = {
  bannedUsers: { [k: string]: Timestamp }
  maxReveilleApplies: { default: number; [k: string]: number }
  playsPerDay: { sareum: number; chungwoon: number }
}
