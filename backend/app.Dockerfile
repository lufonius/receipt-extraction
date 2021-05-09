FROM adoptopenjdk:16-jre

RUN mkdir -p /drezip
WORKDIR /drezip
COPY ./build/libs/drezip-0.0.1-SNAPSHOT.jar .

EXPOSE 80

CMD ["java", "-jar", "/drezip/drezip-0.0.1-SNAPSHOT.jar"]