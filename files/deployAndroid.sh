docker stop rw
docker rm rw

set -e

command="docker create"

# Get all the env keys and pass in from the host
str=$(egrep -v '^#' .env | xargs)
IFS=" "
ary=($str)
for key in "${!ary[@]}";
do
  str2="${ary[$key]}"
  IFS="="
  ary2=($str2)
  command="${command} -e ${ary2[0]}"
done

command="${command} -it --name=rw cajacko/remember-when:0.1.0 yarn docker:deploy"

# Execute the docker run command with all the env set
eval $command

docker cp . rw:/App
docker start rw
docker logs --follow rw
code=$(docker inspect rw --format='{{.State.ExitCode}}')
docker stop rw
docker rm rw

exit $code
