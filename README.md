# kannatusilmoitukset.fi

Front end for the citizens' initiative visualization service kannatusilmoitukset.fi

## Data

The current version requires a processed version of the public initiative support data. This data, updated hourly, is available at

http://kannatusilmoitukset.fi/initiatives-all.json

A better API for fetching this processed data and the original history of support data will be made available shortly. If you have any plans for the usage, do contact us and describe your needs.

### Sorted, streaked data

A similar format but with dates sorted and values streaked:

{'date4':2,'date1':1,'date2':1,'date3':1} -> {'date1':1,'date3':1,'date4':2}

http://kannatusilmoitukset.fi/initiatives-sorted-streaked.json

## Installation

Generate the static page and assets as described under _Development_.

Fetch a snapshot of the data:

    curl http://kannatusilmoitukset.fi/initiatives-sorted-streaked.json > web/initiatives-sorted-streaked.json

Redirect all non-static requests to index.html, nginx example:

    server {
        server_name kannatusilmoitukset.tunk.io;
        root /home/pkjedi/workspace/kannatusilmoitukset-front/web;
        index index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }

## Development

Requires _node.js_ and _npm_ (I used [nodeenv](https://github.com/ekalinin/nodeenv))

    npm install -g grunt-cli bower # install grunt and bower
    git clone git@github.com:fraktio/kannatusilmoitukset-front.git # clone the repository
    cd kannatusilmoitukset-front
    npm install # install node dependencies (grunt modules)
    bower install # install client js dependencies
    grunt # run the grunt default task, which generates the actual page

Use `grunt watch` to build on changes. Testing TODO.

