cd ../suyu0925.github.io
call git pull
rmdir /s /q blog
xcopy ..\hexo-blog\public .\blog /S /I /H /K
call git push origin master
