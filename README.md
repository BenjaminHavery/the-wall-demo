
## A test by Ben Havery

This project is intended to demonstate the concept of a 3d wall to which users can add graffiti-style messages.

[View Demo](https://adoring-curie-e4640c.netlify.app/).

## The following core features are implemented:

- Dynamically sized 3d wall, performant via instanced rendering of ~10,000 bricks in a single draw call.
- Graffiti messages attached to the 3d wall.
- Controls for traversing the scene that make some kind of sense on desktop and mobile.
- Basic UI for adding messages to the wall.

## Future features might include:

- Fleshed out controls for adding messages, such that the user could select color, typeface, size, line-breaks etc.
- Additional scene detail, for example foreground objects, pavement and sky.
- More dynamic sizing and placement of messages on the wall, compared to the current implementation which is a single row of equally sized and shaped messages with a random offset in the y dimension.
- Infinite wall, loaded/culled based on distance like messages are.
- Integration of a data storage API for syncing messages between user sessions, Google Firebase would be good for this.
- Changed render method for messages, currently projected HTML, to something inside the canvas (SVG sprites or 3d text?) that could be lit and occluded.

