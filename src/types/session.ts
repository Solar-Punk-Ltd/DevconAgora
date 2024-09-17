export interface Session {
    id: string
    sourceId: string
    eventId: string
    title: string
    description: string
    track: string
    type: string
    expertise: string
    featured?: boolean
    tags: string
    speakers: string
    resources_slides?: string
    slot_start?: string
    slot_end?: string
    slot_roomId?: string
    sources_ipfsHash?: string
    sources_youtubeId?: string
    sources_swarmHash?: string
    duration: string
    language: string
}