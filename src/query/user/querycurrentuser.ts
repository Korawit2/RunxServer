import { PrismaClient } from "@prisma/client";
import { calculateScore } from "../../function/calculate";
const db = new PrismaClient();

export const totalPoint = async (runxId: number) => {
  try {
    var totalPoint: number = 0;
    const reacesResult = await db.race_result.findMany({
      where: {
        runx_id: runxId,
      },
      select: {
        Races_id: true,
        rank: true,
      },
    });
    if (Object.keys(reacesResult).length != 0) {
      for (let i = 0; i < reacesResult.length; i++) {
        const score = await calculateScore(reacesResult[i].rank);
        totalPoint = totalPoint + score;
      }
      const final_total_point = totalPoint.toFixed(0);
      return final_total_point;
    }
    return totalPoint;
  } catch (error) {
    console.log("error", error);
    return { status: "fail" };
  }
};

export const getUserByemail = async (userid: string) => {
  try {
    const queryUser = await db.userRunX.findUnique({
      where: {
        email: userid,
      },
      select: {
        id: true,
        firstname_eng: true,
        lastname_eng: true,
        firstname_thai: true,
        lastname_thai: true,
        birth_date: true,
        gender: true,
        email: true,
        id_passport: true,
        nationality: true,
        user_img: true,
      },
    });
    return queryUser;
  } catch (error) {
    console.log("error", error);
    return [];
  }
};

export const updateUser = async (
  userBody: any,
  userEmail: { email: string }
) => {
  try {
    console.log(userBody);
    const updateUser: any = await db.userRunX.update({
      where: {
        email: userEmail.email,
      },
      data: userBody,
    });
    return { status: "ok" };
  } catch (error) {
    console.log("error", error);
    return { status: "fail" };
  }
};

export const claimPoint = async (
  query: { resultId: any; runxId: any },
  profile: { email: string }
) => {
  try {
    const checkEmailAndId: any = await db.userRunX.aggregate({
      _count: {
        email: true,
      },
      where: {
        email: profile.email,
        id: parseInt(query.runxId),
      },
    });
    if (checkEmailAndId._count.email > 0) {
      const checkresult = await db.race_result.findUnique({
        where: {
          id: parseInt(query.resultId),
        },
      });
      const user = await db.userRunX.findUnique({
        where: {
          id: parseInt(query.runxId),
        },
        select: {
          firstname_eng: true,
          lastname_eng: true,
          nationality: true,
        },
      });
      if (
        checkresult?.firstname === user?.firstname_eng &&
        checkresult?.lastname === user?.lastname_eng &&
        checkresult?.nationality === user?.nationality
      ) {
        const claimed = await db.race_result.update({
          where: {
            id: parseInt(query.resultId),
          },
          data: {
            runx_id: parseInt(query.runxId),
            time_stamp: new Date(),
            claim_status: true,
          },
        });
        return {
          status: true,
          claimed,
        };
      }
      return {
        status: false,
      };
    }
    return {
      status: false,
    };
  } catch (error) {
    console.log("error", error);
    return { status: "fail" };
  }
};
