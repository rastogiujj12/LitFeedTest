echo "Deployment initiated ....";

cd ..

git pull origin master

echo "Killing previous version ....";

kill $(ps aux | grep podmo| awk '{print $2}') || true;
bash ./clean.sh
bash ./install.sh
npm install

PORT=3000 nohup node app podmo >> ~/logs.out 2>&1&