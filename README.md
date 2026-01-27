
PLEASE REFER README.docx in the root folder for screenshots, etc. for the same content found below - 



Software
- Used .NET 10 for developing .NET API using Visual Studio 2026.
- Used Angular 21.x and Node version 24.12.0
- Used 1 single solution to accommodate both API & UI.









Steps to Build
- Go to the root folder and open Open-Meteo-App.slnx in Visual Studio.
- Since both API and UI are part of the same solution, build the application through menu option - Build -> Build Solution (Ctrl + Shift + B)
- Open the terminal in Visual Studio through menu options � View -> Terminal (Ctrl + `) or alternatively �Windows Powershell�.
- Go the path from the root folder � Weather-app\ClientApp

- Run the command: npm install

- Run the command: npm run build

- If both the builds are successful � API & UI, we should be good to run the application.


Steps to Run the application
- To run the API from Visual Studio through menu options � Debug -> Start without Debugging (Ctrl + F5) or alternatively to debug Debug -> Start Debugging (F5).
- To run the UI from terminal (aforementioned) or from �Windows Powershell�, run the command - ng serve

- API should be available at https://localhost:7174 and UI at http://localhost:4200/
- To access that one end-point for the API, use Postman or Bruno to access - https://localhost:7174/api/v1/weather?latitude=32.78&longitude=96.8
- Below are the screenshots of API execution from Bruno & UI through the browser � 



