// This script requires editing in rows 6,7,8,9, 45 and 46 to configure your variables
// Once you get this working, remember to configure a trigger for writeData1 to automate it
// Copy and paste fetchAndWriteData, then adjust accordingly if you want more endpoints in this script. Make sure to add all scopes in line 9.

function getAccessToken() {
    var tokenUrl = 'https://accounts.veracross.com/your_school_here/oauth/token'; // Replace your_school_here with your schools route
    var clientId = 'aaa111qqq222www333'; // Replace with your client ID from your OAuth app
    var clientSecret = 'ppp999jjj777hhh555ppp999jjj777hhh555'; // Replace with your client secret from your OAuth App
    var scope = 'table:list'; // Specify the scopes from your OAuth App. Separated by commas if more than one. For example "students:list"
    var payload = {
      'grant_type': 'client_credentials',
      'client_id': clientId,
      'client_secret': clientSecret,
      'scope': scope
    };
  
    var options = {
      'method': 'post',
      'contentType': 'application/x-www-form-urlencoded',
      'payload': Object.keys(payload).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]);
      }).join('&')
    };
  
    try {
      var response = UrlFetchApp.fetch(tokenUrl, options);
      var json = JSON.parse(response.getContentText());
      var accessToken = json.access_token;
      Logger.log('Access Token: ' + accessToken);
      return accessToken;
    } catch (error) {
      Logger.log('Error getting access token: ' + error.toString());
      return null;
    }
  }
  
  function fetchAndWriteData() {
    var accessToken = getAccessToken();
    if (!accessToken) {
      Logger.log("Failed to obtain access token.");
      return;
    }
  
    //Set your Sheet name and endpoint url below
    var sheetName = 'sheet_name'; // Replace with your desired sheet name
    var baseUrl = 'https://api.veracross.com/your_school_here/v3/endpointname'; //replace your_school_here and endpointname. endpoint example "students" for the students table. Usually at the top of the api documentation - https://api-docs.veracross.com/docs/docs/d50279dec5fd1-list-students
    var options = {
      'method': 'get',
      'headers': {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    };
  
    try {
      var response = UrlFetchApp.fetch(baseUrl, options);
      var responseData = JSON.parse(response.getContentText());
      if (!(responseData && responseData.data)) {
        Logger.log("Unexpected response structure: " + JSON.stringify(responseData));
        return;
      }
    } catch (error) {
      Logger.log(error.toString());
      return;
    }
  
    // Proceed to write the data to the sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      Logger.log('Sheet not found');
      return;
    }
  
    var apiData = responseData.data;
    if (apiData.length === 0) {
      Logger.log('No data to write');
      return;
    }
  
    var numberOfColumns = Object.keys(apiData[0]).length;
    var values = apiData.map(apiObj => Object.values(apiObj));
    var lastColumn = numberOfColumns + 1; 
    var maxRows = sheet.getMaxRows();
    if (maxRows < values.length + 1) {
      sheet.insertRowsAfter(maxRows, values.length + 1 - maxRows);
    }
    sheet.getRange(1, 1, maxRows, lastColumn).clearContent(); 
    sheet.getRange(1, 1, values.length, numberOfColumns).setValues(values);
  
    // Add the "Time Synced" column
    var currentTime = new Date();
    var formattedTime = Utilities.formatDate(currentTime, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    sheet.getRange(1, lastColumn).setValue("Time Synced"); 
    sheet.getRange(2, lastColumn).setValue(formattedTime);
  }
  
  