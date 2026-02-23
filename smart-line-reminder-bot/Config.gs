/**
 * CONFIGURATION & CONSTANTS
 */

// 1. Environment Variables (Secret)
// Use PropertiesService.getScriptProperties().getProperty('KEY') to get these.
// If not found, fall back to these defaults (for dev/testing).
const DEFAULT_CHANNEL_ACCESS_TOKEN = ''; 
const DEFAULT_SHEET_ID = ''; 

function getScriptProperty(key, contentDefault = '') {
  try {
    const val = PropertiesService.getScriptProperties().getProperty(key);
    return val ? val : contentDefault;
  } catch (e) {
    return contentDefault;
  }
}

const CONFIG = {
  get CHANNEL_ACCESS_TOKEN() { return getScriptProperty('CHANNEL_ACCESS_TOKEN', DEFAULT_CHANNEL_ACCESS_TOKEN); },
  get SHEET_ID() { return getScriptProperty('SHEET_ID', DEFAULT_SHEET_ID); },
  BOT_NAME: '記得',
  BOT_TONE: 'SERIOUS', // 'LIVELY' or 'SERIOUS'
  ADMIN_UIDS: [] // Optional: list of admin user IDs
};

const FREQ_MAP = {
  '單次': 'ONCE',
  '每天': 'DAILY',
  '每週': 'WEEKLY',
  '每月': 'MONTHLY'
};

const FREQ_MAP_REVERSE = {
  'ONCE': '單次',
  'DAILY': '每天',
  'WEEKLY': '每週',
  'MONTHLY': '每月'
};

const SHEETS = {
  MEMBERS: '成員名單',
  REMINDERS: '提醒事項'
};
