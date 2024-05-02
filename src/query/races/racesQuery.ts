import { PrismaClient } from "@prisma/client";
import console from "console";
import { calculateScore } from "../../function/calculate";
import * as interface_ from "../../interface";
import { paceAvg } from "../runner/queryrunner";
const db = new PrismaClient();

export const createRace = async (race: any, query: any) => {
  try {
    const title: string = race.name;
    const queryname = await db.races.findUnique({
      where: {
        name: title,
      },
    });
    if (queryname) {
      return {
        Message: "Race name is already exist",
        status: false,
      };
    }
    const races = await db.races.create({
      data: {
        org_id: parseInt(query.org),
        event_id: parseInt(query.event),
        name: race.name,
        date: new Date(race.date),
        state: race.state,
        start_time: race.start_time,
        distance: parseInt(race.distance),
        logo_img: race.logo_img,
        cover_img: race.cover_img,
      },
    });
    return {
      status: true,
      races,
    };
  } catch (error) {
    console.log("error", error);
    return { status: "error", error };
  }
};
export const editRace = async (race: any, id: string) => {
  try {
    if (race.date) {
      race.date = new Date(race.date);
    }
    await db.races.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...race,
      },
    });
    return {
      status: true,
    };
  } catch (error) {
    console.log("error", error);
    return { status: "error", error };
  }
};

export async function uploadDataToRaces(
  db: PrismaClient,
  raceId: string,
  dataRace_result: interface_.ExcelUploadRuner[]
) {
  try {
    const dataConvert = dataRace_result.map((item, i) => {
      var name = item.Name.split(" ");
      const firstname: string = name[0];
      const lastname: string = name[1];
      return {
        Races_id: parseID(raceId),
        rank: item.Rank,
        time: item.Gun_Time,
        firstname: firstname,
        lastname: lastname,
        gender: item.Gender,
        age_group: item.Age_Group,
        nationality: item.Nationality,
      };
    });

    const updateData = await db.race_result.createMany({
      data: dataConvert,
    });
    if (updateData.count !== 0) {
      return {
        status: true,
      };
    }
    return {
      status: false,
    };

    function parseID(id: string) {
      return Number.parseInt(id, 10);
    }
  } catch (error) {
    console.log("error", error);
    return { status: "error", error };
  }
}

export const queryRunner = async (query: any) => {
  try {
    var runner: any = [];
    const filterQuery: interface_.ObjectSort = {};

    if (query.name) {
      filterQuery["OR"] = [
        { firstname: { contains: query.name } },
        { lastname: { contains: query.name } },
      ];
    }
    if (query.raceId) {
      filterQuery["Races_id"] = parseInt(query.raceId);
    }
    if (query.gender) {
      filterQuery["gender"] = query.gender;
    }
    const queryRunner: any = await db.race_result.findMany({
      where: {
        ...filterQuery,
      },
      select: {
        rank: true,
        firstname: true,
        lastname: true,
        time: true,
        gender: true,
        runner_img: true,
      },
      orderBy: {
        rank: "asc",
      },
    });
    for (let i = 0; i < queryRunner.length; i++) {
      const score: any = await calculateScore(queryRunner[i].rank);
      const makeRunner = await formRunner(queryRunner[i], score);
      runner.push(makeRunner);
    }
    return runner;
  } catch (error) {
    console.log("error", error);
    return { status: "error", error };
  }
};

export const topRunner = async (query: any) => {
  try {
    var runner: any = [];
    const filtereventQuery: interface_.ObjectSort = {};
    const filterraceQuery: interface_.ObjectSort = {};

    if (query.event_id) {
      filtereventQuery["event_id"] = parseInt(query.event_id);
    }
    const queryToprunner = await db.races.findMany({
      where: {
        ...filtereventQuery,
      },
      select: {
        id: true,
        name: true,
        state: true,
        distance: true,
      },
    });
    const ids = queryToprunner.map((race) => race.id);
    if (Array.isArray(query.Races_id) && query.Races_id.length > 0) {
      filterraceQuery["Races_id"] = { in: query.Races_id };
    } else if (ids.length > 0) {
      filterraceQuery["Races_id"] = { in: ids };
    }
    if (query.Races_id) {
      filterraceQuery["Races_id"] = ids;
    }
    if (query.gender) {
      filterraceQuery["gender"] = query.gender;
    }
    const queryToprunnerRace = await db.race_result.findMany({
      where: {
        ...filterraceQuery,
      },
      select: {
        Races_id: true,
        firstname: true,
        lastname: true,
        time: true,
        nationality: true,
        runner_img: true,
      },
      orderBy: {
        time: "asc",
      },
    });
    return { queryToprunner, queryToprunnerRace };
  } catch (error) {
    console.log("Error: ", error);
    return { status: "error", error };
  }
};

const formRunner = async (query: any, score: number) => {
  return {
    rank: query.rank,
    firstname: query.firstname,
    lastname: query.lastname,
    score: score,
    time: query.time,
    gender: query.gender,
    img: query.runner_img,
  };
};

export const queryRaces = async (query: any) => {
  try {
    const raceResult = await db.races.findMany({
      where: {
        event_id: parseInt(query),
      },
      select: {
        id: true,
        name: true,
      },
    });
    const dataConvert = await Promise.all(
      raceResult.map(async (item) => {
        const pace_Avg = await paceAvg(item.id);
        return {
          id: item.id,
          name: item.name,
          paceAvg: pace_Avg,
        };
      })
    );
    return dataConvert;
  } catch (error) {
    console.log("error", error);
    return { status: "error", error };
  }
};

export const queryallRaces = async () => {
  try {
    const raceResult = await db.races.findMany();
    return raceResult;
  } catch (error) {
    console.log("Error: ", error);
    return { status: "error", error };
  }
};
