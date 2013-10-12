<!DOCTYPE html>
<html lang="fi" xmlns:og="http://ogp.me/ns#" xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=600">
    <title>Kansalaisaloitteiden kannatusilmoitukset</title>

    <link rel="prefetch" href="/initiatives-sorted-streaked.json">
    <link rel="prefetch" href="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/core/tooltip.css">
    <link rel="prefetch" href="//www.google.com/uds/?file=visualization&v=1&packages=corechart&async=2m">
    <link rel="prefetch" href="//www.google-analytics.com/ga.js">
    <link rel="prefetch" href="//connect.facebook.net/fi_FI/all.js#xfbml=1">

    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Sintony:400,700">
    <link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/bootstrap/css/bootstrap-responsive.min.css">
    <link rel="stylesheet" href="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/core/tooltip.css">
    <link rel="stylesheet" href="/assets/css/citizens-initiative.css">

    <meta property="og:title" content="Kansalaisaloitteiden kannatusilmoitukset" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="http://kannatusilmoitukset.fi/" />
    <meta property="og:image" content="" />
    <meta property="og:site_name" content="Kansalaisaloitteiden kannatusilmoitukset" />
    <meta property="fb:admins" content="731704053" />
</head>
<body>
    <div class="container">
        <div class="page-header">
            <h1>Kansalaisaloitteiden kannatusilmoitukset</h1>
        </div>
        <div class="row">
            <div class="span7">
                <p>Aloitteita voit kannattaa sivulla <a href="//kansalaisaloite.fi">kansalaisaloite.fi</a></p>
                <p>
                    Tälle sivulle kerätään kansalais&shy;aloitteiden kannatus&shy;ilmoitusten kokonais&shy;määrien historiaa.
                    Kehitysideoita voit lähettää osoitteeseen <a href="mailto:kannatusilmoitukset@fraktio.fi">kannatusilmoitukset@fraktio.fi</a>
                </p>
            </div>
            <div class="span5">
                <div style="z-index: 600;" class="fb-like" data-href="http://kannatusilmoitukset.fi/" data-send="true" data-show-faces="true"></div>
            </div>
        </div>
        <div class="row">
            <div class="span12">

            </div>
        </div>
        <div class="row">
            <div class="span12">
                <div class="well" style="overflow: hidden;">
                    <div initiatives-nav></div>
                    <div ng-view></div>
                </div>
            </div>
        </div>
    </div>

    <a href="https://github.com/fraktio/kannatusilmoitukset-front">
        <img
            width="149" height="149"
            style="z-index: 500; position: absolute; top: 0; right: 0; border: 0;"
            src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png"
            alt="Fork me on GitHub"
        >
    </a>
    <div id="fb-root"></div>

    <script>
        window._gaq = [
            ['_setAccount', 'UA-37909592-1'],
            ['_trackPageview']
        ];
    </script>
    {{#each scripts}}
    <script src="/{{this}}"></script>
    {{/each}}
    <script async src="//connect.facebook.net/fi_FI/all.js#xfbml=1"></script>
    <script async src="//www.google-analytics.com/ga.js"></script>
</body></html>
