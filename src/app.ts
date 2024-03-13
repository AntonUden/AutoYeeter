import consoleStamp from 'console-stamp';
import dotenv from 'dotenv';
import { AutoYeeter } from './AutoYeeter';

dotenv.config();
consoleStamp(console);

const keywords = require("../keywords.json") as string[];

const token = process.env.TOKEN as string;

new AutoYeeter(token, keywords);