import { PrismaClient } from '@prisma/client'
import * as interface_ from "../../interface";
const db = new PrismaClient()

export const createEvent = async (events: any) =>{
    try {
        const title: string = events.name
        const query = await db.events.findUnique({
            where: {
                name: title
            }
        })
        if (query) {
            return false
        }
        const event = await db.events.create({
            data: {
                name: title,
                country: events.country,
                logo_img: events.logo_img,
                distance: parseInt(events.distance),
                org_id: parseInt(events.org_id)
            }
        })
        return true
    } catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}

export const editEvent = async (event: any, id: string) => {
  try {
    await db.events.update({
      where: {
        id: parseInt(id)
      },
      data: {
        ...event,
      },
    });
    return {
      status: true
    }
  } catch (error) {
    console.log("error", error);
    return { status: "error", error };
  }
};

export const eventYear = async (id:any) =>{
    try{
        const events: any = await db.races.findUnique({
            where: {
                id: parseInt(id.id)
            }
        })

        return {
            race :events
        }
    }  catch (error) {
        console.log('error',error)
        return { status: 'error', error}
    } 
}




export const eventFilter = async (query: {
    country?: string;
    distance?: string;
    year?: string;
    title?: string;
    org_id?: string;
    min?: string;
    max?: string;
  }) => {
    try {
      const filterQuery: interface_.ObjectSort = {};
      const racetFilter: interface_.ObjectSort = {};
      const filterbyDistance: interface_.ObjectSort = {};
      const minDistance = query.min;
      const MinD = minDistance;
      const maxDistance = query.max;
      const MaxD = maxDistance;
      if (query.country) {
        filterQuery["country"] = query.country;
      }
      if (query.org_id) {
        filterQuery["org_id"] = parseInt(query.org_id);
      }
      if (query.distance) {
        filterQuery["distance"] = parseInt(query.distance);
        if (query.year) {
          if (query.year.trim() !== "") {
            racetFilter["date"] = {
              contains: query.year,
              mode: "insensitive",
            };
          }
        }
        if (query.title) {
          if (query.title.trim() !== "") {
            filterQuery["name"] = {
              contains: query.title,
              mode: "insensitive",
            };
          }
        }
      }
      if (query.min && query.max) {
        filterbyDistance["distance"] = {
          lte: parseInt(query.max),
          gte: parseInt(query.min),
        };
      }
      const events = await db.events.findMany({
        where: {
          ...(Object.keys(racetFilter).length > 0 && {
            Races: {
              some: {
                ...racetFilter,
              },
            },
          }),
          ...(Object.keys(filterQuery).length > 0 && filterQuery),
          ...(Object.keys(filterbyDistance).length > 0 && filterbyDistance),
        },
      });
      return events;
    } catch (error) {
      console.log("error", error);
      return { status: "error", error };
    }
  };