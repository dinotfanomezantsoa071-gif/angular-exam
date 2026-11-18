@echo off
cd /d "%~dp0"
if not defined JAVA_HOME set "JAVA_HOME=C:\Program Files\Java\jdk-21"
if not exist "%JAVA_HOME%\bin\java.exe" (
 echo Aucun java.exe trouve dans JAVA_HOME : %JAVA_HOME%
 pause
 exit /b 1
)
if exist "target\02-textile-v2-2.0.0.jar" (
 "%JAVA_HOME%\bin\java.exe" -jar "target\02-textile-v2-2.0.0.jar"
) else (
 where mvn >nul 2>nul
 if errorlevel 1 (
  echo Maven est requis pour compiler le backend. Installe Maven ou utilise le JAR existant.
  pause
  exit /b 1
 )
 call mvn -s "%~dp0.mvn\settings.xml" -Dmaven.repo.local="%~dp0..\..\..\.maven-repository" spring-boot:run
)
pause
