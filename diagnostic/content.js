/* Business Diagnostic Tool, content layer.
   Everything a human might want to edit lives in this file. Wording, options,
   weights, thresholds, report prose. The engine reads it and never hardcodes copy.
   Strict JSON after the assignment, so build-spec-xlsx.py can parse it directly.

   Evidence clauses are separate on purpose. A clause whose data came back
   "Not sure" drops out of the sentence rather than leaving a gap in it. */
window.DIAG ={
  "meta": {
    "version": "0.1",
    "workingTitle": "Business Diagnostic",
    "questionCount": 52
  },
  "thresholds": {
    "PRIMARY_FAIL": 60,
    "MINOR_PRINT": 65,
    "FALLBACK_FLOOR": 35,
    "RISK_FAMILY_PRINT": 45,
    "MINOR_RISK_PRINT": 60,
    "FLAG_PRINT": 55,
    "MAX_FLAGS_SHOWN": 3,
    "NOT_SURE_DATA_FLAG": 4
  },
  "chain": [
    "cashflow",
    "talent",
    "fulfilment",
    "value",
    "offer",
    "demand",
    "margin"
  ],
  "constraints": {
    "cashflow": {
      "name": "Cash flow constrained",
      "short": "Cash flow",
      "loose": "Cash flow"
    },
    "talent": {
      "name": "Talent constrained",
      "short": "Talent",
      "loose": "Talent"
    },
    "fulfilment": {
      "name": "Fulfilment constrained",
      "short": "Fulfilment",
      "loose": "Fulfilment"
    },
    "value": {
      "name": "Value constrained",
      "short": "Value",
      "loose": "Value"
    },
    "offer": {
      "name": "Offer constrained",
      "short": "Offer",
      "loose": "Offer"
    },
    "demand": {
      "name": "Demand constrained",
      "short": "Demand",
      "loose": "Demand"
    },
    "margin": {
      "name": "Margin constrained",
      "short": "Margin",
      "loose": "Margin"
    }
  },
  "suppresses": {
    "cashflow": [
      "margin"
    ],
    "talent": [
      "fulfilment"
    ],
    "fulfilment": [
      "value"
    ],
    "value": [],
    "offer": [
      "demand"
    ],
    "demand": [
      "offer"
    ],
    "margin": []
  },
  "riskFamilies": {
    "concentration": {
      "name": "Concentration",
      "line": "One of something that should be many."
    },
    "fragility": {
      "name": "Fragility",
      "line": "The business can't absorb a hit."
    },
    "owner": {
      "name": "Owner",
      "line": "The business owns you."
    }
  },
  "questions": [
    {
      "id": "q1",
      "section": "profiling",
      "n": 1,
      "weight": 0,
      "text": "Roughly what did the business turn over in the last 12 months?",
      "help": "Revenue, before costs. A ballpark is fine.",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Under $250k",
          "band": "under $250k",
          "size": 1
        },
        {
          "id": "b",
          "text": "$250k to $1m",
          "band": "between $250k and $1m",
          "size": 2
        },
        {
          "id": "c",
          "text": "$1m to $3m",
          "band": "between $1m and $3m",
          "size": 3
        },
        {
          "id": "d",
          "text": "$3m to $10m",
          "band": "between $3m and $10m",
          "size": 4
        },
        {
          "id": "e",
          "text": "Over $10m",
          "band": "over $10m",
          "size": 5
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "size": 2
        }
      ]
    },
    {
      "id": "q2",
      "section": "profiling",
      "n": 2,
      "weight": 0,
      "text": "How many people work in the business, including you?",
      "help": "Count anyone you pay regularly, full time, part time or contract.",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Just me",
          "band": "on your own",
          "team": 1
        },
        {
          "id": "b",
          "text": "2 to 5",
          "band": "with a team of two to five",
          "team": 2
        },
        {
          "id": "c",
          "text": "6 to 15",
          "band": "with a team of six to fifteen",
          "team": 3
        },
        {
          "id": "d",
          "text": "16 to 50",
          "band": "with a team of sixteen to fifty",
          "team": 4
        },
        {
          "id": "e",
          "text": "More than 50",
          "band": "with more than fifty people",
          "team": 5
        }
      ]
    },
    {
      "id": "q3",
      "section": "profiling",
      "n": 3,
      "weight": 0,
      "text": "What does the business sell?",
      "type": "multi",
      "options": [
        {
          "id": "a",
          "text": "Hiring out equipment or gear"
        },
        {
          "id": "b",
          "text": "Doing the work for the client"
        },
        {
          "id": "c",
          "text": "Selling products the customer keeps"
        },
        {
          "id": "d",
          "text": "Supplying people, labour or crew"
        },
        {
          "id": "e",
          "text": "Space or a venue"
        },
        {
          "id": "f",
          "text": "Advice, consulting or training"
        },
        {
          "id": "g",
          "text": "Software or subscriptions"
        }
      ],
      "help": "Tick everything that applies. Most businesses are more than one of these.",
      "max": 7
    },
    {
      "id": "q53",
      "section": "profiling",
      "n": 4,
      "weight": 0,
      "text": "How does revenue usually repeat?",
      "help": "The shape of it, not the size.",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Ongoing contracts or retainers",
          "band": "on contracts and retainers",
          "model": "recurring"
        },
        {
          "id": "b",
          "text": "Same customers buy several times a year",
          "band": "from customers who buy often",
          "model": "repeat"
        },
        {
          "id": "c",
          "text": "Same customers come back, but not often",
          "band": "from customers who come back occasionally",
          "model": "occasional"
        },
        {
          "id": "d",
          "text": "Mostly one off, rarely the same customer twice",
          "band": "one job at a time",
          "model": "oneoff",
          "oneoff": true
        }
      ]
    },
    {
      "id": "q4",
      "section": "profiling",
      "n": 5,
      "weight": 0,
      "text": "How long has the business been trading?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Under 2 years",
          "band": "under two years in",
          "age": 1
        },
        {
          "id": "b",
          "text": "2 to 5 years",
          "band": "two to five years in",
          "age": 2
        },
        {
          "id": "c",
          "text": "5 to 10 years",
          "band": "five to ten years in",
          "age": 3
        },
        {
          "id": "d",
          "text": "More than 10 years",
          "band": "more than ten years in",
          "age": 4
        }
      ]
    },
    {
      "id": "q5",
      "section": "profiling",
      "n": 6,
      "weight": 0,
      "text": "Where does most of your week actually go?",
      "help": "Not where you want it to go. Where it went last week.",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Doing the work the customer pays for",
          "band": "doing the work the customer pays for",
          "ownerRole": "doer"
        },
        {
          "id": "b",
          "text": "Running the team and the day to day",
          "band": "running the day to day",
          "ownerRole": "manager"
        },
        {
          "id": "c",
          "text": "Selling and winning work",
          "band": "selling",
          "ownerRole": "seller"
        },
        {
          "id": "d",
          "text": "Split across all of it, whatever is on fire",
          "band": "split across whatever is on fire",
          "ownerRole": "firefighter"
        },
        {
          "id": "e",
          "text": "Working on the business rather than in it",
          "band": "working on the business",
          "ownerRole": "owner"
        }
      ]
    },
    {
      "id": "q54",
      "section": "cashflow",
      "n": 7,
      "weight": 1.3,
      "text": "How do you get paid on a typical job?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "All of it upfront, before we start",
          "band": "in full before you start",
          "w": 0
        },
        {
          "id": "b",
          "text": "A deposit upfront, balance on completion",
          "band": "on a deposit and a balance at the end",
          "w": 20
        },
        {
          "id": "c",
          "text": "Progress payments across the job",
          "band": "in progress payments",
          "w": 25
        },
        {
          "id": "d",
          "text": "A deposit upfront, balance on terms after",
          "band": "on a deposit, with the balance on terms",
          "w": 50
        },
        {
          "id": "e",
          "text": "Nothing upfront, invoiced on completion",
          "band": "with nothing upfront",
          "w": 75
        },
        {
          "id": "f",
          "text": "Nothing upfront, invoiced on terms after",
          "band": "with nothing upfront and the rest on terms",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q6",
      "section": "cashflow",
      "n": 8,
      "weight": 1.2,
      "text": "In the last 6 months, how often have you delayed paying a supplier, a bill or yourself because the money hadn't landed yet?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Never",
          "band": "never",
          "w": 0
        },
        {
          "id": "b",
          "text": "Once or twice",
          "band": "once or twice",
          "w": 30
        },
        {
          "id": "c",
          "text": "Most months",
          "band": "most months",
          "w": 80
        },
        {
          "id": "d",
          "text": "Every month",
          "band": "every month",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q7",
      "section": "cashflow",
      "n": 9,
      "weight": 1.0,
      "text": "Once you've invoiced the balance, how long until it's actually in the account?",
      "type": "single",
      "exact": {
        "label": "If you know the average, how many days?",
        "unit": "days"
      },
      "options": [
        {
          "id": "a",
          "text": "Paid upfront or on the day",
          "band": "upfront or on the day",
          "w": 0
        },
        {
          "id": "b",
          "text": "Within 14 days",
          "band": "inside a fortnight",
          "w": 15
        },
        {
          "id": "c",
          "text": "15 to 30 days",
          "band": "in the 15 to 30 day range",
          "w": 40
        },
        {
          "id": "d",
          "text": "31 to 60 days",
          "band": "in the 31 to 60 day range",
          "w": 75
        },
        {
          "id": "e",
          "text": "More than 60 days",
          "band": "beyond 60 days",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q8",
      "section": "cashflow",
      "n": 10,
      "weight": 1.3,
      "text": "If revenue stopped tomorrow, how long could you cover wages and fixed costs from the cash you have?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "More than 3 months",
          "band": "more than three months of cover",
          "w": 0
        },
        {
          "id": "b",
          "text": "1 to 3 months",
          "band": "one to three months of cover",
          "w": 25
        },
        {
          "id": "c",
          "text": "2 to 4 weeks",
          "band": "two to four weeks of cover",
          "w": 70,
          "flags": [
            "no_buffer"
          ]
        },
        {
          "id": "d",
          "text": "Under 2 weeks",
          "band": "under a fortnight of cover",
          "w": 100,
          "flags": [
            "no_buffer"
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            "no_buffer"
          ]
        }
      ]
    },
    {
      "id": "q9",
      "section": "cashflow",
      "n": 11,
      "weight": 1.2,
      "text": "In the last 12 months, have you turned down or delayed work because you couldn't fund the upfront cost of it?",
      "help": "Stock, deposits, wages, gear hire, anything you'd have to pay for before the customer pays you.",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "No",
          "band": "never",
          "w": 0
        },
        {
          "id": "b",
          "text": "Once",
          "band": "once",
          "w": 45
        },
        {
          "id": "c",
          "text": "A few times",
          "band": "a few times",
          "w": 85
        },
        {
          "id": "d",
          "text": "Regularly",
          "band": "regularly",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q10",
      "section": "cashflow",
      "n": 12,
      "weight": 0.8,
      "text": "Over the last 12 months, was the business profitable on paper?",
      "help": "On paper, meaning the accountant's version, not what's in the bank.",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Yes, clearly",
          "band": "profitable on paper",
          "w": 100
        },
        {
          "id": "b",
          "text": "Roughly break even",
          "band": "about breaking even",
          "w": 60
        },
        {
          "id": "c",
          "text": "No, we lost money",
          "band": "losing money",
          "w": 0,
          "disqualify": "cashflow"
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 30
        }
      ]
    },
    {
      "id": "q55",
      "section": "cashflow",
      "n": 13,
      "weight": 1.2,
      "text": "How much money are you owed right now that's past its due date?",
      "help": "What your clients owe you, not what you owe anyone.",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Nothing",
          "band": "nothing",
          "w": 0
        },
        {
          "id": "b",
          "text": "Under a week's revenue",
          "band": "under a week of revenue",
          "w": 30
        },
        {
          "id": "c",
          "text": "One to four weeks' revenue",
          "band": "one to four weeks of revenue",
          "w": 70
        },
        {
          "id": "d",
          "text": "More than a month's revenue",
          "band": "more than a month of revenue",
          "w": 100
        },
        {
          "id": "z",
          "text": "I don't know",
          "notSure": true,
          "w": 0,
          "flags": [
            {
              "id": "no_data",
              "sev": 80
            }
          ]
        }
      ]
    },
    {
      "id": "q11",
      "section": "talent",
      "n": 14,
      "weight": 1.4,
      "text": "Which of these are somebody's actual job, not something you pick up when you get a minute?",
      "help": "Tick every one that has a real owner other than you.",
      "type": "multi",
      "max": 6,
      "options": [
        {
          "id": "a",
          "text": "Running day to day operations",
          "w": 0
        },
        {
          "id": "b",
          "text": "Owning sales",
          "w": 0
        },
        {
          "id": "c",
          "text": "Owning marketing",
          "w": 0
        },
        {
          "id": "d",
          "text": "Owning the numbers",
          "w": 0
        },
        {
          "id": "e",
          "text": "Managing the delivery team",
          "w": 0
        },
        {
          "id": "n",
          "text": "None of these, they all sit with me",
          "w": 100,
          "exclusive": true,
          "flags": [
            "no_2ic"
          ]
        }
      ],
      "scoreRule": "unowned_layers"
    },
    {
      "id": "q12",
      "section": "talent",
      "n": 15,
      "weight": 1.2,
      "text": "If you were uncontactable for a month, what happens to the business?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "It runs fine",
          "band": "runs fine without you",
          "w": 0
        },
        {
          "id": "b",
          "text": "It runs, but decisions pile up waiting for me",
          "band": "runs, but the decisions wait for you",
          "w": 45
        },
        {
          "id": "c",
          "text": "It degrades quickly",
          "band": "degrades quickly without you",
          "w": 85,
          "flags": [
            "key_person"
          ]
        },
        {
          "id": "d",
          "text": "It stops",
          "band": "stops without you",
          "w": 100,
          "flags": [
            "key_person"
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q13",
      "section": "talent",
      "n": 16,
      "weight": 1.2,
      "text": "Which of these ate the most of your week?",
      "type": "multi",
      "options": [
        {
          "id": "a",
          "text": "Quoting and pricing jobs"
        },
        {
          "id": "b",
          "text": "Selling and chasing leads"
        },
        {
          "id": "c",
          "text": "Doing the delivery work yourself"
        },
        {
          "id": "d",
          "text": "Scheduling and rostering"
        },
        {
          "id": "e",
          "text": "Chasing invoices and doing the books"
        },
        {
          "id": "f",
          "text": "Marketing and posting"
        },
        {
          "id": "g",
          "text": "Answering questions your team could answer"
        },
        {
          "id": "h",
          "text": "Fixing things that went wrong"
        },
        {
          "id": "n",
          "text": "None of these, my week went elsewhere",
          "exclusive": true
        }
      ],
      "help": "Pick up to three. Last week, not a typical week.",
      "max": 3,
      "scoreRule": "owner_task_load"
    },
    {
      "id": "q56",
      "section": "talent",
      "n": 17,
      "weight": 1.1,
      "text": "How much of last week went to any of these?",
      "help": "Partnerships and relationships, planning the next twelve months, working on pricing or the model, hiring, or building something that outlasts this month.",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "More than a day",
          "band": "more than a day a week",
          "w": 0
        },
        {
          "id": "b",
          "text": "Half a day",
          "band": "about half a day a week",
          "w": 35
        },
        {
          "id": "c",
          "text": "An hour or two",
          "band": "an hour or two",
          "w": 80
        },
        {
          "id": "d",
          "text": "None of it",
          "band": "none of it",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q14",
      "section": "talent",
      "n": 18,
      "weight": 1.2,
      "text": "In the last 12 months, has a new product, a new location, a new market or an idea you've been sitting on stalled because you had nobody to give it to and no time to do it yourself?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "No",
          "band": "never",
          "w": 0
        },
        {
          "id": "b",
          "text": "Once",
          "band": "once",
          "w": 40
        },
        {
          "id": "c",
          "text": "A few times",
          "band": "a few times",
          "w": 80
        },
        {
          "id": "d",
          "text": "That's the normal state",
          "band": "as a matter of routine",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q15",
      "section": "talent",
      "n": 19,
      "weight": 0.9,
      "text": "How many people report directly to you?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Nobody",
          "band": "nobody reporting to you",
          "w": 0
        },
        {
          "id": "b",
          "text": "1 to 3",
          "band": "one to three direct reports",
          "w": 10
        },
        {
          "id": "c",
          "text": "4 to 7",
          "band": "four to seven direct reports",
          "w": 45
        },
        {
          "id": "d",
          "text": "8 to 12",
          "band": "eight to twelve direct reports",
          "w": 90
        },
        {
          "id": "e",
          "text": "More than 12",
          "band": "more than twelve direct reports",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q16",
      "section": "fulfilment",
      "n": 20,
      "weight": 1.3,
      "text": "How booked is your delivery capacity for the next 30 days?",
      "help": "Capacity meaning the hours, people or stock you'd need to actually do the work.",
      "type": "single",
      "exact": {
        "label": "If you track it, what percentage booked?",
        "unit": "%"
      },
      "options": [
        {
          "id": "a",
          "text": "Under half full",
          "band": "under half full",
          "w": 0
        },
        {
          "id": "b",
          "text": "About two thirds",
          "band": "around two thirds full",
          "w": 25
        },
        {
          "id": "c",
          "text": "Near full",
          "band": "at or near full",
          "w": 70
        },
        {
          "id": "d",
          "text": "Full, with a waitlist",
          "band": "full, with people waiting",
          "w": 95
        },
        {
          "id": "e",
          "text": "Over capacity, we're behind",
          "band": "over capacity and behind",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q17",
      "section": "fulfilment",
      "n": 21,
      "weight": 1.3,
      "text": "In the last 6 months, have you turned work away or pushed out a start date because you couldn't fit it in?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "No",
          "band": "never",
          "w": 0
        },
        {
          "id": "b",
          "text": "Once or twice",
          "band": "once or twice",
          "w": 40
        },
        {
          "id": "c",
          "text": "Most months",
          "band": "most months",
          "w": 85
        },
        {
          "id": "d",
          "text": "Constantly",
          "band": "constantly",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q18",
      "section": "fulfilment",
      "n": 22,
      "weight": 1.0,
      "text": "What's happened to your lead time in the last 12 months?",
      "help": "Lead time meaning how long a customer waits from saying yes to getting the work.",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Shorter",
          "band": "come down",
          "w": 0
        },
        {
          "id": "b",
          "text": "About the same",
          "band": "held steady",
          "w": 25
        },
        {
          "id": "c",
          "text": "Longer",
          "band": "stretched out",
          "w": 75
        },
        {
          "id": "d",
          "text": "Much longer",
          "band": "blown out",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q19",
      "section": "fulfilment",
      "n": 23,
      "weight": 1.1,
      "text": "How far ahead is a typical job actually ready?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Comfortably ahead",
          "band": "comfortably ahead of time",
          "w": 0
        },
        {
          "id": "b",
          "text": "A few days ahead",
          "band": "a few days ahead",
          "w": 40
        },
        {
          "id": "c",
          "text": "The day before",
          "band": "the day before",
          "w": 85
        },
        {
          "id": "d",
          "text": "We're finishing it as it starts",
          "band": "only as it starts",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ],
      "help": "Ready meaning done, not still being finished off."
    },
    {
      "id": "q20",
      "section": "fulfilment",
      "n": 24,
      "weight": 0.9,
      "text": "Outside of delivery days, is the team working nights and weekends to keep up?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "No",
          "band": "no",
          "w": 0
        },
        {
          "id": "b",
          "text": "Occasionally",
          "band": "occasionally",
          "w": 30
        },
        {
          "id": "c",
          "text": "Most weeks",
          "band": "most weeks",
          "w": 85
        },
        {
          "id": "d",
          "text": "Constantly",
          "band": "constantly",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ],
      "help": "Long hours on an event day or a job site are the job. This is about the weeks in between."
    },
    {
      "id": "q21",
      "section": "value",
      "n": 25,
      "weight": 1.3,
      "text": "Of the customers who bought from you a year ago, roughly how many still buy from you?",
      "type": "single",
      "exact": {
        "label": "If you know the number, what percentage came back?",
        "unit": "%"
      },
      "options": [
        {
          "id": "a",
          "text": "Most of them, over 70%",
          "band": "above 70%",
          "w": 0
        },
        {
          "id": "b",
          "text": "About half",
          "band": "around half",
          "w": 45
        },
        {
          "id": "c",
          "text": "Under a third",
          "band": "under a third",
          "w": 85
        },
        {
          "id": "d",
          "text": "Almost none",
          "band": "close to none",
          "w": 100
        },
        {
          "id": "e",
          "text": "We're one off by nature, they don't come back",
          "band": "one off by design",
          "w": 20,
          "oneoff": true
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q57",
      "section": "value",
      "n": 26,
      "weight": 1.4,
      "text": "Of the work your existing customers put out, how much of it comes to you?",
      "help": "Not how many customers you keep. How much of what they spend you actually get.",
      "type": "single",
      "exact": {
        "label": "If you know it, what percentage?",
        "unit": "%"
      },
      "options": [
        {
          "id": "a",
          "text": "Nearly all of it",
          "band": "nearly all",
          "w": 0
        },
        {
          "id": "b",
          "text": "More than half",
          "band": "more than half",
          "w": 25
        },
        {
          "id": "c",
          "text": "About half",
          "band": "about half",
          "w": 60
        },
        {
          "id": "d",
          "text": "Less than half",
          "band": "less than half",
          "w": 85
        },
        {
          "id": "e",
          "text": "A small slice, they spread it around",
          "band": "only a small slice",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            {
              "id": "no_data",
              "sev": 70
            }
          ]
        }
      ]
    },
    {
      "id": "q22",
      "section": "value",
      "n": 27,
      "weight": 1.1,
      "text": "How often do customers come back and buy again without you chasing them?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Usually",
          "band": "usually",
          "w": 0
        },
        {
          "id": "b",
          "text": "Sometimes",
          "band": "sometimes",
          "w": 40
        },
        {
          "id": "c",
          "text": "Rarely",
          "band": "rarely",
          "w": 85
        },
        {
          "id": "d",
          "text": "Never",
          "band": "never",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q23",
      "section": "value",
      "n": 28,
      "weight": 1.2,
      "text": "How many of your new customers arrive through a referral from an existing one?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Most of them",
          "band": "most of them",
          "w": 0
        },
        {
          "id": "b",
          "text": "About half",
          "band": "about half",
          "w": 30
        },
        {
          "id": "c",
          "text": "A few",
          "band": "a few",
          "w": 75
        },
        {
          "id": "d",
          "text": "Almost none",
          "band": "almost none",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q24",
      "section": "value",
      "n": 29,
      "weight": 1.2,
      "text": "In the last 12 months, how many customers have moved some or all of their work to a competitor?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Almost none",
          "band": "almost none",
          "w": 0
        },
        {
          "id": "b",
          "text": "A handful",
          "band": "a handful",
          "w": 40
        },
        {
          "id": "c",
          "text": "A steady stream",
          "band": "a steady stream",
          "w": 85
        },
        {
          "id": "d",
          "text": "Most of them",
          "band": "most of them",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q25",
      "section": "value",
      "n": 30,
      "weight": 0.8,
      "text": "Do you know why customers stop buying, or go to a competitor?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Yes, we ask them and we know",
          "band": "you ask them and you know",
          "w": 0
        },
        {
          "id": "b",
          "text": "We have a theory",
          "band": "you have a theory",
          "w": 55
        },
        {
          "id": "c",
          "text": "No idea",
          "band": "no idea",
          "w": 100,
          "flags": [
            "no_data"
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            "no_data"
          ]
        }
      ]
    },
    {
      "id": "q26",
      "section": "offer",
      "n": 31,
      "weight": 1.4,
      "text": "Of the people who enquire and get a quote or a proposal, how many go ahead?",
      "type": "single",
      "exact": {
        "label": "If you know your close rate, what is it?",
        "unit": "%"
      },
      "options": [
        {
          "id": "a",
          "text": "More than half",
          "band": "above 50%",
          "w": 0
        },
        {
          "id": "b",
          "text": "25% to 50%",
          "band": "in the 25 to 50% range",
          "w": 25
        },
        {
          "id": "c",
          "text": "10% to 25%",
          "band": "in the 10 to 25% range",
          "w": 80
        },
        {
          "id": "d",
          "text": "Under 10%",
          "band": "under 10%",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            "no_data"
          ]
        }
      ]
    },
    {
      "id": "q27",
      "section": "offer",
      "n": 32,
      "weight": 1.1,
      "text": "When you lose a deal, what's the most common reason?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Price, we were too expensive",
          "band": "price",
          "w": 55
        },
        {
          "id": "b",
          "text": "Timing, they weren't ready",
          "band": "timing",
          "w": 45
        },
        {
          "id": "c",
          "text": "They went with someone else",
          "band": "a competitor",
          "w": 85
        },
        {
          "id": "d",
          "text": "They did nothing at all",
          "band": "inaction",
          "w": 100
        },
        {
          "id": "e",
          "text": "We don't know",
          "band": "unknown",
          "w": 90,
          "flags": [
            "no_data"
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            "no_data"
          ]
        }
      ]
    },
    {
      "id": "q28",
      "section": "offer",
      "n": 33,
      "weight": 1.0,
      "text": "When a prospect gets your quote, how often do they come back asking what's included, or why it costs what it does?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Rarely, they just decide",
          "band": "rarely",
          "w": 0
        },
        {
          "id": "b",
          "text": "Sometimes",
          "band": "sometimes",
          "w": 40
        },
        {
          "id": "c",
          "text": "Often",
          "band": "often",
          "w": 85
        },
        {
          "id": "d",
          "text": "On most quotes",
          "band": "on most quotes",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q29",
      "section": "offer",
      "n": 34,
      "weight": 1.1,
      "text": "Has the proportion of quotes that turn into work changed in the last 12 months?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Improved",
          "band": "improved",
          "w": 0
        },
        {
          "id": "b",
          "text": "About the same",
          "band": "held steady",
          "w": 30
        },
        {
          "id": "c",
          "text": "Dropped",
          "band": "dropped",
          "w": 80
        },
        {
          "id": "d",
          "text": "Dropped sharply",
          "band": "fallen off a cliff",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            "no_data"
          ]
        }
      ]
    },
    {
      "id": "q30",
      "section": "offer",
      "n": 35,
      "weight": 1.0,
      "text": "How does a prospect find out what you charge?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "There's a price list or packages they can see themselves",
          "band": "from a price list they can see themselves",
          "w": 0
        },
        {
          "id": "b",
          "text": "Standard pricing, but we walk them through it",
          "band": "from standard pricing you walk them through",
          "w": 40
        },
        {
          "id": "c",
          "text": "Every job gets quoted from scratch",
          "band": "from a quote built from scratch every time",
          "w": 90
        },
        {
          "id": "d",
          "text": "It depends who's asking",
          "band": "from a number that depends who's asking",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q31",
      "section": "demand",
      "n": 36,
      "weight": 1.4,
      "text": "How many new enquiries does the business get in a typical month?",
      "help": "New people asking about buying. Not repeat customers.",
      "type": "single",
      "exact": {
        "label": "If you know the number, how many a month?",
        "unit": "a month"
      },
      "options": [
        {
          "id": "a",
          "text": "0 to 2",
          "band": "a handful at most",
          "w": 100
        },
        {
          "id": "b",
          "text": "3 to 10",
          "band": "in the 3 to 10 range",
          "w": 75
        },
        {
          "id": "c",
          "text": "11 to 30",
          "band": "in the 11 to 30 range",
          "w": 35
        },
        {
          "id": "d",
          "text": "31 to 100",
          "band": "in the 31 to 100 range",
          "w": 10
        },
        {
          "id": "e",
          "text": "More than 100",
          "band": "above 100",
          "w": 0
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            "no_data"
          ]
        }
      ]
    },
    {
      "id": "q32",
      "section": "demand",
      "n": 37,
      "weight": 0.8,
      "text": "Where do your enquiries actually come from?",
      "help": "Tick everything that brings you real enquiries.",
      "type": "multi",
      "max": 8,
      "options": [
        {
          "id": "a",
          "text": "Word of mouth and referral",
          "w": 0
        },
        {
          "id": "b",
          "text": "Repeat customers",
          "w": 0
        },
        {
          "id": "c",
          "text": "Paid advertising",
          "w": 0
        },
        {
          "id": "d",
          "text": "Search",
          "w": 0
        },
        {
          "id": "e",
          "text": "Social",
          "w": 0
        },
        {
          "id": "f",
          "text": "Outbound, we go and get it",
          "w": 0
        },
        {
          "id": "g",
          "text": "A partner or a channel",
          "w": 0
        },
        {
          "id": "n",
          "text": "We don't really know",
          "w": 100,
          "exclusive": true,
          "flags": [
            "no_data"
          ]
        }
      ],
      "scoreRule": "channel_count"
    },
    {
      "id": "q33",
      "section": "demand",
      "n": 38,
      "weight": 1.1,
      "text": "Has enquiry volume changed in the last 12 months?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Up",
          "band": "grown",
          "w": 0
        },
        {
          "id": "b",
          "text": "Flat",
          "band": "stayed flat",
          "w": 45
        },
        {
          "id": "c",
          "text": "Down",
          "band": "fallen",
          "w": 85
        },
        {
          "id": "d",
          "text": "Down sharply",
          "band": "fallen sharply",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            "no_data"
          ]
        }
      ]
    },
    {
      "id": "q34",
      "section": "demand",
      "n": 39,
      "weight": 0.6,
      "text": "If twice as many enquiries landed next month, could you deliver the work?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Yes, easily",
          "band": "comfortably",
          "w": 55
        },
        {
          "id": "b",
          "text": "Yes, with a stretch",
          "band": "with a stretch",
          "w": 35
        },
        {
          "id": "c",
          "text": "No, we'd be well over capacity",
          "band": "not a chance",
          "w": 0,
          "disqualify": "demand"
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q35",
      "section": "demand",
      "n": 40,
      "weight": 1.0,
      "text": "Are you doing anything right now to generate new enquiries?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Yes, consistently",
          "band": "consistently",
          "w": 0
        },
        {
          "id": "b",
          "text": "On and off",
          "band": "on and off",
          "w": 60
        },
        {
          "id": "c",
          "text": "No, it all comes to us",
          "band": "nothing, it all comes to you",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q36",
      "section": "margin",
      "n": 41,
      "weight": 1.4,
      "text": "On a typical job or sale, what's left after the direct cost of delivering it?",
      "help": "Direct cost meaning labour, materials, subcontractors, whatever that specific job consumed.",
      "type": "single",
      "exact": {
        "label": "If you know your gross margin, what is it?",
        "unit": "%"
      },
      "options": [
        {
          "id": "a",
          "text": "More than 50%",
          "band": "above 50%",
          "w": 0
        },
        {
          "id": "b",
          "text": "30% to 50%",
          "band": "in the 30 to 50% range",
          "w": 30
        },
        {
          "id": "c",
          "text": "15% to 30%",
          "band": "in the 15 to 30% range",
          "w": 75
        },
        {
          "id": "d",
          "text": "Under 15%",
          "band": "under 15%",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            "no_data"
          ]
        }
      ]
    },
    {
      "id": "q37",
      "section": "margin",
      "n": 42,
      "weight": 1.3,
      "text": "After everything, including paying yourself properly, what's left at the end of a year?",
      "type": "single",
      "exact": {
        "label": "If you know your net margin, what is it?",
        "unit": "%"
      },
      "options": [
        {
          "id": "a",
          "text": "More than 20%",
          "band": "above 20%",
          "w": 0
        },
        {
          "id": "b",
          "text": "10% to 20%",
          "band": "in the 10 to 20% range",
          "w": 25
        },
        {
          "id": "c",
          "text": "1% to 10%",
          "band": "in the 1 to 10% range",
          "w": 80
        },
        {
          "id": "d",
          "text": "Nothing, or a loss",
          "band": "nothing, or a loss",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            "no_data"
          ]
        }
      ]
    },
    {
      "id": "q38",
      "section": "margin",
      "n": 43,
      "weight": 1.0,
      "text": "When did you last raise your prices?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "In the last 6 months",
          "band": "inside the last six months",
          "w": 0
        },
        {
          "id": "b",
          "text": "6 to 12 months ago",
          "band": "in the last year",
          "w": 30
        },
        {
          "id": "c",
          "text": "1 to 2 years ago",
          "band": "one to two years ago",
          "w": 75
        },
        {
          "id": "d",
          "text": "More than 2 years ago",
          "band": "more than two years ago",
          "w": 95
        },
        {
          "id": "e",
          "text": "Never",
          "band": "never",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q39",
      "section": "margin",
      "n": 44,
      "weight": 1.1,
      "text": "How often does a job end up costing more to deliver than you quoted?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Rarely",
          "band": "rarely",
          "w": 0
        },
        {
          "id": "b",
          "text": "Sometimes",
          "band": "sometimes",
          "w": 40
        },
        {
          "id": "c",
          "text": "Often",
          "band": "often",
          "w": 85
        },
        {
          "id": "d",
          "text": "On most jobs",
          "band": "on most jobs",
          "w": 100
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0
        }
      ]
    },
    {
      "id": "q40",
      "section": "margin",
      "n": 45,
      "weight": 0.9,
      "text": "Do you know which customers, jobs or product lines actually make you money?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Yes, job by job or line by line",
          "band": "job by job",
          "w": 0
        },
        {
          "id": "b",
          "text": "Roughly",
          "band": "roughly",
          "w": 55
        },
        {
          "id": "c",
          "text": "No",
          "band": "not at all",
          "w": 100,
          "flags": [
            "no_data"
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "w": 0,
          "flags": [
            "no_data"
          ]
        }
      ]
    },
    {
      "id": "q41",
      "section": "risk",
      "n": 46,
      "weight": 0,
      "text": "What share of your revenue comes from your single biggest customer?",
      "type": "single",
      "exact": {
        "label": "If you know it, what percentage?",
        "unit": "%"
      },
      "options": [
        {
          "id": "a",
          "text": "Under 10%",
          "band": "under 10%",
          "flags": []
        },
        {
          "id": "b",
          "text": "10% to 20%",
          "band": "between 10 and 20%",
          "flags": [
            {
              "id": "key_client",
              "sev": 35
            }
          ]
        },
        {
          "id": "c",
          "text": "20% to 30%",
          "band": "between 20 and 30%",
          "flags": [
            {
              "id": "key_client",
              "sev": 65
            }
          ]
        },
        {
          "id": "d",
          "text": "30% to 50%",
          "band": "between 30 and 50%",
          "flags": [
            {
              "id": "key_client",
              "sev": 90
            }
          ]
        },
        {
          "id": "e",
          "text": "More than 50%",
          "band": "more than half",
          "flags": [
            {
              "id": "key_client",
              "sev": 100
            }
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "flags": [
            {
              "id": "no_data",
              "sev": 70
            }
          ]
        }
      ]
    },
    {
      "id": "q42",
      "section": "risk",
      "n": 47,
      "weight": 0,
      "text": "What share of revenue comes from your single biggest product or service line?",
      "type": "single",
      "exact": {
        "label": "If you know it, what percentage?",
        "unit": "%"
      },
      "options": [
        {
          "id": "a",
          "text": "Under 25%",
          "band": "under a quarter",
          "flags": []
        },
        {
          "id": "b",
          "text": "25% to 50%",
          "band": "a quarter to a half",
          "flags": [
            {
              "id": "key_product",
              "sev": 40
            }
          ]
        },
        {
          "id": "c",
          "text": "50% to 75%",
          "band": "half to three quarters",
          "flags": [
            {
              "id": "key_product",
              "sev": 75
            }
          ]
        },
        {
          "id": "d",
          "text": "More than 75%",
          "band": "more than three quarters",
          "flags": [
            {
              "id": "key_product",
              "sev": 95
            }
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "flags": [
            {
              "id": "no_data",
              "sev": 70
            }
          ]
        }
      ]
    },
    {
      "id": "q43",
      "section": "risk",
      "n": 48,
      "weight": 0,
      "text": "How spread out are the places your new customers come from?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Spread across several",
          "band": "spread across several channels",
          "flags": []
        },
        {
          "id": "b",
          "text": "Two channels carry it",
          "band": "carried by two channels",
          "flags": [
            {
              "id": "key_channel",
              "sev": 50
            }
          ]
        },
        {
          "id": "c",
          "text": "One channel is nearly all of it",
          "band": "almost entirely one channel",
          "flags": [
            {
              "id": "key_channel",
              "sev": 95
            }
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "flags": [
            {
              "id": "no_data",
              "sev": 70
            },
            {
              "id": "key_channel",
              "sev": 50
            }
          ]
        }
      ]
    },
    {
      "id": "q44",
      "section": "risk",
      "n": 49,
      "weight": 0,
      "text": "Which of these is there exactly one of, with nobody and nothing ready to replace it?",
      "help": "Tick every one that would leave a hole tomorrow.",
      "type": "multi",
      "max": 8,
      "options": [
        {
          "id": "a",
          "text": "Your main supplier",
          "flags": [
            {
              "id": "key_supplier",
              "sev": 80
            }
          ]
        },
        {
          "id": "b",
          "text": "The person who wins the work",
          "flags": [
            {
              "id": "key_person",
              "sev": 80
            }
          ]
        },
        {
          "id": "c",
          "text": "The person who knows how the work actually gets done",
          "flags": [
            {
              "id": "key_employee",
              "sev": 85
            }
          ]
        },
        {
          "id": "d",
          "text": "One key piece of equipment, or one vehicle",
          "flags": [
            {
              "id": "key_asset",
              "sev": 75
            }
          ]
        },
        {
          "id": "e",
          "text": "The city or region you sell into",
          "flags": [
            {
              "id": "key_geography",
              "sev": 70
            }
          ]
        },
        {
          "id": "f",
          "text": "One licence, accreditation or insurance the business runs on",
          "flags": [
            {
              "id": "key_licence",
              "sev": 85
            }
          ]
        },
        {
          "id": "g",
          "text": "Your own name and reputation",
          "flags": [
            {
              "id": "key_person",
              "sev": 85
            },
            {
              "id": "owner_trapped",
              "sev": 60
            }
          ]
        },
        {
          "id": "n",
          "text": "None of these",
          "exclusive": true,
          "flags": []
        }
      ]
    },
    {
      "id": "q58",
      "section": "risk",
      "n": 50,
      "weight": 0,
      "text": "Of the ones you just ticked, which would hurt most if it went tomorrow?",
      "type": "single",
      "showIf": {
        "q": "q44",
        "notOnly": [
          "n"
        ]
      },
      "optionsFrom": "q44",
      "options": [
        {
          "id": "a",
          "text": "Your main supplier",
          "boost": "key_supplier"
        },
        {
          "id": "b",
          "text": "The person who wins the work",
          "boost": "key_person"
        },
        {
          "id": "c",
          "text": "The person who knows how the work actually gets done",
          "boost": "key_employee"
        },
        {
          "id": "d",
          "text": "One key piece of equipment, or one vehicle",
          "boost": "key_asset"
        },
        {
          "id": "e",
          "text": "The city or region you sell into",
          "boost": "key_geography"
        },
        {
          "id": "f",
          "text": "One licence, accreditation or insurance the business runs on",
          "boost": "key_licence"
        },
        {
          "id": "g",
          "text": "Your own name and reputation",
          "boost": "key_person"
        }
      ]
    },
    {
      "id": "q45",
      "section": "risk",
      "n": 51,
      "weight": 0,
      "text": "How is your work actually committed by the customer?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Term contracts covering most of it",
          "band": "term contracts",
          "flags": []
        },
        {
          "id": "b",
          "text": "Written agreements job by job",
          "band": "job by job agreements",
          "flags": [
            {
              "id": "no_contracts",
              "sev": 35
            }
          ]
        },
        {
          "id": "c",
          "text": "Month to month, cancellable anytime",
          "band": "month to month",
          "flags": [
            {
              "id": "no_contracts",
              "sev": 75
            }
          ]
        },
        {
          "id": "d",
          "text": "Handshake and email",
          "band": "a handshake and an email",
          "flags": [
            {
              "id": "no_contracts",
              "sev": 95
            }
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "flags": [
            {
              "id": "no_data",
              "sev": 70
            },
            {
              "id": "no_contracts",
              "sev": 60
            }
          ]
        }
      ]
    },
    {
      "id": "q46",
      "section": "risk",
      "n": 52,
      "weight": 0,
      "text": "How much of the work is documented well enough that someone else could pick it up and finish it?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Most of it",
          "band": "Most",
          "flags": []
        },
        {
          "id": "b",
          "text": "About half",
          "band": "About half",
          "flags": [
            {
              "id": "no_process",
              "sev": 55
            }
          ]
        },
        {
          "id": "c",
          "text": "Almost none, it lives in people's heads",
          "band": "Almost none",
          "flags": [
            {
              "id": "no_process",
              "sev": 95
            }
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "flags": [
            {
              "id": "no_process",
              "sev": 80
            },
            {
              "id": "no_data",
              "sev": 60
            }
          ]
        }
      ]
    },
    {
      "id": "q47",
      "section": "risk",
      "n": 53,
      "weight": 0,
      "text": "How often do you look at numbers that tell you how the business is travelling?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Weekly",
          "band": "weekly",
          "flags": []
        },
        {
          "id": "b",
          "text": "Monthly",
          "band": "monthly",
          "flags": [
            {
              "id": "no_data",
              "sev": 25
            }
          ]
        },
        {
          "id": "c",
          "text": "At tax time",
          "band": "once a year at tax time",
          "flags": [
            {
              "id": "no_data",
              "sev": 90
            }
          ]
        },
        {
          "id": "d",
          "text": "We don't really",
          "band": "next to never",
          "flags": [
            {
              "id": "no_data",
              "sev": 100
            }
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "flags": [
            {
              "id": "no_data",
              "sev": 90
            }
          ]
        }
      ]
    },
    {
      "id": "q48",
      "section": "risk",
      "n": 54,
      "weight": 0,
      "text": "If you had to step out for three months starting Monday, who runs it?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "A named person who already does most of it",
          "band": "someone who already does most of it",
          "flags": []
        },
        {
          "id": "b",
          "text": "Someone would step up, but they'd struggle",
          "band": "someone who'd struggle",
          "flags": [
            {
              "id": "no_2ic",
              "sev": 65
            }
          ]
        },
        {
          "id": "c",
          "text": "Nobody",
          "band": "nobody",
          "flags": [
            {
              "id": "no_2ic",
              "sev": 100
            },
            {
              "id": "key_person",
              "sev": 90
            }
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "flags": [
            {
              "id": "no_2ic",
              "sev": 80
            }
          ]
        }
      ]
    },
    {
      "id": "q49",
      "section": "risk",
      "n": 55,
      "weight": 0,
      "text": "If you sold the business tomorrow, how long would the buyer need you to stay on?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Not at all, they could take over",
          "band": "not at all",
          "flags": []
        },
        {
          "id": "b",
          "text": "A few weeks of handover",
          "band": "a few weeks",
          "flags": [
            {
              "id": "owner_trapped",
              "sev": 35
            }
          ]
        },
        {
          "id": "c",
          "text": "Six to twelve months",
          "band": "the best part of a year",
          "flags": [
            {
              "id": "owner_trapped",
              "sev": 80
            }
          ]
        },
        {
          "id": "d",
          "text": "Years, or it doesn't work without me",
          "band": "years",
          "flags": [
            {
              "id": "owner_trapped",
              "sev": 100
            },
            {
              "id": "key_person",
              "sev": 90
            }
          ]
        },
        {
          "id": "z",
          "text": "Never thought about it",
          "notSure": true,
          "flags": [
            {
              "id": "owner_trapped",
              "sev": 70
            },
            {
              "id": "no_succession",
              "sev": 70
            }
          ]
        }
      ],
      "help": "Not what it's worth. How long before they could run it without you."
    },
    {
      "id": "q50",
      "section": "risk",
      "n": 56,
      "weight": 0,
      "text": "Is there a plan for what happens to the business if you stop, sell or step back?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Yes, written down",
          "band": "a written plan",
          "flags": []
        },
        {
          "id": "b",
          "text": "A rough idea in my head",
          "band": "a rough idea",
          "flags": [
            {
              "id": "no_succession",
              "sev": 60
            }
          ]
        },
        {
          "id": "c",
          "text": "No",
          "band": "nothing",
          "flags": [
            {
              "id": "no_succession",
              "sev": 95
            }
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "flags": [
            {
              "id": "no_succession",
              "sev": 80
            }
          ]
        }
      ]
    },
    {
      "id": "q51",
      "section": "risk",
      "n": 57,
      "weight": 0,
      "text": "Have you personally guaranteed any of the business's debt, leases or facilities?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "No",
          "band": "none",
          "flags": []
        },
        {
          "id": "b",
          "text": "Yes, a small amount",
          "band": "a small amount",
          "flags": [
            {
              "id": "personal_guarantee",
              "sev": 45
            }
          ]
        },
        {
          "id": "c",
          "text": "Yes, significant",
          "band": "a significant amount",
          "flags": [
            {
              "id": "personal_guarantee",
              "sev": 95
            }
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "flags": [
            {
              "id": "personal_guarantee",
              "sev": 75
            },
            {
              "id": "no_data",
              "sev": 60
            }
          ]
        }
      ]
    },
    {
      "id": "q52",
      "section": "risk",
      "n": 58,
      "weight": 0,
      "text": "How well does the way you spend your week match what you wanted out of this business?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Well, this is roughly what I signed up for",
          "band": "close to what you signed up for",
          "flags": []
        },
        {
          "id": "b",
          "text": "Partly",
          "band": "only partly a match for what you wanted",
          "flags": [
            {
              "id": "model_misfit",
              "sev": 50
            }
          ]
        },
        {
          "id": "c",
          "text": "Not at all, I'm doing the opposite of what I wanted",
          "band": "the opposite of what you wanted",
          "flags": [
            {
              "id": "model_misfit",
              "sev": 95
            }
          ]
        },
        {
          "id": "z",
          "text": "Not sure",
          "notSure": true,
          "flags": [
            {
              "id": "model_misfit",
              "sev": 60
            }
          ]
        }
      ]
    }
  ],
  "flags": {
    "key_asset": {
      "family": "concentration",
      "name": "Key asset"
    },
    "key_channel": {
      "family": "concentration",
      "name": "Key channel"
    },
    "key_client": {
      "family": "concentration",
      "name": "Key client"
    },
    "key_employee": {
      "family": "concentration",
      "name": "Key employee"
    },
    "key_geography": {
      "family": "concentration",
      "name": "Key geography"
    },
    "key_licence": {
      "family": "concentration",
      "name": "Key licence"
    },
    "key_person": {
      "family": "concentration",
      "name": "Key person"
    },
    "key_product": {
      "family": "concentration",
      "name": "Key product"
    },
    "key_supplier": {
      "family": "concentration",
      "name": "Key supplier"
    },
    "no_2ic": {
      "family": "fragility",
      "name": "No second in command"
    },
    "no_buffer": {
      "family": "fragility",
      "name": "No cash buffer"
    },
    "no_contracts": {
      "family": "fragility",
      "name": "No contracts"
    },
    "no_data": {
      "family": "fragility",
      "name": "No data"
    },
    "no_process": {
      "family": "fragility",
      "name": "No documented process"
    },
    "model_misfit": {
      "family": "owner",
      "name": "Model misfit"
    },
    "no_succession": {
      "family": "owner",
      "name": "No succession"
    },
    "owner_trapped": {
      "family": "owner",
      "name": "Owner trapped"
    },
    "personal_guarantee": {
      "family": "owner",
      "name": "Personally guaranteed"
    }
  },
  "blocks": {
    "opening": {
      "normal": "Everything below comes out of your answers and nothing else. It's a guide rather than a custom diagnostic, so read the benchmarks as a rough shape of what good looks like at your size, not as a measurement of you against your industry.\n\nIt names one constraint. There'll be other things wrong, there always are. They're not in here because the order you fix them in matters more than the list.",
      "wellRun": "Nothing in your answers is close to failing. That's a real result and it's rarer than you'd think.\n\nWhat follows is the tightest thing in the business rather than a problem. Treat it as where the next bit of growth will come from, not something to fix.",
      "tooUnsure": "There were a lot of questions in here you couldn't answer, so read what follows as provisional.\n\nThe finding below is the best available reading of what you did tell us. The bigger issue is that the business isn't visible to you, and that's covered in the risk section. Come back and run this again once you can answer the numbers.",
      "noneSevere": "Nothing in your answers is screaming. That's worth knowing on its own, and it's rarer than you'd think.\n\nWhat follows is the tightest thing in the business right now rather than something that's failing outright. Treat it as the next thing to work on, not an emergency."
    },
    "constraintDef": {
      "cashflow": {
        "title": "Your constraint is cash flow",
        "titleLoose": "The tightest thing is cash flow",
        "open": "You're profitable on paper and short of cash in practice. The work is sold, the money hasn't landed, and there's nothing sitting there to fund the next job.",
        "evidence": [
          {
            "banded": "you get paid {q54.band}"
          },
          {
            "banded": "the balance takes {q7.band} to land",
            "precise": "the balance takes {q7.exact} days to land"
          },
          {
            "banded": "you're owed {q55.band} past its due date"
          },
          {
            "banded": "you've been delaying payments {q6.band}"
          },
          {
            "banded": "you're holding {q8.band}"
          }
        ],
        "close": "That's a timing problem rather than a rate problem. Every job you win right now costs you money before it pays you, which is why winning more of them is currently the worst move available to you."
      },
      "talent": {
        "title": "Your constraint is talent",
        "titleLoose": "The tightest thing is talent",
        "open": [
          "Talent here means a missing layer, not missing hands.",
          "{d.unownedLayers}",
          "Most of last week went to {d.ownerTasks}."
        ],
        "evidence": [
          {
            "banded": "the work that actually moves the business forward got {q56.band}"
          },
          {
            "banded": "if you went dark for a month the business {q12.band}"
          },
          {
            "banded": "something you wanted to grow has stalled for want of anyone to hand it to, {q14.band}"
          }
        ],
        "close": "Hiring another pair of hands underneath you doesn't touch this. What's missing is a whole role that doesn't exist yet, and until it does, everything you add lands on the same desk."
      },
      "fulfilment": {
        "title": "Your constraint is fulfilment",
        "titleLoose": "The tightest thing is fulfilment",
        "open": "This is capacity, not capability. You know how to do the work and you can't get enough hours of it out the door.",
        "evidence": [
          {
            "banded": "you're running {q16.band}",
            "precise": "you're running at {q16.exact}% booked"
          },
          {
            "banded": "you've turned work away or pushed start dates {q17.band}"
          },
          {
            "banded": "lead times have {q18.band}"
          },
          {
            "banded": "a typical job is only ready {q19.band}"
          }
        ],
        "close": "Nothing at the front of the business needs attention until the back of it can breathe. Anything you do to bring in more work right now gets paid for by the customers you already have."
      },
      "value": {
        "title": "Your constraint is value",
        "titleLoose": "The tightest thing is value",
        "open": "Value here means what the customer perceives, and it has nothing to do with your pricing or your margin. They buy, and then they stop, or they stay and give most of the work to somebody else.",
        "evidence": [
          {
            "banded": "of the customers you had a year ago, {q21.band} still buy from you",
            "precise": "of the customers you had a year ago, {q21.exact}% still buy from you"
          },
          {
            "banded": "you get {q57.band} of the work they put out",
            "precise": "you get {q57.exact}% of the work they put out"
          },
          {
            "banded": "they come back unprompted {q22.band}"
          },
          {
            "banded": "referrals bring in {q23.band} of your new customers"
          }
        ],
        "close": "You're filling a leaky bucket. Every dollar going into finding new customers is currently paying to replace the ones walking out the other side, which is why the business feels busy and stays the same size."
      },
      "offer": {
        "title": "Your constraint is the offer",
        "titleLoose": "The tightest thing is the offer",
        "open": "Enquiries arrive and they don't convert.",
        "evidence": [
          {
            "banded": "your close rate sits {q26.band}",
            "precise": "your close rate sits at {q26.exact}%"
          },
          {
            "banded": "the most common reason you lose is {q27.band}"
          },
          {
            "banded": "prospects come back on your quote asking what's included {q28.band}"
          },
          {
            "banded": "and they find out what you charge {q30.band}"
          }
        ],
        "close": "This isn't a sales technique problem. When the thing on the table is clear, priced, and it fits what the buyer came in for, an average salesperson closes it. Right now yours needs you in the room to make sense of it."
      },
      "demand": {
        "title": "Your constraint is demand",
        "titleLoose": "The tightest thing is demand",
        "open": "You've got capacity sitting idle and not enough people asking.",
        "evidence": [
          {
            "banded": "enquiries run {q31.band}",
            "precise": "enquiries run at about {q31.exact} a month"
          },
          {
            "banded": "volume has {q33.band} over the last year"
          },
          {
            "banded": "you're doing {q35.band} to generate more"
          }
        ],
        "close": "You could take on more work tomorrow, which is what separates this from a delivery problem. Nothing downstream is broken. The business just isn't being fed, and it won't start feeding itself."
      },
      "margin": {
        "title": "Your constraint is margin",
        "titleLoose": "The tightest thing is margin",
        "open": "You're busy, you're full, and there's nothing left at the end of it.",
        "evidence": [
          {
            "banded": "what's left after direct costs sits {q36.band}",
            "precise": "what's left after direct costs sits at {q36.exact}%"
          },
          {
            "banded": "after everything it's {q37.band}",
            "precise": "after everything it's {q37.exact}%"
          },
          {
            "banded": "you last raised prices {q38.band}"
          },
          {
            "banded": "jobs run over what you quoted {q39.band}"
          }
        ],
        "close": "Volume won't rescue this. At the margin you're running, more work gets you more of the same result and it arrives faster."
      }
    },
    "constraintFix": {
      "cashflow": {
        "lead": "The job is to shorten the gap between doing the work and getting paid for it. Nothing else moves until that does.",
        "actions": [
          "Take a deposit on every job. Half where you can get it, something where you can't. A deposit is the cheapest funding you'll ever raise.",
          "Invoice the day the work is finished rather than at the end of the month. Most of the wait is yours, not theirs.",
          "Put terms in writing before the job starts, and chase on day one past due. Not week two.",
          "Get an overdraft or a facility in place while you're still profitable. Banks lend to businesses that don't look like they need it.",
          "Find out which of your top five customers pays slowest, then reprice or re term that one."
        ]
      },
      "talent": {
        "lead": "One role. Named, hired, and given the authority to actually run what you hand over.",
        "actions": [
          "Write down everything you did last week, then mark what only you could have done. What's left is the job description.",
          "Hire the layer rather than the hands. Another delivery person gives you more capacity, a person who runs delivery gives you your week back.",
          "Hand over one whole area with the decisions attached. Half a handover is worse than none, because you keep the work and they get the confusion.",
          "Give it ninety days before you judge it. The first month of any handover looks like a mistake.",
          "Stop being the escalation point for the area you handed over. Send it back to them, in front of the team."
        ]
      },
      "fulfilment": {
        "lead": "More output from what you already have, before you buy any more of anything.",
        "actions": [
          "Find the one step everything queues behind. There's always one, and it's rarely the one people complain about.",
          "Pull the work that doesn't need your best people off your best people. Most delivery teams lose a third of their week to things a junior could do.",
          "Stop selling the jobs that eat the most capacity for the least return, at least until the queue clears.",
          "Quote your real lead time rather than your hopeful one. A blown promise costs you a customer you'd already won.",
          "Add capacity last. Hiring into a broken process gets you a bigger broken process."
        ]
      },
      "value": {
        "lead": "Find out why they leave, then fix the thing they tell you about. It's almost always smaller than you'd expect.",
        "actions": [
          "Ring ten customers who stopped buying and ask them straight. Not a survey. A phone call.",
          "Look hard at the first thirty days after someone buys. That's where most of the leaving gets decided.",
          "Give them a reason to come back that you initiate. Waiting to be remembered isn't a retention plan.",
          "Close the gap between what you sell and what they actually get. Value is the size of that gap.",
          "Measure it monthly. You can't run a business on a retention number you find out about once a year."
        ]
      },
      "offer": {
        "lead": "Make the thing you sell understandable without you standing next to it.",
        "actions": [
          "Write the offer on one page. What it is, what it costs, what the buyer gets, who it isn't for.",
          "Price it publicly, or at least in a range. Every quote you build from scratch is a delay you're funding.",
          "Sort your last twenty losses by reason. The pattern is usually one thing, not five.",
          "Cut the options. A buyer choosing between three clear things buys. A buyer choosing between eleven goes away to think about it.",
          "Test the new version on the next ten enquiries before you change anything else."
        ]
      },
      "demand": {
        "lead": "Turn the tap on deliberately. One channel, run properly, before you touch a second.",
        "actions": [
          "Pick the channel that already brings your best customers and put real weight behind it.",
          "Go and ask for work. Outbound to the twenty businesses you'd most like to work with beats waiting on referrals.",
          "Make it obvious what you do and who you do it for, everywhere you appear. Most quiet businesses are quiet because nobody can tell.",
          "Ask every happy customer for one introduction. It's the cheapest demand you'll ever generate.",
          "Give a channel ninety days before you judge it. Anything shorter is guesswork."
        ]
      },
      "margin": {
        "lead": "Price first, then cost. Price moves faster and costs nothing to change.",
        "actions": [
          "Raise prices on new work now. Ten percent, across the board, and watch what actually happens.",
          "Work out what each job really costs, your own time included. Half the jobs you're proud of are losing money.",
          "Find your worst three customers by margin, then reprice them or let them go.",
          "Quote a contingency into every job that historically runs over. You already know which ones they are.",
          "Stop discounting to win. A discount is the fastest way to buy work you'll resent delivering."
        ]
      }
    },
    "minorConstraint": {
      "cashflow": "There's cash flow strain in your answers too. It sits downstream of the {d.primaryShort} problem and it should ease as that one moves.",
      "talent": "A talent gap shows up in your answers as well. It's downstream of the {d.primaryShort} problem, so it isn't the thing to work on first.",
      "fulfilment": "You'll see fulfilment strain in here as well. That's downstream of the {d.primaryShort} problem, and it should settle once the layer above it is in place.",
      "value": "Retention looks soft too. That's downstream of the {d.primaryShort} problem rather than a separate finding.",
      "offer": "The offer looks weak in places as well. Downstream of the {d.primaryShort} problem, and not worth touching yet.",
      "demand": "Demand reads thin too. It's downstream of the {d.primaryShort} problem, so leave it where it is.",
      "margin": "Margin looks tight as well. That's downstream of the {d.primaryShort} problem and it'll move when that does."
    },
    "riskFamilyFraming": {
      "none": "Nothing in your risk answers is loud enough to put in front of you. Come back to this as the business changes, because the risks that matter change with it.",
      "concentration": "Your risk sits in concentration. There's one of something that ought to be several. It costs nothing to carry while it holds, and the cost of it not holding is a year of revenue.",
      "fragility": "Your risk sits in fragility. The business runs well enough while nothing goes wrong, and there's very little underneath it if something does. Fragility is what turns an ordinary bad month into a hole you spend two years climbing out of.",
      "owner": "Your risk sits with you. The business owns you rather than the other way around, and that shows up in what you're personally on the hook for, what the business is worth, and what happens if you stop. It's the risk owners notice last, because it feels like commitment rather than exposure."
    },
    "riskDef": {
      "key_client": {
        "banded": "One customer carries {q41.band} of your revenue. That customer can leave, go quiet, or get bought by someone who already has their own suppliers, and none of those are things you get a say in.",
        "precise": "One customer carries {q41.exact}% of your revenue. That customer can leave, go quiet, or get bought by someone who already has their own suppliers, and none of those are things you get a say in."
      },
      "key_product": {
        "banded": "{q42.band} of your revenue comes from one product or service line. That's fine while the market wants it, and it's a single point of failure the day the market moves or a competitor undercuts it.",
        "precise": "{q42.exact}% of your revenue comes from one product or service line. That's fine while the market wants it, and it's a single point of failure the day the market moves or a competitor undercuts it."
      },
      "key_channel": {
        "banded": "Your customers arrive {q43.band}. Channels change without asking you first, and an algorithm shift, a search update or one referrer going quiet can halve your enquiries inside a month."
      },
      "key_supplier": {
        "banded": "You've got one supplier with no ready replacement. Their price rise is your price rise, their delay is your delay, and their bad year is your bad year."
      },
      "key_person": {
        "banded": "The business leans heavily on one person, and going by your answers that person is probably you. Illness, a resignation or a fortnight offline stops things that shouldn't be stoppable."
      },
      "key_employee": {
        "banded": "One person knows how the work actually gets done and it isn't written down anywhere else. If they leave, the knowledge goes with them, and you'll be rebuilding it from scratch while still trying to deliver."
      },
      "key_geography": {
        "banded": "The business sells into one city or region. A local downturn, a big competitor arriving, or a regulatory change hits all of your revenue at once rather than part of it."
      },
      "no_buffer": {
        "banded": "You're holding {q8.band}. Every business runs into a bad month. Without a buffer, a bad month turns into a decision about who you can't pay.",
        "alt": "You couldn't put a number on how long the business would last with no revenue, which is its own answer. Every business runs into a bad month, and without a buffer a bad month turns into a decision about who you can't pay."
      },
      "no_contracts": {
        "banded": "Your work is committed by {q45.band}. Revenue that can be cancelled in a phone call isn't revenue you can plan against, hire against or borrow against.",
        "alt": "You weren't sure how your work is actually committed by the customer. Revenue you can't describe the terms of isn't revenue you can plan against, hire against or borrow against."
      },
      "no_process": {
        "banded": "{q46.band} of the work is documented well enough that somebody else could pick it up and finish it. Every new hire takes longer than it should, quality moves depending on who's on the job, and nothing can be handed over cleanly.",
        "alt": "You weren't sure how much of the work is documented, which almost always means less than you'd hope. Every new hire takes longer than it should, quality moves depending on who's on the job, and nothing can be handed over cleanly."
      },
      "no_data": {
        "banded": "You look at the numbers {q47.band}, and there were questions in here you couldn't answer. Running on feel works while the business is small enough to hold in your head. Past that, you're making decisions on a version of the business that's a few months out of date.",
        "alt": "There were questions in here you couldn't answer, and that's the finding. Running on feel works while the business is small enough to hold in your head. Past that, you're making decisions on a version of the business that's a few months out of date."
      },
      "no_2ic": {
        "banded": "There's nobody who could run this if you stepped out. Every decision routes through you, which caps the business at the size of your week."
      },
      "owner_trapped": {
        "banded": "Sold tomorrow, a buyer would need you to stay {q49.band}. That's the number that decides what the business is worth to anyone but you, and it's the same number that decides whether you can ever step back.",
        "alt": "You haven't thought about how long a buyer would need you to stay on, which is its own answer. Until somebody else can run it, the business is a job that owns you rather than an asset you own."
      },
      "no_succession": {
        "banded": "There's {q50.band} for what happens if you stop, sell or step back. Every business has an exit, planned or otherwise. The unplanned version is the one where somebody else sets the price.",
        "alt": "You weren't sure what happens to the business if you stop, sell or step back. Every business has an exit, planned or otherwise. The unplanned version is the one where somebody else sets the price."
      },
      "personal_guarantee": {
        "banded": "You've personally guaranteed {q51.band} of the business's obligations. The wall between business risk and personal risk isn't up, so a bad year in the business reaches your house.",
        "alt": "You weren't sure what you've personally guaranteed, and that's worth finding out this week. Where the wall between business risk and personal risk isn't up, a bad year in the business reaches your house."
      },
      "model_misfit": {
        "banded": "The way you spend your week is {q52.band}. It decides how long you'll keep doing this, and most businesses that fail slowly fail because the owner ran out of want.",
        "alt": "You weren't sure whether the way you spend your week matches what you wanted out of this. That question decides how long you'll keep doing it, and most businesses that fail slowly fail because the owner ran out of want."
      },
      "key_asset": {
        "banded": "One piece of equipment or one vehicle is doing work you have no backup for. A breakdown, a theft or a long repair stops revenue you've already sold, and hire rates at short notice are set by people who know you're stuck."
      },
      "key_licence": {
        "banded": "One licence, accreditation or policy is the thing that lets you trade at all. Lose it, let it lapse, or fail an audit, and the business stops completely rather than slows down."
      }
    },
    "riskFix": {
      "key_client": "Set a ceiling, say twenty percent of revenue from any one customer, and treat crossing it as the trigger to go and win two more. Get them onto a term agreement in the meantime.",
      "key_product": "Build a second line and sell it to the customers you already have. It's cheaper than finding new customers for the line you've got.",
      "key_channel": "Stand up a second channel before you need it, and give it ninety days before you judge it. One channel is a decision somebody else gets to make on your behalf.",
      "key_supplier": "Qualify a second supplier and give them ten percent of your volume. A backup you've never actually bought from isn't a backup.",
      "key_person": "Write down what they hold, then move one piece of it to somebody else this month. Repeat until nothing sits in one head.",
      "key_employee": "Have them document the work while they're still here, and pay them properly to do it. It's the cheapest insurance available to you.",
      "key_geography": "Take one thing you do well and sell it somewhere else, even at a small scale. Proving it travels is the whole exercise.",
      "no_buffer": "Build to one month of fixed costs in a separate account, then three. Move a fixed percentage of every payment that comes in, automatically, so it isn't a decision you make each time.",
      "no_contracts": "Put a written agreement behind every piece of work, with terms, scope and a notice period. Start with your largest customers.",
      "no_process": "Record yourself doing the five things that go wrong most often, then turn each one into a one page checklist. Checklists beat manuals, because people actually use them.",
      "no_data": "Pick five numbers and look at them weekly. Cash in the bank, enquiries, close rate, jobs delivered, and margin on the last ten jobs. One page, same day every week.",
      "no_2ic": "Name the person, tell them, and start handing over one area at a time with the decisions attached. A deputy who can't decide anything is a job title.",
      "owner_trapped": "Work out what only you can do, then start moving everything else. The test is whether the business survives you taking a month off, so book the month and find out.",
      "no_succession": "Write the one page version. Who runs it, what happens to the customers, what it's worth and who'd buy it. It doesn't need to be right, it needs to exist.",
      "personal_guarantee": "List every guarantee you've signed and put a date against each one to renegotiate or release it. Most get renewed on autopilot because nobody asks.",
      "model_misfit": "Write down what you actually wanted out of this, then hold your week up against it. The gap is the brief for the next twelve months.",
      "key_asset": "Find out today what it costs to hire a replacement at short notice, and who has one. A relationship you already have beats a phone number you find on the day.",
      "key_licence": "Put every renewal date in a calendar with a ninety day warning, and make sure a second person can hold or renew it. A lapse is nearly always an admin failure rather than a real one."
    },
    "minorRisk": {
      "framing": "One more, from a different family to the risks above. It's behind them in the order, not in front of them.",
      "key_client": "One customer carries enough of your revenue that losing them is a bad year rather than a bad month.",
      "key_product": "One product or service line carries most of what you sell.",
      "key_channel": "Nearly all your customers arrive through one channel you don't control.",
      "key_supplier": "One supplier with no ready replacement is setting your prices and your timelines.",
      "key_person": "The business depends on one person to function, and going by your answers that person is probably you.",
      "key_employee": "One person holds how the work actually gets done, and it isn't written down anywhere else.",
      "key_geography": "All of your revenue comes out of one city or region.",
      "key_asset": "One piece of equipment or one vehicle is doing work you have no backup for.",
      "key_licence": "One licence or accreditation is the thing that lets you trade at all.",
      "no_buffer": "There isn't enough cash behind the business to absorb an ordinary bad month.",
      "no_contracts": "Your work isn't committed in writing, so the revenue can leave on a phone call.",
      "no_process": "Almost nothing is documented well enough for somebody else to pick up.",
      "no_data": "You aren't looking at the numbers often enough to see something coming.",
      "no_2ic": "There's nobody who could run this if you stepped out.",
      "owner_trapped": "A buyer would need you to stay on for a long time, which is what makes the business hard to sell and hard to leave.",
      "no_succession": "There's no plan for what happens if you stop, sell or step back.",
      "personal_guarantee": "You've personally guaranteed obligations the business took on.",
      "model_misfit": "The way you spend your week isn't what you wanted out of this."
    },
    "compound": [
      {
        "constraint": "talent",
        "flag": "key_person",
        "priority": 1,
        "text": "Your constraint is talent and your key person risk is the same thing seen from the other side. The layer that doesn't exist is the reason everything routes through one person, so hiring the role deals with both. Treat it as one job rather than two."
      },
      {
        "constraint": "talent",
        "flag": "owner_trapped",
        "priority": 1,
        "text": "You're talent constrained and the business is close to unsellable, and both of those come from the same fact. The business runs on you. The role you haven't hired is also the thing standing between you and owning something a buyer would want."
      },
      {
        "constraint": "talent",
        "flag": "no_2ic",
        "priority": 2,
        "text": "The missing layer and the missing second in command are one problem with two names. You don't need a succession plan and a hire. You need the hire, and the succession plan writes itself afterwards."
      },
      {
        "constraint": "talent",
        "flag": "key_client",
        "priority": 3,
        "text": "You're carrying a talent gap and a single customer worth {q41.band} of revenue. Building the layer while one customer can end your year is the sequencing error we'd flag hardest. Get that customer onto a term agreement before you take on the salary."
      },
      {
        "constraint": "cashflow",
        "flag": "key_client",
        "priority": 1,
        "text": "Cash flow is your constraint and one customer carries {q41.band} of your revenue. That customer is also setting your payment terms, which means they're setting your cash position. Fixing terms with them is worth more than everything else on the list."
      },
      {
        "constraint": "cashflow",
        "flag": "personal_guarantee",
        "priority": 2,
        "text": "You're cash constrained and personally guaranteeing the business's obligations. That's the combination that follows people home. Get the buffer built before you take on another dollar of guaranteed debt."
      },
      {
        "constraint": "cashflow",
        "flag": "no_contracts",
        "priority": 2,
        "text": "Cash flow is your constraint and your work isn't contracted. You're funding jobs upfront for customers who can walk without penalty. Deposits and written terms deal with both at once."
      },
      {
        "constraint": "cashflow",
        "flag": "no_data",
        "priority": 3,
        "text": "You're cash constrained and you're not looking at the numbers often enough to see it coming. A thirteen week cash forecast, updated weekly, is the highest value hour in your month right now."
      },
      {
        "constraint": "fulfilment",
        "flag": "no_process",
        "priority": 1,
        "text": "You're fulfilment constrained and almost nothing is written down. Those aren't two findings. Undocumented work is slow work, and it's why adding people hasn't given you the output you expected."
      },
      {
        "constraint": "fulfilment",
        "flag": "key_employee",
        "priority": 1,
        "text": "You're at capacity and one person holds how the work actually gets done. Every hire you make is rate limited by the one person who has to train them. Getting that knowledge out of one head is what unlocks the capacity."
      },
      {
        "constraint": "fulfilment",
        "flag": "key_person",
        "priority": 2,
        "text": "You're at capacity and the business depends on one person to function. Adding work to that arrangement adds it to them. The capacity you're missing is currently locked in one diary."
      },
      {
        "constraint": "value",
        "flag": "no_data",
        "priority": 1,
        "text": "Retention is your constraint and you don't know why customers leave. Those are the same sentence. Ten phone calls this week would find the leak, and nothing you do before those calls is anything but a guess."
      },
      {
        "constraint": "offer",
        "flag": "key_channel",
        "priority": 2,
        "text": "The offer is your constraint and nearly all your enquiries come through one channel. That's why this feels like a demand problem. The channel is working. The thing it's delivering people to isn't."
      },
      {
        "constraint": "demand",
        "flag": "key_channel",
        "priority": 1,
        "text": "You're demand constrained and the one channel you have isn't producing. A second channel is the fix and it's also the risk mitigation. Same move, two problems."
      },
      {
        "constraint": "demand",
        "flag": "key_client",
        "priority": 2,
        "text": "You're quiet and one customer carries {q41.band} of your revenue. Together those mean the business is one phone call from a crisis. New demand is urgent here for reasons that have nothing to do with growth."
      },
      {
        "constraint": "margin",
        "flag": "no_data",
        "priority": 1,
        "text": "Margin is your constraint and you don't know which work makes money. You're almost certainly subsidising some customers with others, and until you can see which, every pricing decision you make is a guess."
      },
      {
        "constraint": "margin",
        "flag": "key_client",
        "priority": 2,
        "text": "Margin is tight and one customer carries {q41.band} of your revenue. Big customers get big customer pricing, and yours is probably the one holding the margin down. Repricing them is the fastest lever you have, and it's the scariest, which is why it hasn't happened."
      }
    ],
    "dontDoYet": {
      "cashflow": {
        "lead": "Until the cash timing is fixed, leave these alone.",
        "items": [
          "Don't chase bigger jobs. Bigger jobs mean bigger upfront costs and longer payment cycles.",
          "Don't hire. Wages are the least flexible cost you can add to a cash problem.",
          "Don't buy equipment outright. Finance it, even if the interest annoys you.",
          "Don't discount to get paid faster. That's borrowing at a rate you'd never accept from a bank.",
          "Don't increase marketing spend. More demand you can't fund makes the hole deeper."
        ]
      },
      "talent": {
        "lead": "Until the layer exists, leave these alone.",
        "items": [
          "Don't hire another doer. Every one you add reports to you, and you're the bottleneck.",
          "Don't take on a new market, product or location. All three land on your desk.",
          "Don't start anything that needs your attention for six months.",
          "Don't increase lead generation. The work you win still has to route through you.",
          "Don't redraw the org chart. What's missing is a person who doesn't exist, not a diagram."
        ]
      },
      "fulfilment": {
        "lead": "Until you can deliver what you've already sold, leave these alone.",
        "items": [
          "Don't chase new customers. You'd be damaging the ones you have to serve the ones you win.",
          "Don't increase marketing spend. Adding demand to a full pipeline is the classic accelerant.",
          "Don't launch a new service line. New work is slow work while the process is still being learned.",
          "Don't drop your prices. You've got more demand than capacity, which is the one time raising them is easy.",
          "Don't promise a shorter lead time to win a job. That's where the quality problem starts."
        ]
      },
      "value": {
        "lead": "Until customers stay, leave these alone.",
        "items": [
          "Don't spend more on acquisition. You'd be paying to fill a bucket with a hole in it.",
          "Don't raise prices. Value perception is already the problem.",
          "Don't add a new product for existing customers who aren't buying the current one.",
          "Don't expand into a new market. You'd take the retention problem with you.",
          "Don't run a loyalty programme. A discount doesn't fix a value gap, it confirms one."
        ]
      },
      "offer": {
        "lead": "Until the offer lands, leave these alone.",
        "items": [
          "Don't buy more leads. You'd pay more money for the same conversion rate.",
          "Don't hire a salesperson. They'd fail against the same offer you're failing against.",
          "Don't cut your price. Price is rarely the real reason, and you can't test it while the offer is unclear.",
          "Don't add more options. More choice is part of why these deals are stalling.",
          "Don't rebrand. The words are the problem, not the logo."
        ]
      },
      "demand": {
        "lead": "Until enquiries lift, leave these alone.",
        "items": [
          "Don't hire. You'd be adding capacity to capacity you already can't fill.",
          "Don't build a new product. The one you have hasn't been shown to enough people.",
          "Don't cut prices to stimulate demand. It rarely moves volume, and it permanently resets what customers expect to pay.",
          "Don't spread across five channels at once. One channel run properly beats five run badly.",
          "Don't wait for referrals to pick back up. Referral volume follows the number of customers you have, and that's the number that's short."
        ]
      },
      "margin": {
        "lead": "Until the margin moves, leave these alone.",
        "items": [
          "Don't chase volume. More work at this margin is more risk for the same money.",
          "Don't hire. Every head you add at this margin needs a lot of revenue standing behind it.",
          "Don't take the big thin job because it's good for the brand. Reputation doesn't pay wages.",
          "Don't discount anything. There's nothing left to give away.",
          "Don't invest in growth. Growing an unprofitable model makes it unprofitable faster."
        ]
      }
    },
    "closing": {
      "text": "That's the diagnosis. One constraint, the risks sitting around it, and the things to leave alone while you fix it.\n\nWork the constraint and check back in ninety days. That's long enough for it to move and short enough that you'll still remember what you changed.",
      "cta": "",
      "loose": "That's the read. One thing to push on, and nothing in the way of it.\n\nRun this again in ninety days, or whenever something material changes. The constraint moves as the business grows, and the answer you get next time probably won't be this one.",
      "unsure": "That's as far as your answers go. One provisional reading, and a clear picture of what the business can't currently tell you.\n\nGet the numbers visible, then run this again. The second time through it will be worth something."
    },
    "looseBody": "Nothing in here is failing, so there's no evidence to walk you through. What you've got is {d.primaryShort} sitting as the tightest of the seven right now, which makes it the likeliest place the next bit of growth comes from. The actions below are worth doing and none of them are urgent.",
    "unsureBody": "There isn't enough here to point at one thing with any confidence. On what you did answer, {d.primaryShort} is the tightest of the seven, so read the actions below as a starting point rather than a diagnosis.\n\nThe risk section is the part of this report to take seriously. Not being able to answer the questions is the finding, and it's the one worth acting on first."
  },
  "hardTriggers": {
    "cashflow": [
      {
        "all": [
          [
            "q8",
            [
              "c",
              "d"
            ]
          ],
          [
            "q6",
            [
              "c",
              "d"
            ]
          ]
        ]
      },
      {
        "all": [
          [
            "q55",
            [
              "d"
            ]
          ],
          [
            "q8",
            [
              "c",
              "d"
            ]
          ]
        ]
      }
    ],
    "talent": [
      {
        "all": [
          [
            "q11",
            [
              "n"
            ]
          ],
          [
            "q12",
            [
              "c",
              "d"
            ]
          ]
        ]
      }
    ],
    "fulfilment": [
      {
        "all": [
          [
            "q16",
            [
              "d",
              "e"
            ]
          ],
          [
            "q17",
            [
              "c",
              "d"
            ]
          ]
        ]
      }
    ],
    "value": [
      {
        "all": [
          [
            "q21",
            [
              "c",
              "d"
            ]
          ],
          [
            "q22",
            [
              "c",
              "d"
            ]
          ]
        ]
      },
      {
        "all": [
          [
            "q57",
            [
              "d",
              "e"
            ]
          ],
          [
            "q24",
            [
              "c",
              "d"
            ]
          ]
        ]
      }
    ],
    "offer": [
      {
        "all": [
          [
            "q26",
            [
              "c",
              "d"
            ]
          ],
          [
            "q29",
            [
              "c",
              "d"
            ]
          ]
        ]
      }
    ],
    "demand": [
      {
        "all": [
          [
            "q31",
            [
              "a",
              "b"
            ]
          ],
          [
            "q34",
            [
              "a",
              "b"
            ]
          ],
          [
            "q33",
            [
              "c",
              "d"
            ]
          ]
        ]
      }
    ],
    "margin": [
      {
        "all": [
          [
            "q37",
            [
              "d"
            ]
          ],
          [
            "q36",
            [
              "c",
              "d"
            ]
          ]
        ]
      }
    ]
  }
};
