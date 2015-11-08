# Clean up images
REPODIR=${PWD%.*}
PROJECT=${REPODIR##*/}

mv build/Dockerfile-build .
docker kill $PROJECT-build
docker rm $PROJECT-build
docker build -t tomlagier/$PROJECT-build -f Dockerfile-build .
docker run -d --name $PROJECT-build tomlagier/$PROJECT-build /bin/sh/
docker cp $PROJECT-build:/build/build.tar.gz ./build/
docker kill $PROJECT-build
docker rm $PROJECT-build
docker kill $PROJECT-host
docker rm $PROJECT-host
docker build -t tomlagier/$PROJECT-host -f ./build/Dockerfile-host ./build/
HOST_PORT=$(jq -r .hostPort package.json)
docker run -d -p $HOST_PORT:80 --name $PROJECT-host tomlagier/$PROJECT-host
rm build/build.tar.gz

#Clean up images
docker rmi $(docker images -q)
