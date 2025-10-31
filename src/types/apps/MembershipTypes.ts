export interface IMembership {
    id: number
    name: string
    email?: string
    user_id?: number
    contact_phone?: string | null
    fee_percentage?: number | null
}