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

Redirect all non-static requests to index.htm

## Development

- Install _node.js_ and _npm_ (I used [nodeenv](https://github.com/ekalinin/nodeenv))
- `npm install -g grunt-cli bower`
- `npm install`
- `bower install`
- `grunt`

Use `grunt watch`. Testing TODO.

