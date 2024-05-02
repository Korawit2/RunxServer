import { Elysia, t } from "elysia";
import {
  checkemail,
  duplecateUser,
  createUser,
} from "../../query/user/querysingup";

export const appSingupPlugin = new Elysia().post(
  "/users/signup",
  async ({ body, set }) => {
    const userBody: any = body;
    const isEmailExit = await checkemail(userBody.email);
    if (!isEmailExit.isuser) {
      userBody.password = await Bun.password.hash(userBody.password, {
        algorithm: "bcrypt",
        cost: 10,
      });
      const alreadyUser = await duplecateUser(userBody.email);
      if (!alreadyUser) {
        const res = await createUser({
          firstname_eng: userBody.firstname_eng,
          lastname_eng: userBody.lastname_eng,
          nationality: userBody.nationality,
          email: userBody.email,
          password: userBody.password,
          con_password: userBody.confirmpassword,
          policy_agreement: userBody.policy_agreement,
        });
        if (res.status === "error") {
          set.status = 400;
          return {
            message: "insert incomplete",
          };
        }
        return { message: "ok" };
      }
      return { message: "This email already exit" };
    }
    return {
      message: "Email is already exit",
    };
  },
  {
    body: t.Object({
      firstname_eng: t.String(),
      lastname_eng: t.String(),
      nationality: t.String(),
      email: t.String(),
      password: t.String(),
      confirmpassword: t.String(),
      policy_agreement: t.Boolean(),
    }),
  }
);
