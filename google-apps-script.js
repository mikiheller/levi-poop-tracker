/**
 * Google Apps Script for Levi's Poop Tracker
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Name the first sheet "Entries"
 * 3. Add these headers in row 1: Timestamp | Name | Date | Time | Size | Texture | Notes
 * 4. Go to Extensions > Apps Script
 * 5. Delete any existing code and paste this entire file
 * 6. Click Deploy > New deployment
 * 7. Select type: Web app
 * 8. Set "Execute as" to "Me"
 * 9. Set "Who has access" to "Anyone"
 * 10. Click Deploy and authorize when prompted
 * 11. Copy the Web app URL and paste it in app.js
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Entries');
    
    if (!sheet) {
      throw new Error('Sheet "Entries" not found');
    }
    
    const data = JSON.parse(e.postData.contents);
    
    // Create timestamp
    const timestamp = new Date().toISOString();
    
    // Append row
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.date,
      data.time,
      data.size,
      data.texture,
      data.note || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - run this to verify the script works
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Poop Tracker API is running!' }))
    .setMimeType(ContentService.MimeType.JSON);
}
