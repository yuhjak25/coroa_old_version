import dotenv from "dotenv";
dotenv.config();

const { APP_TOKEN, APP_ID, MONGODB_URI } = process.env;

interface Inits {
  APP_TOKEN: string | undefined;
  APP_ID: string | undefined;
  MONGODB_URI: string | undefined;
}

const inits: Inits = {
  APP_TOKEN,
  APP_ID,
  MONGODB_URI,
};

export default inits;
