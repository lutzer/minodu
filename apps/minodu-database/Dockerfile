FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=minodu
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

# Copy initialization scripts (optional)
#COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306