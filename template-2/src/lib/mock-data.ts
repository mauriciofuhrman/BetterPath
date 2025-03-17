import { Game } from "@/lib/types";

// Sample mock data for testing
export const mockGames: Game[] = [
  {
    id: 1,
    homeTeam: {
      name: "Los Angeles Lakers",
      abbreviation: "LAL",
      record: "22-15",
      score: 110,
    },
    awayTeam: {
      name: "Golden State Warriors",
      abbreviation: "GSW",
      record: "20-17",
      score: 105,
    },
    date: "Jan 25, 2024",
    time: "19:30",
    status: "Live",
    odds: {
      spread: "LAL -3.5",
      total: "O/U 235.5",
      moneyline: "LAL -160",
    },
    detailedOdds: {
      spread: {
        away: {
          MGM: "+3.5 (-110)",
          FD: "+3.5 (-110)",
          DK: "+3.5 (-105)",
          BR: "+3.5 (-110)",
        },
        home: {
          MGM: "-3.5 (-110)",
          FD: "-3.5 (-110)",
          DK: "-3.5 (-115)",
          BR: "-3.5 (-110)",
        },
      },
      total: {
        over: {
          MGM: "O 235.5 (-110)",
          FD: "O 235.5 (-110)",
          DK: "O 236.5 (-110)",
          BR: "O 235.5 (-110)",
        },
        under: {
          MGM: "U 235.5 (-110)",
          FD: "U 235.5 (-110)",
          DK: "U 236.5 (-110)",
          BR: "U 235.5 (-110)",
        },
      },
      moneyline: {
        away: {
          MGM: "+140",
          FD: "+145",
          DK: "+145",
          BR: "+142",
        },
        home: {
          MGM: "-160",
          FD: "-165",
          DK: "-170",
          BR: "-165",
        },
      },
      firstQuarter: {
        spread: {
          away: {
            MGM: "+1 (-110)",
            FD: "+1 (-110)",
            DK: "+1 (-110)",
            BR: "+1 (-110)",
          },
          home: {
            MGM: "-1 (-110)",
            FD: "-1 (-110)",
            DK: "-1 (-110)",
            BR: "-1 (-110)",
          },
        },
        total: {
          over: {
            MGM: "O 59.5 (-110)",
            FD: "O 59.5 (-110)",
            DK: "O 59.5 (-110)",
            BR: "O 59.5 (-110)",
          },
          under: {
            MGM: "U 59.5 (-110)",
            FD: "U 59.5 (-110)",
            DK: "U 59.5 (-110)",
            BR: "U 59.5 (-110)",
          },
        },
      },
      firstHalf: {
        spread: {
          away: {
            MGM: "+1.5 (-110)",
            FD: "+1.5 (-110)",
            DK: "+1.5 (-110)",
            BR: "+1.5 (-110)",
          },
          home: {
            MGM: "-1.5 (-110)",
            FD: "-1.5 (-110)",
            DK: "-1.5 (-110)",
            BR: "-1.5 (-110)",
          },
        },
        total: {
          over: {
            MGM: "O 118.5 (-110)",
            FD: "O 118.5 (-110)",
            DK: "O 118.5 (-110)",
            BR: "O 118.5 (-110)",
          },
          under: {
            MGM: "U 118.5 (-110)",
            FD: "U 118.5 (-110)",
            DK: "U 118.5 (-110)",
            BR: "U 118.5 (-110)",
          },
        },
      },
      alternativeSpreads: [
        {
          name: "GSW +5.5",
          odds: {
            MGM: "-140",
            FD: "-145",
            DK: "-145",
            BR: "-142",
          },
        },
        {
          name: "GSW +1.5",
          odds: {
            MGM: "+110",
            FD: "+115",
            DK: "+115",
            BR: "+112",
          },
        },
        {
          name: "LAL -5.5",
          odds: {
            MGM: "+120",
            FD: "+125",
            DK: "+125",
            BR: "+122",
          },
        },
        {
          name: "LAL -1.5",
          odds: {
            MGM: "-130",
            FD: "-135",
            DK: "-135",
            BR: "-132",
          },
        },
      ],
      alternativeTotals: [
        {
          name: "O 232.5",
          odds: {
            MGM: "-130",
            FD: "-135",
            DK: "-135",
            BR: "-132",
          },
        },
        {
          name: "U 232.5",
          odds: {
            MGM: "+110",
            FD: "+115",
            DK: "+115",
            BR: "+112",
          },
        },
        {
          name: "O 238.5",
          odds: {
            MGM: "+110",
            FD: "+115",
            DK: "+115",
            BR: "+112",
          },
        },
        {
          name: "U 238.5",
          odds: {
            MGM: "-130",
            FD: "-135",
            DK: "-135",
            BR: "-132",
          },
        },
      ],
      playerProps: [
        {
          title: "LeBron James Points",
          options: [
            {
              name: "Over 24.5",
              odds: {
                MGM: "-115",
                FD: "-120",
                DK: "-120",
                BR: "-118",
              },
            },
            {
              name: "Under 24.5",
              odds: {
                MGM: "-105",
                FD: "+100",
                DK: "+100",
                BR: "-102",
              },
            },
          ],
        },
        {
          title: "Stephen Curry 3-Pointers",
          options: [
            {
              name: "Over 4.5",
              odds: {
                MGM: "-135",
                FD: "-140",
                DK: "-140",
                BR: "-138",
              },
            },
            {
              name: "Under 4.5",
              odds: {
                MGM: "+115",
                FD: "+120",
                DK: "+120",
                BR: "+118",
              },
            },
          ],
        },
      ],
    },
  },
  {
    id: 2,
    homeTeam: {
      name: "Boston Celtics",
      abbreviation: "BOS",
      record: "27-10",
      score: 95,
    },
    awayTeam: {
      name: "Milwaukee Bucks",
      abbreviation: "MIL",
      record: "25-12",
      score: 92,
    },
    date: "Jan 25, 2024",
    time: "20:00",
    status: "Live",
    odds: {
      spread: "BOS -5.5",
      total: "O/U 228.5",
      moneyline: "BOS -220",
    },
    detailedOdds: {
      spread: {
        away: {
          MGM: "+5.5 (-110)",
          FD: "+5.5 (-110)",
          DK: "+5.5 (-110)",
          BR: "+5.5 (-110)",
        },
        home: {
          MGM: "-5.5 (-110)",
          FD: "-5.5 (-110)",
          DK: "-5.5 (-110)",
          BR: "-5.5 (-110)",
        },
      },
      total: {
        over: {
          MGM: "O 228.5 (-110)",
          FD: "O 228.5 (-110)",
          DK: "O 228.5 (-110)",
          BR: "O 228.5 (-110)",
        },
        under: {
          MGM: "U 228.5 (-110)",
          FD: "U 228.5 (-110)",
          DK: "U 228.5 (-110)",
          BR: "U 228.5 (-110)",
        },
      },
      moneyline: {
        away: {
          MGM: "+180",
          FD: "+185",
          DK: "+180",
          BR: "+182",
        },
        home: {
          MGM: "-220",
          FD: "-225",
          DK: "-220",
          BR: "-222",
        },
      },
      firstQuarter: {
        spread: {
          away: {
            MGM: "+1.5 (-110)",
            FD: "+1.5 (-110)",
            DK: "+1.5 (-110)",
            BR: "+1.5 (-110)",
          },
          home: {
            MGM: "-1.5 (-110)",
            FD: "-1.5 (-110)",
            DK: "-1.5 (-110)",
            BR: "-1.5 (-110)",
          },
        },
        total: {
          over: {
            MGM: "O 57.5 (-110)",
            FD: "O 57.5 (-110)",
            DK: "O 57.5 (-110)",
            BR: "O 57.5 (-110)",
          },
          under: {
            MGM: "U 57.5 (-110)",
            FD: "U 57.5 (-110)",
            DK: "U 57.5 (-110)",
            BR: "U 57.5 (-110)",
          },
        },
      },
      firstHalf: {
        spread: {
          away: {
            MGM: "+3 (-110)",
            FD: "+3 (-110)",
            DK: "+3 (-110)",
            BR: "+3 (-110)",
          },
          home: {
            MGM: "-3 (-110)",
            FD: "-3 (-110)",
            DK: "-3 (-110)",
            BR: "-3 (-110)",
          },
        },
        total: {
          over: {
            MGM: "O 114.5 (-110)",
            FD: "O 114.5 (-110)",
            DK: "O 114.5 (-110)",
            BR: "O 114.5 (-110)",
          },
          under: {
            MGM: "U 114.5 (-110)",
            FD: "U 114.5 (-110)",
            DK: "U 114.5 (-110)",
            BR: "U 114.5 (-110)",
          },
        },
      },
      alternativeSpreads: [
        {
          name: "MIL +7.5",
          odds: {
            MGM: "-140",
            FD: "-145",
            DK: "-145",
            BR: "-142",
          },
        },
        {
          name: "MIL +3.5",
          odds: {
            MGM: "+115",
            FD: "+120",
            DK: "+120",
            BR: "+118",
          },
        },
        {
          name: "BOS -7.5",
          odds: {
            MGM: "+120",
            FD: "+125",
            DK: "+125",
            BR: "+122",
          },
        },
        {
          name: "BOS -3.5",
          odds: {
            MGM: "-135",
            FD: "-140",
            DK: "-140",
            BR: "-138",
          },
        },
      ],
      alternativeTotals: [
        {
          name: "O 225.5",
          odds: {
            MGM: "-130",
            FD: "-135",
            DK: "-135",
            BR: "-132",
          },
        },
        {
          name: "U 225.5",
          odds: {
            MGM: "+110",
            FD: "+115",
            DK: "+115",
            BR: "+112",
          },
        },
        {
          name: "O 231.5",
          odds: {
            MGM: "+110",
            FD: "+115",
            DK: "+115",
            BR: "+112",
          },
        },
        {
          name: "U 231.5",
          odds: {
            MGM: "-130",
            FD: "-135",
            DK: "-135",
            BR: "-132",
          },
        },
      ],
      playerProps: [
        {
          title: "Giannis Antetokounmpo Points",
          options: [
            {
              name: "Over 29.5",
              odds: {
                MGM: "-115",
                FD: "-115",
                DK: "-115",
                BR: "-115",
              },
            },
            {
              name: "Under 29.5",
              odds: {
                MGM: "-105",
                FD: "-105",
                DK: "-105",
                BR: "-105",
              },
            },
          ],
        },
        {
          title: "Jayson Tatum Rebounds",
          options: [
            {
              name: "Over 8.5",
              odds: {
                MGM: "-120",
                FD: "-125",
                DK: "-120",
                BR: "-122",
              },
            },
            {
              name: "Under 8.5",
              odds: {
                MGM: "+100",
                FD: "+105",
                DK: "+100",
                BR: "+102",
              },
            },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    homeTeam: {
      name: "Denver Nuggets",
      abbreviation: "DEN",
      record: "24-13",
    },
    awayTeam: {
      name: "Phoenix Suns",
      abbreviation: "PHX",
      record: "21-16",
    },
    date: "Jan 26, 2024",
    time: "21:00",
    status: "Upcoming",
    odds: {
      spread: "DEN -3.0",
      total: "O/U 227.5",
      moneyline: "DEN -150",
    },
    detailedOdds: {
      spread: {
        away: {
          MGM: "+3 (-110)",
          FD: "+3 (-110)",
          DK: "+3 (-110)",
          BR: "+3 (-110)",
        },
        home: {
          MGM: "-3 (-110)",
          FD: "-3 (-110)",
          DK: "-3 (-110)",
          BR: "-3 (-110)",
        },
      },
      total: {
        over: {
          MGM: "O 227.5 (-110)",
          FD: "O 227.5 (-110)",
          DK: "O 227.5 (-110)",
          BR: "O 227.5 (-110)",
        },
        under: {
          MGM: "U 227.5 (-110)",
          FD: "U 227.5 (-110)",
          DK: "U 227.5 (-110)",
          BR: "U 227.5 (-110)",
        },
      },
      moneyline: {
        away: {
          MGM: "+130",
          FD: "+135",
          DK: "+130",
          BR: "+132",
        },
        home: {
          MGM: "-150",
          FD: "-155",
          DK: "-150",
          BR: "-152",
        },
      },
      firstQuarter: {
        spread: {
          away: {
            MGM: "+0.5 (-110)",
            FD: "+0.5 (-110)",
            DK: "+0.5 (-110)",
            BR: "+0.5 (-110)",
          },
          home: {
            MGM: "-0.5 (-110)",
            FD: "-0.5 (-110)",
            DK: "-0.5 (-110)",
            BR: "-0.5 (-110)",
          },
        },
        total: {
          over: {
            MGM: "O 58.5 (-110)",
            FD: "O 58.5 (-110)",
            DK: "O 58.5 (-110)",
            BR: "O 58.5 (-110)",
          },
          under: {
            MGM: "U 58.5 (-110)",
            FD: "U 58.5 (-110)",
            DK: "U 58.5 (-110)",
            BR: "U 58.5 (-110)",
          },
        },
      },
      firstHalf: {
        spread: {
          away: {
            MGM: "+1.5 (-110)",
            FD: "+1.5 (-110)",
            DK: "+1.5 (-110)",
            BR: "+1.5 (-110)",
          },
          home: {
            MGM: "-1.5 (-110)",
            FD: "-1.5 (-110)",
            DK: "-1.5 (-110)",
            BR: "-1.5 (-110)",
          },
        },
        total: {
          over: {
            MGM: "O 115.5 (-110)",
            FD: "O 115.5 (-110)",
            DK: "O 115.5 (-110)",
            BR: "O 115.5 (-110)",
          },
          under: {
            MGM: "U 115.5 (-110)",
            FD: "U 115.5 (-110)",
            DK: "U 115.5 (-110)",
            BR: "U 115.5 (-110)",
          },
        },
      },
      alternativeSpreads: [
        {
          name: "PHX +5.0",
          odds: {
            MGM: "-140",
            FD: "-140",
            DK: "-140",
            BR: "-140",
          },
        },
        {
          name: "PHX +1.0",
          odds: {
            MGM: "+105",
            FD: "+110",
            DK: "+105",
            BR: "+108",
          },
        },
        {
          name: "DEN -5.0",
          odds: {
            MGM: "+120",
            FD: "+120",
            DK: "+120",
            BR: "+120",
          },
        },
        {
          name: "DEN -1.0",
          odds: {
            MGM: "-125",
            FD: "-130",
            DK: "-125",
            BR: "-128",
          },
        },
      ],
      alternativeTotals: [
        {
          name: "O 224.5",
          odds: {
            MGM: "-130",
            FD: "-130",
            DK: "-130",
            BR: "-130",
          },
        },
        {
          name: "U 224.5",
          odds: {
            MGM: "+110",
            FD: "+110",
            DK: "+110",
            BR: "+110",
          },
        },
        {
          name: "O 230.5",
          odds: {
            MGM: "+110",
            FD: "+110",
            DK: "+110",
            BR: "+110",
          },
        },
        {
          name: "U 230.5",
          odds: {
            MGM: "-130",
            FD: "-130",
            DK: "-130",
            BR: "-130",
          },
        },
      ],
      playerProps: [
        {
          title: "Kevin Durant Points",
          options: [
            {
              name: "Over 27.5",
              odds: {
                MGM: "-115",
                FD: "-115",
                DK: "-115",
                BR: "-115",
              },
            },
            {
              name: "Under 27.5",
              odds: {
                MGM: "-105",
                FD: "-105",
                DK: "-105",
                BR: "-105",
              },
            },
          ],
        },
        {
          title: "Nikola Jokić Triple Double",
          options: [
            {
              name: "Yes",
              odds: {
                MGM: "+200",
                FD: "+220",
                DK: "+200",
                BR: "+210",
              },
            },
            {
              name: "No",
              odds: {
                MGM: "-250",
                FD: "-270",
                DK: "-250",
                BR: "-260",
              },
            },
          ],
        },
      ],
    },
  },
];
