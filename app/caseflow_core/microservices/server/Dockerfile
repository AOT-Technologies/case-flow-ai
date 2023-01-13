# RedHat UBI 8 with nodejs 14
FROM registry.access.redhat.com/ubi8/ubi as builder
RUN dnf module install -y nodejs:14

# Install packages, build and keep only prod packages
WORKDIR /app
COPY . ./
RUN npm ci
RUN npm run build
# --only=prod
RUN npm ci --only=prod  
    #&& npm run build

# Deployment container
FROM node:lts-alpine
WORKDIR /app
# Set node to production
ENV NODE_ENV production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose port 
EXPOSE 7001

# Start up command, with max heap size as 50Megs
ENTRYPOINT ["node", "--max-old-space-size=50","dist/main"]