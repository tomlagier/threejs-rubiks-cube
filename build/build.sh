##CWD is ./
PARENT="$(dirname "$(pwd)")"
PROJECT=${PARENT##*/}

mv Dockerfile-build ../
docker kill $PROJECT-build
docker rm $PROJECT-build
docker build -t tomlagier/$PROJECT-build -f ../Dockerfile-build ../
docker run -d --name $PROJECT-build tomlagier/$PROJECT-build /bin/sh/
docker cp $PROJECT-build:/build/build.tar.gz ./
docker kill $PROJECT-build
docker rm $PROJECT-build
docker kill $PROJECT-host
docker rm $PROJECT-host
docker build -t tomlagier/$PROJECT-host -f Dockerfile-host ./
HOST_PORT=$(jq -r .hostPort package.json)
docker run -d -p $HOST_PORT:80 --name $PROJECT-host tomlagier/$PROJECT-host
rm build.tar.gz

#Clean up images
docker rmi $(docker images -q)
