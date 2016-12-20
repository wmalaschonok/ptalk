@echo off
bld\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat stop
bld\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat start
echo "Press a key to stop."
pause
bld\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j stop
