    docker image build -t node_x .
    docker run --rm -it --entrypoint bash node_x
    docker run -p 49160:8080  node_x

    docker-compose up --build
    docker-compose exec -it ID bash



app:
build:
context: .
dockerfile: Dockerfile
volumes:
- ./src:/usr/src/app
ports:
- 5214:8080
depends_on:
- mongo