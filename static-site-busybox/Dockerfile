FROM busybox:1.37
RUN adduser -D static
USER static
WORKDIR /home/static

COPY . .

USER root
RUN chmod +x start.sh
USER static

CMD ["./start.sh"]
