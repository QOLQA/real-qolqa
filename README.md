# Qolqa Database Tool Modelling
## Run the project

### Clone the project

```sh
git clone <url-del-repo-real-qolqa>
```

### Navigate to the project

```sh
cd real-qolqa
```

### Install pnpm globally

```sh
npm install -g pnpm
```

### Install all dependencies with `pnpm`

```sh
pnpm install
```

### Run the server

```sh
pnpm run dev
```

## Run the project with docker compose
### Clone the required repositories

First, clone the main project repositories:

```sh
git clone <url-del-repo-real-qolqa>
git clone <url-del-repo-backend-qolqa>
```

Then, clone the repository containing the Docker configuration files:

```sh
git clone <url-del-repo-docker-files>
```

### Project structure

Once cloned, your project directory structure should look like this:

```
/your-workspace
│── real-qolqa/
│── backend-qolqa/
│── docker-files/
```

### Navigate to the Docker configuration directory

```sh
cd docker-files
```

### Build the project with Docker Compose

```sh
docker compose build --no-cache
```

### Run the project

```sh
docker compose up
```

### Open the project in your browser

```sh
http://localhost:5173
```
