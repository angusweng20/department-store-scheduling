/**
 * MAIN ENTRY POINT
 */

function setup() {
  const ss = Database.getSpreadsheet();
  
  // A. Members (Simplified)
  // [Name, ID, LastUpdate]

  const ss = Database.getSpreadsheet();
  
  // B. Reminders (Simplified)
  // [Status, Time, Freq, Content, TargetID, TargetType, Creator]
  let sheetReminders = ss.getSheetByName(SHEETS.REMINDERS);
  if (!sheetReminders) {
    sheetReminders = ss.insertSheet(SHEETS.REMINDERS);
    sheetReminders.appendRow(['狀態', '預定時間', '頻率', '提醒內容', '目標ID(系統)', '目標類型', '建立者']);
    sheetReminders.setFrozenRows(1);
  }

  // Set Validations
  const ruleStatus = SpreadsheetApp.newDataValidation().requireValueInList(['待執行', '已暫停', '已完成', '取消'], true).setAllowInvalid(false).build();
  sheetReminders.getRange('A2:A1000').setDataValidation(ruleStatus);

  const ruleFreq = SpreadsheetApp.newDataValidation().requireValueInList(['單次', '每天', '每週', '每月'], true).setAllowInvalid(false).build();
  sheetReminders.getRange('C2:C1000').setDataValidation(ruleFreq);

  Logger.log('初始化完成 (Initialization Complete)');
  
  // Auto-setup Trigger
  setupTrigger();
}

/**
 * Setup Time-Driven Trigger for Reminders
 */
function setupTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  const triggerName = 'checkReminders';
  
  // Check if exists
  for (const t of triggers) {
    if (t.getHandlerFunction() === triggerName) {
      Logger.log('Trigger already exists.');
      return;
    }
  }
  
  // Create every 1 minute
  ScriptApp.newTrigger(triggerName)
    .timeBased()
    .everyMinutes(1)
    .create();
    
  Logger.log('已建立每分鐘檢查的觸發程序 (Trigger Created)');
}

function doPost(e) {
  try {
    const json = JSON.parse(e.postData.contents);
    const events = json.events;
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        handleMessage(event);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
  } catch (ex) {
    console.error(ex);
    // Always return 200 OK to prevent LINE retries or errors
    return ContentService.createTextOutput(JSON.stringify({status: 'error'})).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Connection Test Function
 * Open the Web App URL in browser to test permissions
 */
function doGet(e) {
  return ContentService.createTextOutput("Connection Success! The bot is accessible.");
}

/**
 * Trigger Function (Run every minute)
 */
function checkReminders() {
  const data = Database.getAllRemindersRaw();
  const now = new Date();
  
  // Skip Header (Index 0)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = row[0];
    const scheduledTime = new Date(row[1]);
    
    // Check if Due
    if (status === '待執行' && scheduledTime <= now) {
      // New Schema Indices:
      // 0: Status, 1: Time, 2: Freq, 3: Content, 4: TargetID
      const content = row[3];
      const targetId = row[4]; 

      if (targetId) {
        // Send Flex Message Card
        const timeStr = Utilities.formatDate(scheduledTime, "GMT+8", "HH:mm");
        const flex = createTriggerFlex(content, timeStr);
        
        pushMessage(targetId, [{ 
            type: 'flex', 
            altText: `🔔 提醒：${content}`, 
            contents: flex 
        }]);
      }
      
      // 2. Schedule Next Run
      const freqChinese = row[2];
      const freqCode = FREQ_MAP[freqChinese];
      
      let nextDate = new Date(scheduledTime);
      if (freqCode === 'DAILY') nextDate.setDate(nextDate.getDate() + 1);
      else if (freqCode === 'WEEKLY') nextDate.setDate(nextDate.getDate() + 7);
      else if (freqCode === 'MONTHLY') nextDate.setMonth(nextDate.getMonth() + 1);
      
      // Update DB (Next Run or Complete)
      Database.updateReminderAfterRun(i + 1, freqCode, nextDate);
    }
  }
}
