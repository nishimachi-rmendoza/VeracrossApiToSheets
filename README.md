# VeracrossApiToSheets



Instructions:
1. In VC's Identity & Access Module - click Add Internal Integration
2. Give it a name and Create the integration
3. On the left hand menu, click Scopes and give it the appropriate scope of the API data you want
4. Copy and paste VeracrossApiToSheets.js into a Google Apps Script
5. Edit rows 6,7,8,9, 45 and 46 to configure your variables.
6. Once you get this working, configure a trigger for fetchAndWriteData to automate it.
7. If you need to call more than one endpoint into the same sheet, copy and paste the fetchAndWriteData function and adjust accordingly.
