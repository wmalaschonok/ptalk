@echo off
cd bld
call .\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat stop
call .\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat uninstall-service
call .\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat install-service
call .\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat start
echo "Press a key to stop."
pause
call .\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j stop
cd ..
