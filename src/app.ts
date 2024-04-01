import consoleStamp from 'console-stamp';
import dotenv from 'dotenv';
import { AutoYeeter } from './AutoYeeter';

dotenv.config();
consoleStamp(console);

const config = require("../config.json") as any;

const keywords = config.banned_keywords as string[];
const comboRuleSets = config.combo_rule_sets as string[][][];
const banMessage = String(config.ban_message);

const token = process.env.TOKEN as string;

new AutoYeeter(token, keywords, comboRuleSets, banMessage);