rem @echo off
rmdir bld /S /Q
mkdir bld

mkdir .\bld\neo4j-community-3.1.1-SNAPSHOT
mkdir .\bld\dump

xcopy server\winPatch\neo4j-community-3.1.1-SNAPSHOT .\bld\neo4j-community-3.1.1-SNAPSHOT /E /Y
xcopy server\dump .\bld\dump /E /Y

cd bld
::	rmdir neo4j-community-3.1.1-SNAPSHOT\data\databases\graph.db /S /Q
::	move dump neo4j-community-3.1.1-SNAPSHOT\data\databases\graph.db /Y
call .\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat install-service
call .\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat start
		echo "IMPORTANT! Please open in browser http://localhost:7474 and CHANGE THE DEFAULT PASSWORD. Then press a key."
		pause
call .\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat stop
call .\neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat uninstall-service
cd ..