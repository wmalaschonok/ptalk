@echo off
rmdir bld /S /Q
mkdir bld

xcopy server\winPatch\neo4j-community-3.1.1-SNAPSHOT bld\neo4j-community-3.1.1-SNAPSHOT /E /Y
xcopy server\dump bld\dump /E /Y

cd bld
::	rmdir neo4j-community-3.1.1-SNAPSHOT\data\databases\graph.db /S /Q
::	move dump neo4j-community-3.1.1-SNAPSHOT\data\databases\graph.db /Y
	neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat start
		echo "Please open http://localhost:7474 and change the default password. Then press a key."
		pause
	neo4j-community-3.1.1-SNAPSHOT\bin\neo4j.bat stop
cd ..
