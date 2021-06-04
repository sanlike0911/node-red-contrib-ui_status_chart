@echo off
cd /d %~dp0

rem node-RED container name
set nodeRedContainerName=nodeRED

rem build and install
npm run build & ^
xcopy /Y /S /E src\locales\ nodes\locales\ & ^
copy /Y src\*.html nodes\ & ^
xcopy /Y /S /E dist\* nodes\* & ^
md test\data\your-node\nodes\ & ^
copy /Y package.json test\data\your-node\ & ^
xcopy /Y /S /E nodes\* test\data\your-node\nodes\* & ^
docker exec -it %nodeRedContainerName% bash -c "cd /data/ && npm install ./your-node && exit" & ^
docker restart %nodeRedContainerName%
pause
