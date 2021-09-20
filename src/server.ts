import express from "express";
import bodyParser from "body-parser";
import {
  filterImageFromURL,
  deleteLocalFiles,
  checkImageURL,
} from "./util/util";
import isUrl from "is-url";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get(
    "/filteredimage",
    async (req: express.Request, res: express.Response) => {
      const imageUrl = req.query.image_url as string;

      // check if there is a query
      if (!imageUrl) {
        return res.status(400).send("The image url is required!");
      }

      // check if the query is a valid url
      if (!isUrl(imageUrl)) {
        return res.status(400).send("please enter a valid url!");
      }

      // check if the url is an image url
      if (!checkImageURL(imageUrl)) {
        return res
          .status(422)
          .send(`Can't process image, please enter a valid image url!`);
      }

      const filteredImage = await filterImageFromURL(imageUrl);

      await res.status(200).sendFile(filteredImage, {}, (error) => {
        if (error) {
          return res
            .status(422)
            .send("there was a problem processing the image");
        }
        // delete local files
        deleteLocalFiles([filteredImage]);
      });
    }
  );
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
