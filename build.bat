@echo off
cd /d %~dp0

npm run build & ^
xcopy /Y /S /E src\icons\ dist\icons\ & ^
xcopy /Y /S /E src\locales\ dist\locales\ & ^
xcopy /Y /S /E src\figs\ dist\figs\ & ^
copy /Y src\LICENSE dist & ^
copy /Y src\package.json dist & ^
copy /Y src\*.html dist & ^
xcopy /Y /S /E dist\* data\dev\node-red-contrib-ui_status_chart\ & ^
docker exec -it nodeRed bash -c "cd /data/ && npm install ./dev/node-red-contrib-ui_status_chart/ && exit" & ^
docker restart nodeRed
pause