FROM maven:3.6.0-slim

LABEL "com.github.actions.name"="az-storage-action"
LABEL "com.github.actions.description"="Handle Azure storage using Github actions"
LABEL "com.github.actions.icon"="box"
LABEL "com.github.actions.color"="blue"

LABEL "repository"="https://github.com/floriandorau/az-storage-action"
LABEL "maintainer"="Florian Dorau <fdorau@it-economics.de>"

COPY . .

RUN npm install --production

ADD entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]