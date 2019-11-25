
#!/bin/bash

cd /home/java-tron/tronscan_workspace/tronscan_spring/
git reset --hard HEAD
git clean -d -f
git pull --rebase
./gradlew clean
w./gradlew buildjar
cd /home/java-tron/tronscan_workspace
kill -9 $(cat pid)
nohup java -jar /home/java-tron/tronscan_workspace/tronscan_spring/build/libs/http-1.0-SNAPSHOT.jar  >> /home/java-tron/tronscan_workspace/http.log 2>&1 &
pid=$!
echo $pid > pid
