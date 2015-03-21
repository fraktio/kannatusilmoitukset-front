# kannatusilmoitukset.fi

Front end for the citizens' initiative visualization service https://kannatusilmoitukset.fi/

## Data

If you'd like to get the initiative support history data, please contact us.

You may use the data for any purpose.

Currently automatically updated data versions:

https://kannatusilmoitukset.fi/initiatives/img/meta.json
https://kannatusilmoitukset.fi/initiatives/img/33.png
https://kannatusilmoitukset.fi/initiatives/33.json

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
            proxy_pass https://kannatusilmoitukset.fi;
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

