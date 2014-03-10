# kannatusilmoitukset.fi

Front end for the citizens' initiative visualization service kannatusilmoitukset.fi

## Data

The initiative support data is currently available in three forms, all updated hourly.

You may use the data for any purpose.

### Original format with hourly data points

http://kannatusilmoitukset.fi/initiatives-all.json

### Streaked data

A similar format with values streaked:

{'date1':1,'date2':1,'date3':1,'date4':2} -> {'date1':1,'date3':1,'date4':2}

http://kannatusilmoitukset.fi/initiatives-sorted-streaked.json

### Single initiative streaked

Similar to streaked data, but separated to a separate file for each initiative.

http://kannatusilmoitukset.fi/initiatives/33.json

### Meta + single initiative png

http://kannatusilmoitukset.fi/initiatives/img/meta.json
http://kannatusilmoitukset.fi/initiatives/img/33.png

## Installation

Generate the static page and assets as described under _Development_.

Redirect all non-static requests to index.html and make data available, nginx example:

    server {
        server_name kannatusilmoitukset.tunk.io;
        root /home/pkjedi/workspace/kannatusilmoitukset-front/web;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # Make the data under /initiatives/ available
        location /initiatives/ {
            proxy_pass http://kannatusilmoitukset.fi;
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

