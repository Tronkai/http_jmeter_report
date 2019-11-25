
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
/home/java-tron/apache-jmeter-5.2/bin/jmeter -n -t /home/java-tron/tronscan_workspace/tron-test/src/test/resources/http_jmeter.jmx -l result.jtl -e -o /home/java-tron/http_jmeter_report/
cd /home/java-tron/http_jmeter_report/
git add .
git commit -m "report"
git push
