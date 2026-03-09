# TopDev Frontend

The React/Vite/TypeScript frontend for TopDev, powered by Tailwind CSS and Lucide React.

## 🚀 Quick Deploy

### Local Development (Hot-reloading)
This uses the development Dockerfile and maps to port `5174` (to avoid host conflicts).

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```
> **Access at:** http://localhost:5174

_Note: If the backend is running, the frontend will automatically proxy `/api` requests to it via the internal docker network._

### Production Build (Static Nginx)
This performs a multi-stage Vite build and serves static assets purely via Nginx.

```bash
docker compose up -d --build
```
> **Access at:** http://localhost:5173

---

## 🛠️ Important Commands

```bash
# View live logs
docker compose logs -f frontend

# Stop containers
docker compose down

# Run npm install / add a package inside the container
docker compose run --rm frontend npm config set strict-ssl false
docker compose run --rm frontend npm install PACKAGE_NAME
```
