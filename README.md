[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.2527041.svg)](https://doi.org/10.5281/zenodo.2527041)
# SVGm

Library for parsing and measure elements of Inkscape generated svg files

## Getting Started
Install the module with: `npm install svgm`

```javascript
var SVG = require('svg.js');
var svgm = require('svgm');
let exampleSVGcontent ='<?xml version="1.0" encoding="UTF-8" standalone="no"?><!-- Created with Inkscape (http://www.inkscape.org/) --><svg   xmlns:dc="http://purl.org/dc/elements/1.1/"   xmlns:cc="http://creativecommons.org/ns#"   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"   xmlns:svg="http://www.w3.org/2000/svg"   xmlns="http://www.w3.org/2000/svg"   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"   width="210mm"   height="297mm"   viewBox="0 0 210 297"   version="1.1"   id="svg8"   inkscape:version="0.92.3 (2405546, 2018-03-11)"   sodipodi:docname="minimum_test.svg">  <defs     id="defs2">    <inkscape:path-effect       effect="bspline"       id="path-effect16"       is_visible="true"       weight="33.333333"       steps="2"       helper_size="0"       apply_no_weight="true"       apply_with_weight="true"       only_selected="false" />    <inkscape:path-effect       effect="bspline"       id="path-effect12"       is_visible="true"       weight="33.333333"       steps="2"       helper_size="0"       apply_no_weight="true"       apply_with_weight="true"       only_selected="false" />  </defs>  <sodipodi:namedview     id="base"     pagecolor="#ffffff"     bordercolor="#666666"     borderopacity="1.0"     inkscape:pageopacity="0.0"     inkscape:pageshadow="2"     inkscape:zoom="1.979899"     inkscape:cx="196.8971"     inkscape:cy="479.54692"     inkscape:document-units="mm"     inkscape:current-layer="layer1"     showgrid="false" />  <metadata     id="metadata5">    <rdf:RDF>      <cc:Work         rdf:about="">        <dc:format>image/svg+xml</dc:format>        <dc:type           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />        <dc:title></dc:title>      </cc:Work>    </rdf:RDF>  </metadata>  <g     inkscape:label="Layer 1"     inkscape:groupmode="layer"     id="layer1">    <g       id="g20">      <path         inkscape:label="scalebar=1"         inkscape:original-d="m 18.898809,167.73214 c 17.135186,-0.75622 34.270105,-1.51217 51.404763,-2.26786"         inkscape:path-effect="#path-effect12"         inkscape:connector-curvature="0"         id="path10"         d="m 18.898809,167.73214 c 17.135197,-0.75597 34.270116,-1.51192 51.404763,-2.26786"         style="fill:#00c0af;fill-opacity:1;stroke:#ff0000;stroke-width:0.30000001;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:markers stroke fill" />      <path         inkscape:label="linelength"         inkscape:original-d="m 22.45064,142.11731 c 22.228179,-2.27206 44.456094,-4.54385 66.683745,-6.81538"         inkscape:path-effect="#path-effect16"         inkscape:connector-curvature="0"         id="path14"         d="m 22.45064,142.11731 c 22.228203,-2.27182 44.456118,-4.54362 66.683745,-6.81538"         style="fill:#00c0af;fill-opacity:1;stroke:#008000;stroke-width:0.30000001;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:markers stroke fill" />    </g>  </g></svg>';  
//--------------------
let filename = "exampleFileName";
let parsed_data = svgm.prepareSVG( exampleSVGcontent, filename );
console.log(parsed_data);
```

## Documentation
_(Coming soon)_

## Release History
_0.7.1_ - migrate to rollup

## License
Copyright (c) 2019 mironcat  
Licensed under the MIT license.
