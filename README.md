# Generative Images from Avatars

Exploration of using a classic avatar editor to control real-time generative AI.

- Live Demos
- [Avatar](https://avatars-six.vercel.app/)
- [Monsters](https://avatars-six.vercel.app/monsters)

## Setup

1.  Get a key from https://www.fal.ai/dashboard/keys and add it to `.env.local` as

        FAL_KEY=example:example

1.  Then just...

        npm install
        npm run dev

## Basic Architecture

Proxies fal API requests using fal's next proxy module and we deploy the full thing as a Next.js app, using Vercel naturally.


## Prio Art

- https://zengm.com/facesjs/
