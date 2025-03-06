import { prisma } from "../libs/prisma"

 export interface IListingsParams {
    userId?: string
}

export default async function getListings(
    params: IListingsParams
) {
    try {
        const { userId } = await params

        let query: any = {}

        if (userId) {
            query.userId = userId
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        })

        return listings
    } catch (error: any) {
        throw new Error(error)
    }
}


