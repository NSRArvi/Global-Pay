export const CAROUSEL_DATA = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
    title: "Netflix Premium",
    subtitle: "Up to 50% Off",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop",
    title: "YouTube Premium",
    subtitle: "Ad-free experience",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
    title: "ChatGPT Plus",
    subtitle: "Access to GPT-4",
  },
];

const getFavicon = (domain) =>
  `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

export const CATEGORIES = [
  {
    title: "Entertainment",
    items: [
      {
        id: "n1",
        name: "Netflix Basic",
        price: "$8/mo",
        image: getFavicon("netflix.com"),
      },
      {
        id: "n2",
        name: "Netflix Standard",
        price: "$15/mo",
        image: getFavicon("netflix.com"),
      },
      {
        id: "n3",
        name: "Netflix Premium",
        price: "$20/mo",
        image: getFavicon("netflix.com"),
      },
      {
        id: "p1",
        name: "Prime Video",
        price: "$12/mo",
        image: getFavicon("primevideo.com"),
      },
      {
        id: "y1",
        name: "YouTube Premium",
        price: "$14/mo",
        image: getFavicon("youtube.com"),
      },
      {
        id: "y2",
        name: "YouTube Family",
        price: "$23/mo",
        image: getFavicon("youtube.com"),
      },
    ],
  },
  {
    title: "AI & Productivity",
    items: [
      {
        id: "c1",
        name: "ChatGPT Plus",
        price: "$20/mo",
        image: getFavicon("chatgpt.com"),
      },
      {
        id: "c2",
        name: "ChatGPT Team",
        price: "$25/mo",
        image: getFavicon("chatgpt.com"),
      },
      {
        id: "cl1",
        name: "Claude Pro",
        price: "$20/mo",
        image: getFavicon("claude.ai"),
      },
      {
        id: "cl2",
        name: "Claude Team",
        price: "$30/mo",
        image: getFavicon("claude.ai"),
      },
      {
        id: "g1",
        name: "Gemini Advanced",
        price: "$20/mo",
        image: getFavicon("gemini.google.com"),
      },
      {
        id: "go1",
        name: "Google One 100GB",
        price: "$2/mo",
        image: getFavicon("one.google.com"),
      },
      {
        id: "go2",
        name: "Google One 2TB",
        price: "$10/mo",
        image: getFavicon("one.google.com"),
      },
      {
        id: "go3",
        name: "Google One AI Premium",
        price: "$20/mo",
        image: getFavicon("one.google.com"),
      },
      {
        id: "m1",
        name: "Microsoft 365",
        price: "$7/mo",
        image: getFavicon("microsoft365.com"),
      },
    ],
  },
  {
    title: "Music & Audio",
    items: [
      {
        id: "s1",
        name: "Spotify Premium",
        price: "$11/mo",
        image: getFavicon("spotify.com"),
      },
      {
        id: "s2",
        name: "Spotify Duo",
        price: "$15/mo",
        image: getFavicon("spotify.com"),
      },
      {
        id: "a1",
        name: "Apple Music",
        price: "$11/mo",
        image: getFavicon("music.apple.com"),
      },
    ],
  },
  {
    title: "Gaming & VPN",
    items: [
      {
        id: "x1",
        name: "Xbox Game Pass",
        price: "$17/mo",
        image: getFavicon("xbox.com"),
      },
      {
        id: "nv1",
        name: "NordVPN 1 Year",
        price: "$5/mo",
        image: getFavicon("nordvpn.com"),
      },
    ],
  },
];
