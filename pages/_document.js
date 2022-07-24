import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css"
            rel="stylesheet"
          />

          <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css" />
          <script
            defer
            src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.2/mapbox-gl-directions.js"
          ></script>

          <link
            rel="stylesheet"
            href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.0.2/mapbox-gl-directions.css"
            type="text/css"
          />
          <script
            defer
            src="https://npmcdn.com/@turf/turf/turf.min.js"
          ></script>
          <script
            defer
            src="https://cdnjs.cloudflare.com/ajax/libs/mapbox-polyline/1.1.1/polyline.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
