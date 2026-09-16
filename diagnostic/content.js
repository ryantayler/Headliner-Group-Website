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
    "FALLBACK_FLOOR": 35,
    "FLAG_PRINT": 55,
    "MAX_FLAGS_SHOWN": 4,
    "MAX_ACTIONS": 9,
    "TIE_GAP": 5
  },
  "chain": [
    "talent",
    "fulfilment",
    "margin",
    "value",
    "offer",
    "demand"
  ],
  "constraints": {
    "talent": {
      "name": "Talent constrained",
      "short": "Talent",
      "loose": "Talent",
      "phrase": "talent"
    },
    "fulfilment": {
      "name": "Fulfilment constrained",
      "short": "Fulfilment",
      "loose": "Fulfilment",
      "phrase": "fulfilment"
    },
    "value": {
      "name": "Value constrained",
      "short": "Value",
      "loose": "Value",
      "phrase": "value"
    },
    "offer": {
      "name": "Offer constrained",
      "short": "Offer",
      "loose": "Offer",
      "phrase": "offer"
    },
    "demand": {
      "name": "Demand constrained",
      "short": "Demand",
      "loose": "Demand",
      "phrase": "demand"
    },
    "margin": {
      "name": "Margin constrained",
      "short": "Margin",
      "loose": "Margin",
      "phrase": "margin"
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
      "help": "Tick everything that applies.",
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
          "band": "one piece of work at a time",
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
      "text": "How do you usually get paid?",
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
          "text": "Some upfront, the rest when it's done",
          "band": "with some upfront and the rest at the end",
          "w": 20
        },
        {
          "id": "c",
          "text": "Progress payments along the way",
          "band": "in progress payments",
          "w": 25
        },
        {
          "id": "d",
          "text": "Some upfront, the rest on terms after",
          "band": "with some upfront and the rest on terms",
          "w": 50
        },
        {
          "id": "e",
          "text": "Nothing upfront, paid when it's done",
          "band": "with nothing upfront, paid at the end",
          "w": 75
        },
        {
          "id": "f",
          "text": "Nothing upfront, paid on terms after",
          "band": "with nothing upfront and the rest on terms",
          "w": 100
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
          "band": "you haven't had to delay paying anyone",
          "w": 0
        },
        {
          "id": "b",
          "text": "Once or twice",
          "band": "you've delayed paying someone once or twice",
          "w": 30
        },
        {
          "id": "c",
          "text": "Most months",
          "band": "you've been delaying payments most months",
          "w": 80
        },
        {
          "id": "d",
          "text": "Every month",
          "band": "you've been delaying payments every month",
          "w": 100
        }
      ]
    },
    {
      "id": "q7",
      "section": "cashflow",
      "n": 9,
      "weight": 1.0,
      "text": "Once you've asked for the balance, how long until it's actually in the account?",
      "type": "single",
      "exact": {
        "label": "If you know the average, how many days?",
        "unit": "days"
      },
      "options": [
        {
          "id": "a",
          "text": "Straight away, we're paid before we'd even ask",
          "band": "straight away",
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
          "flags": []
        },
        {
          "id": "d",
          "text": "Under 2 weeks",
          "band": "under a fortnight of cover",
          "w": 100,
          "flags": []
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
        }
      ]
    },
    {
      "id": "q10",
      "section": "cashflow",
      "n": 12,
      "weight": 0.8,
      "text": "Over the last 12 months, was the business profitable on paper?",
      "help": "Materials, wages, anything you'd have to pay for before the customer pays you.",
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
            {
              "id": "key_person",
              "sev": 75
            }
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
          "w": 33
        },
        {
          "id": "c",
          "text": "It degrades quickly",
          "band": "degrades quickly without you",
          "w": 67,
          "flags": [
            {
              "id": "key_person",
              "sev": 75
            }
          ]
        },
        {
          "id": "d",
          "text": "It stops",
          "band": "stops without you",
          "w": 100,
          "flags": [
            {
              "id": "key_person",
              "sev": 75
            }
          ]
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
          "text": "Pricing and putting numbers together"
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
          "text": "Chasing money and doing the books"
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
          "w": 33
        },
        {
          "id": "c",
          "text": "An hour or two",
          "band": "an hour or two",
          "w": 67
        },
        {
          "id": "d",
          "text": "None of it",
          "band": "none of it",
          "w": 100
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
          "band": "nothing you wanted to grow has stalled for want of someone to hand it to",
          "w": 0
        },
        {
          "id": "b",
          "text": "Once",
          "band": "something you wanted to grow has stalled once for want of anyone to hand it to",
          "w": 33
        },
        {
          "id": "c",
          "text": "A few times",
          "band": "a few things have stalled for want of anyone to hand them to",
          "w": 67
        },
        {
          "id": "d",
          "text": "That's the normal state",
          "band": "things stall for want of anyone to hand them to as a matter of routine",
          "w": 100
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
          "text": "Two or fewer",
          "band": "two or fewer direct reports",
          "w": 0
        },
        {
          "id": "b",
          "text": "Three to six",
          "band": "three to six direct reports",
          "w": 33
        },
        {
          "id": "c",
          "text": "Seven to twelve",
          "band": "seven to twelve direct reports",
          "w": 67
        },
        {
          "id": "d",
          "text": "More than twelve",
          "band": "more than twelve direct reports",
          "w": 100
        }
      ]
    },
    {
      "id": "q16",
      "section": "fulfilment",
      "n": 20,
      "weight": 1.3,
      "text": "How booked is your delivery capacity for the next 30 days?",
      "help": "Capacity meaning the hours, people or materials you'd need to actually do the work.",
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
          "w": 33
        },
        {
          "id": "c",
          "text": "Full, or close to it",
          "band": "at or near full",
          "w": 67
        },
        {
          "id": "d",
          "text": "Over capacity, we're behind",
          "band": "over capacity and behind",
          "w": 100
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
          "band": "you haven't had to turn work away",
          "w": 0
        },
        {
          "id": "b",
          "text": "Once or twice",
          "band": "you've turned work away or pushed a start date once or twice",
          "w": 33
        },
        {
          "id": "c",
          "text": "Most months",
          "band": "you're turning work away or pushing start dates most months",
          "w": 67
        },
        {
          "id": "d",
          "text": "Constantly",
          "band": "you're turning work away constantly",
          "w": 100
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
          "w": 33
        },
        {
          "id": "c",
          "text": "Longer",
          "band": "stretched out",
          "w": 67
        },
        {
          "id": "d",
          "text": "Much longer",
          "band": "blown out",
          "w": 100
        }
      ]
    },
    {
      "id": "q19",
      "section": "fulfilment",
      "n": 23,
      "weight": 1.1,
      "text": "How far ahead is the work actually ready?",
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
          "w": 33
        },
        {
          "id": "c",
          "text": "The day before",
          "band": "the day before",
          "w": 67
        },
        {
          "id": "d",
          "text": "We're finishing it as it starts",
          "band": "only as it starts",
          "w": 100
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
          "w": 33
        },
        {
          "id": "c",
          "text": "Most weeks",
          "band": "most weeks",
          "w": 67
        },
        {
          "id": "d",
          "text": "Constantly",
          "band": "constantly",
          "w": 100
        }
      ],
      "help": "Long hours on a delivery day are the work itself. This is about the weeks in between."
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
          "w": 33
        },
        {
          "id": "c",
          "text": "Under a third",
          "band": "under a third",
          "w": 67
        },
        {
          "id": "d",
          "text": "Almost none",
          "band": "close to none",
          "w": 100
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
          "w": 33
        },
        {
          "id": "c",
          "text": "About half or less",
          "band": "about half or less",
          "w": 67
        },
        {
          "id": "d",
          "text": "A small slice, they spread it around",
          "band": "only a small slice",
          "w": 100
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
          "w": 33
        },
        {
          "id": "c",
          "text": "Rarely",
          "band": "rarely",
          "w": 67
        },
        {
          "id": "d",
          "text": "Never",
          "band": "never",
          "w": 100
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
          "band": "most",
          "w": 0
        },
        {
          "id": "b",
          "text": "About half",
          "band": "about half",
          "w": 33
        },
        {
          "id": "c",
          "text": "A few",
          "band": "a few",
          "w": 67
        },
        {
          "id": "d",
          "text": "Almost none",
          "band": "almost none",
          "w": 100
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
          "w": 33
        },
        {
          "id": "c",
          "text": "A steady stream",
          "band": "a steady stream",
          "w": 67
        },
        {
          "id": "d",
          "text": "Most of them",
          "band": "most of them",
          "w": 100
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
          "text": "Yes, we ask every one and we know",
          "band": "you ask every one and you know",
          "w": 0
        },
        {
          "id": "b",
          "text": "We ask sometimes, so we know for some",
          "band": "you ask sometimes, so you know for some",
          "w": 33
        },
        {
          "id": "c",
          "text": "We've got a theory, we've never asked",
          "band": "you've got a theory and you've never asked",
          "w": 67
        },
        {
          "id": "d",
          "text": "No idea",
          "band": "no idea",
          "w": 100
        }
      ]
    },
    {
      "id": "q26",
      "section": "offer",
      "n": 31,
      "weight": 1.4,
      "text": "Of the people who enquire and find out what it costs, how many go ahead?",
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
          "w": 33
        },
        {
          "id": "c",
          "text": "10% to 25%",
          "band": "in the 10 to 25% range",
          "w": 67
        },
        {
          "id": "d",
          "text": "Under 10%",
          "band": "under 10%",
          "w": 100
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
          "text": "Timing, they weren't ready",
          "band": "timing",
          "w": 0
        },
        {
          "id": "b",
          "text": "Price, we were too expensive",
          "band": "price",
          "w": 33
        },
        {
          "id": "c",
          "text": "They went with someone else",
          "band": "a competitor",
          "w": 67
        },
        {
          "id": "d",
          "text": "They did nothing at all, or we don't know",
          "band": "inaction, or something you cannot put your finger on",
          "w": 100
        }
      ]
    },
    {
      "id": "q28",
      "section": "offer",
      "n": 33,
      "weight": 1.0,
      "text": "When somebody sees your price, how often do they come back asking what's included, or why it costs what it does?",
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
          "w": 33
        },
        {
          "id": "c",
          "text": "Often",
          "band": "often",
          "w": 67
        },
        {
          "id": "d",
          "text": "Almost every time",
          "band": "almost every time",
          "w": 100
        }
      ]
    },
    {
      "id": "q29",
      "section": "offer",
      "n": 34,
      "weight": 1.1,
      "text": "Has the proportion of enquiries that turn into work changed in the last 12 months?",
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
          "w": 33
        },
        {
          "id": "c",
          "text": "Dropped",
          "band": "dropped",
          "w": 67
        },
        {
          "id": "d",
          "text": "Dropped sharply",
          "band": "fallen off a cliff",
          "w": 100
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
          "w": 33
        },
        {
          "id": "c",
          "text": "Every price is worked out from scratch",
          "band": "from a price worked out from scratch every time",
          "w": 67
        },
        {
          "id": "d",
          "text": "It depends who's asking",
          "band": "from a number that depends who's asking",
          "w": 100
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
          "text": "More than 30",
          "band": "above 30",
          "w": 0
        },
        {
          "id": "b",
          "text": "11 to 30",
          "band": "in the 11 to 30 range",
          "w": 33
        },
        {
          "id": "c",
          "text": "3 to 10",
          "band": "in the 3 to 10 range",
          "w": 67
        },
        {
          "id": "d",
          "text": "0 to 2",
          "band": "a handful at most",
          "w": 100
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
          "flags": []
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
          "w": 33
        },
        {
          "id": "c",
          "text": "Down",
          "band": "fallen",
          "w": 67
        },
        {
          "id": "d",
          "text": "Down sharply",
          "band": "fallen sharply",
          "w": 100
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
          "text": "No, we'd be well over capacity",
          "band": "not a chance",
          "w": 0
        },
        {
          "id": "b",
          "text": "Yes, with a real stretch",
          "band": "with a real stretch",
          "w": 33
        },
        {
          "id": "c",
          "text": "Yes, with a bit of room to spare",
          "band": "with a bit of room to spare",
          "w": 67
        },
        {
          "id": "d",
          "text": "Yes, easily, we've got the space now",
          "band": "comfortably, with the space sitting there",
          "w": 100
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
          "text": "Yes, the same things every week",
          "band": "you're generating enquiries the same way every week",
          "w": 0
        },
        {
          "id": "b",
          "text": "Yes, but it fits around the work",
          "band": "you're generating enquiries when the work allows",
          "w": 33
        },
        {
          "id": "c",
          "text": "On and off, when it goes quiet",
          "band": "you're generating enquiries on and off",
          "w": 67
        },
        {
          "id": "d",
          "text": "No, it all comes to us",
          "band": "you're doing nothing to generate enquiries, it all comes to you",
          "w": 100
        }
      ]
    },
    {
      "id": "q36",
      "section": "margin",
      "n": 41,
      "weight": 1.4,
      "text": "On a typical sale, what's left after the direct cost of delivering it?",
      "help": "Direct cost meaning labour, materials, subcontractors, whatever that specific piece of work consumed.",
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
          "w": 33
        },
        {
          "id": "c",
          "text": "15% to 30%",
          "band": "in the 15 to 30% range",
          "w": 67
        },
        {
          "id": "d",
          "text": "Under 15%",
          "band": "under 15%",
          "w": 100
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
          "w": 33
        },
        {
          "id": "c",
          "text": "1% to 10%",
          "band": "in the 1 to 10% range",
          "w": 67
        },
        {
          "id": "d",
          "text": "Nothing, or a loss",
          "band": "nothing, or a loss",
          "w": 100
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
          "band": "you last raised prices inside the last six months",
          "w": 0
        },
        {
          "id": "b",
          "text": "6 to 12 months ago",
          "band": "you last raised prices in the last year",
          "w": 33
        },
        {
          "id": "c",
          "text": "1 to 2 years ago",
          "band": "you last raised prices one to two years ago",
          "w": 67
        },
        {
          "id": "d",
          "text": "More than 2 years ago, or never",
          "band": "you last raised prices more than two years ago, if ever",
          "w": 100
        }
      ]
    },
    {
      "id": "q39",
      "section": "margin",
      "n": 44,
      "weight": 1.1,
      "text": "How often does something end up costing more to deliver than you priced it at?",
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
          "w": 33
        },
        {
          "id": "c",
          "text": "Often",
          "band": "often",
          "w": 67
        },
        {
          "id": "d",
          "text": "Most of the time",
          "band": "most of the time",
          "w": 100
        }
      ]
    },
    {
      "id": "q40",
      "section": "margin",
      "n": 45,
      "weight": 0.9,
      "text": "Do you know which customers, products or lines of work actually make you money?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "Yes, down to the individual sale",
          "band": "job by job",
          "w": 0
        },
        {
          "id": "b",
          "text": "Yes by category, not job by job",
          "band": "by category rather than job by job",
          "w": 33
        },
        {
          "id": "c",
          "text": "Roughly, it's a feel",
          "band": "roughly, on feel",
          "w": 67
        },
        {
          "id": "d",
          "text": "No",
          "band": "not at all",
          "w": 100
        }
      ]
    },
    {
      "id": "q59",
      "section": "risk",
      "n": 45,
      "weight": 0,
      "type": "multi",
      "max": 6,
      "text": "Which of these does the business actually measure, rather than estimate?",
      "options": [
        {
          "id": "a",
          "text": "What each job makes after its direct costs"
        },
        {
          "id": "b",
          "text": "How many enquiries turn into work"
        },
        {
          "id": "c",
          "text": "Where each enquiry came from"
        },
        {
          "id": "d",
          "text": "How much each customer spent this year against last"
        },
        {
          "id": "e",
          "text": "What is owed to you and how overdue it is"
        },
        {
          "id": "n",
          "text": "None of these",
          "exclusive": true,
          "flags": [
            {
              "id": "no_data",
              "sev": 95
            }
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
              "sev": 45
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
          "band": "through two channels",
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
          "band": "almost entirely through one channel",
          "flags": [
            {
              "id": "key_channel",
              "sev": 95
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
              "id": "key_person",
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
          "flags": []
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
          "boost": "key_person"
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
          "flags": []
        },
        {
          "id": "c",
          "text": "Month to month, cancellable anytime",
          "band": "a month to month arrangement",
          "flags": [
            {
              "id": "key_client",
              "sev": 70,
              "when": [
                [
                  "q41",
                  [
                    "c",
                    "d",
                    "e"
                  ]
                ]
              ]
            }
          ]
        },
        {
          "id": "d",
          "text": "Handshake and email",
          "band": "a handshake and an email",
          "flags": [
            {
              "id": "key_client",
              "sev": 90,
              "when": [
                [
                  "q41",
                  [
                    "c",
                    "d",
                    "e"
                  ]
                ]
              ]
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
              "id": "key_person",
              "sev": 45
            }
          ]
        },
        {
          "id": "c",
          "text": "Almost none, it lives in people's heads",
          "band": "Almost none",
          "flags": [
            {
              "id": "key_person",
              "sev": 85
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
          "flags": []
        },
        {
          "id": "c",
          "text": "At tax time",
          "band": "once a year at tax time",
          "flags": []
        },
        {
          "id": "d",
          "text": "We don't really",
          "band": "next to never",
          "flags": []
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
              "id": "key_person",
              "sev": 45
            }
          ]
        },
        {
          "id": "c",
          "text": "Nobody",
          "band": "nobody",
          "flags": [
            {
              "id": "key_person",
              "sev": 100
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
          "band": "a buyer wouldn't need you at all",
          "flags": []
        },
        {
          "id": "b",
          "text": "A few weeks of handover",
          "band": "a buyer would need you for a few weeks of handover",
          "flags": [
            {
              "id": "key_person",
              "sev": 35
            }
          ]
        },
        {
          "id": "c",
          "text": "Six to twelve months",
          "band": "a buyer would need you for the best part of a year",
          "flags": [
            {
              "id": "key_person",
              "sev": 80
            }
          ]
        },
        {
          "id": "d",
          "text": "Years, or it doesn't work without me",
          "band": "a buyer would need you for years, if it works without you at all",
          "flags": [
            {
              "id": "key_person",
              "sev": 100
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
              "sev": 40
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
        }
      ]
    }
  ],
  "flags": {
    "key_asset": {
      "name": "Key asset",
      "group": "Concentration"
    },
    "key_channel": {
      "name": "Key lead source",
      "group": "Concentration"
    },
    "key_client": {
      "name": "Key client",
      "group": "Concentration"
    },
    "key_licence": {
      "name": "Key licence",
      "group": "Concentration"
    },
    "key_person": {
      "name": "Key person",
      "group": "Concentration"
    },
    "key_product": {
      "name": "Key product",
      "group": "Concentration"
    },
    "key_supplier": {
      "name": "Key supplier",
      "group": "Concentration"
    },
    "model_misfit": {
      "name": "Model misfit",
      "group": "Owner"
    },
    "no_succession": {
      "name": "Succession gap",
      "group": "Owner"
    },
    "personal_guarantee": {
      "name": "Personal guarantee",
      "group": "Owner"
    },
    "cash_flow": {
      "name": "Cash flow",
      "group": "Money",
      "pinned": true
    }
  },
  "blocks": {
    "opening": {
      "normal": "Everything below is calculated on your answers. It's a guide rather than a custom diagnostic, so read the report as a rough shape of what your current challenges are and what solutions may look like.\n\nIt names your biggest single constraint. There is likely more, and there may be other things wrong, there always are. They're not listed in here because the order you fix things in matters. Fix the constraints and risks in your business, then come back and get an updated report.",
      "wellRun": "Everything below is calculated on your answers. Nothing in them is close to failing, which is a real result and rarer than you'd think.\n\nWhat follows is the tightest thing in the business rather than a problem. Treat it as where the next bit of growth comes from, not something to fix.",
      "noneSevere": "Everything below is calculated on your answers. Nothing in them is screaming, which is worth knowing on its own.\n\nWhat follows is the tightest thing in the business rather than something that's failing outright. It's the next thing to work on, not an emergency.",
      "privacy": "We do not use any AI in this tool, and none of your data is sent or stored offsite."
    },
    "constraintDef": {
      "talent": {
        "title": "You are {c} constrained",
        "titleLoose": "The tightest thing is {c}",
        "open": [
          "Double your customers tomorrow and you'd struggle to deliver, because there's a layer of talent missing from the business.",
          "Being talent constrained means you're missing a layer, not missing extra hands.",
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
            "banded": "{q14.band}"
          }
        ],
        "close": "Hiring another pair of hands underneath you doesn't fix this. What's missing is a whole role that doesn't exist yet, and adding it is what unblocks the business."
      },
      "fulfilment": {
        "title": "You are {c} constrained",
        "titleLoose": "The tightest thing is {c}",
        "open": [
          "Double your customers tomorrow and you couldn't deliver, because there isn't enough capacity in the business.",
          "This is capacity, not capability. You know how to do the work and you can't do enough of it."
        ],
        "evidence": [
          {
            "banded": "you're running {q16.band}",
            "precise": "you're running at {q16.exact}% booked"
          },
          {
            "banded": "{q17.band}"
          },
          {
            "banded": "lead times have {q18.band}"
          },
          {
            "banded": "the work is typically ready {q19.band}"
          }
        ],
        "close": "Nothing at the front of the business needs attention until the back of it can breathe. More capacity is what fixes this, and there's work to do before you buy it."
      },
      "value": {
        "title": "You are {c} constrained",
        "titleLoose": "The tightest thing is {c}",
        "open": [
          "Double your customers tomorrow and you'd have no trouble delivering, and you can't keep enough of them to fill what you've got.",
          "They buy, then they either stop or start giving most of the work to somebody else."
        ],
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
        "close": "You're filling a leaky bucket. Every dollar going into finding new customers is paying to replace the ones walking out the other side, which is why the business feels busy and stays the same size. Selling to somebody who has already bought is far easier than finding somebody new."
      },
      "offer": {
        "title": "You are {c} constrained",
        "titleLoose": "The tightest thing is {c}",
        "open": [
          "Double your customers tomorrow and you'd have no trouble delivering, and you can't close enough of them to fill what you've got.",
          "People come to you and they don't buy. It's the offer. Either the value in it doesn't justify what you're asking, or there's something in the way of somebody saying yes."
        ],
        "evidence": [
          {
            "banded": "your close rate sits {q26.band}",
            "precise": "your close rate sits at {q26.exact}%"
          },
          {
            "banded": "the most common reason you lose is {q27.band}"
          },
          {
            "banded": "people come back asking what's included {q28.band}"
          },
          {
            "banded": "they find out what you charge {q30.band}"
          }
        ],
        "close": "You don't fix this by dropping the price. You fix it by putting things into the offer that cost you very little and are worth real money to the buyer, and by clearing whatever somebody has to get over before they can say yes."
      },
      "demand": {
        "title": "You are {c} constrained",
        "titleLoose": "The tightest thing is {c}",
        "open": [
          "Double your customers tomorrow and you'd have no trouble delivering, and you can't find enough of them to fill what you've got.",
          "You've got capacity sitting idle and not enough people asking."
        ],
        "evidence": [
          {
            "banded": "enquiries run {q31.band}",
            "precise": "enquiries run at about {q31.exact} a month"
          },
          {
            "banded": "volume has {q33.band} over the last year"
          },
          {
            "banded": "{q35.band}"
          }
        ],
        "close": "Nothing downstream is broken. The business needs more people coming in the top, and it won't start feeding itself."
      },
      "margin": {
        "title": "You are {c} constrained",
        "titleLoose": "The tightest thing is {c}",
        "open": [
          "Double your customers tomorrow and it wouldn't help, because there isn't enough margin in what you're already doing.",
          "You're busy, and there's nothing left at the end of it."
        ],
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
            "banded": "{q38.band}"
          },
          {
            "banded": "the work runs over what you priced it at {q39.band}"
          }
        ],
        "close": "More volume won't solve this. You need to make more on the work you're already doing, without adding a single customer."
      }
    },
    "constraintFix": {
      "talent": {
        "lead": "",
        "actions": [
          {
            "text": "Write down every task you do, in fifteen minute blocks, for a full week."
          },
          {
            "text": "Against each task, write the role that should own it in an ideal world."
          },
          {
            "text": "Take whichever role has the most tasks against it, or the most hours in the week."
          },
          {
            "text": "Hire that role."
          },
          {
            "text": "Train them yourself."
          },
          {
            "text": "Give them the responsibility and the authority to run it. One without the other doesn't work."
          },
          {
            "text": "Give them ninety days to prove they're the one."
          },
          {
            "text": "If they don't work out, hire again and run it the same way. If they do, come back here and find out what's capping you now."
          }
        ]
      },
      "fulfilment": {
        "lead": "",
        "actions": [
          {
            "text": "Write down exactly how what you sell gets delivered, one step at a time."
          },
          {
            "text": "Write down every other task your delivery people do that isn't that."
          },
          {
            "text": "Find the three things across those two lists that slow delivery down the most."
          },
          {
            "text": "Spend one week streamlining those three things and nothing else."
          },
          {
            "text": "Rewrite the first list with what changed, and make it the way it's done from now on."
          },
          {
            "text": "Cut the bottom ten percent of customers, the ones taking the most time for the least return."
          },
          {
            "text": "Now hire more capacity into the roles that need it."
          },
          {
            "text": "Run it that way for ninety days."
          },
          {
            "text": "If delivery still can't keep up, work the list again. If it can, come back here and find out what's capping you now."
          }
        ]
      },
      "value": {
        "lead": "",
        "actions": [
          {
            "text": "Write down every point of contact a customer has with you, from the moment they buy through to six months later."
          },
          {
            "text": "Put as much as you can into the first ninety days. Surprise them. That's the window where they decide what you're worth."
          },
          {
            "text": "Find the longest silence on that list and put something in it."
          },
          {
            "text": "Ring ten customers who stopped or cut back and ask them straight why. Not a survey."
          },
          {
            "text": "Whatever more than one of them says, fix that."
          },
          {
            "text": "Build one reason to come back that you start, rather than waiting to be asked."
          },
          {
            "text": "Ask your biggest customers what they give to somebody else, and why.",
            "when": [
              [
                "q57",
                [
                  "c",
                  "d"
                ]
              ]
            ]
          },
          {
            "text": "Run all of that for ninety days and measure who came back."
          },
          {
            "text": "If they're still leaving, work the list again. If they're staying, come back here and find out what's capping you now."
          }
        ]
      },
      "offer": {
        "lead": "",
        "actions": [
          {
            "text": "List everything you already do for a customer that isn't written into the offer, and write it in."
          },
          {
            "text": "Add two or three things that cost you close to nothing and are worth real money to the buyer. A guarantee, or something they'd otherwise have to go and source themselves."
          },
          {
            "text": "Write down every question somebody asks you after they've seen the price."
          },
          {
            "text": "Answer all of them inside the offer, before anybody has to ask."
          },
          {
            "text": "Shorten the time between somebody making contact and somebody getting a number."
          },
          {
            "text": "Make the price and what's in it easier to see."
          },
          {
            "text": "Run the new offer for one month."
          },
          {
            "text": "If the close rate hasn't moved, put more value in and go again. If it has, come back here and find out what's capping you now."
          }
        ]
      },
      "demand": {
        "lead": "",
        "actions": [
          {
            "text": "Ask your happiest customers for something in writing or on camera. Pay for it, or give them something for it."
          },
          {
            "text": "Put that where somebody deciding on you will actually see it."
          },
          {
            "text": "Take the source that already brings your best customers and put two or three times the effort into it."
          },
          {
            "text": "Stand up a second source that doesn't rely on being found. Going out and asking directly is the usual one."
          },
          {
            "text": "Set up a referral programme with something real in it for the customer who refers."
          },
          {
            "text": "Launch it by asking every customer, one at a time, for a single introduction."
          },
          {
            "text": "Run all of that for ninety days without adding anything else."
          },
          {
            "text": "If enquiries haven't moved, work the list again. If they have, come back here and find out what's capping you now."
          }
        ]
      },
      "margin": {
        "lead": "",
        "actions": [
          {
            "text": "Work out what each piece of work really costs you, your own time included, and rank the last twenty by what was left."
          },
          {
            "text": "Take the bottom five. For each one, write down what it was that ate the money."
          },
          {
            "text": "Whatever shows up on more than one of them, that's the leak. Fix that before you touch anything else."
          },
          {
            "text": "Put your prices up on everything new. If nobody flinches, they were too low.",
            "when": [
              [
                "q38",
                [
                  "c",
                  "d"
                ]
              ]
            ]
          },
          {
            "text": "Build the thing that historically runs over into the price, so you stop absorbing it."
          },
          {
            "text": "Reprice your three worst customers by what's left, or let them go."
          },
          {
            "text": "Hold the new prices for ninety days without discounting to win anything."
          },
          {
            "text": "If there's still nothing left at the end, work the list again. If there is, come back here and find out what's capping you now."
          }
        ]
      }
    },
    "riskDef": {
      "key_client": {
        "banded": "One customer carries {q41.band} of your revenue. That customer can leave, or get bought by someone who already has their own suppliers, and neither is something you get a say in.",
        "precise": "One customer carries {q41.exact}% of your revenue. That customer can leave, or get bought by someone who already has their own suppliers, and neither is something you get a say in."
      },
      "key_product": {
        "banded": "{q42.band} of your revenue comes from one product or service line. That's fine while the market wants it, and it's a single point of failure the day the market moves or a competitor undercuts it.",
        "precise": "{q42.exact}% of your revenue comes from one product or service line. That's fine while the market wants it, and it's a single point of failure the day the market moves or a competitor undercuts it."
      },
      "key_channel": {
        "banded": "Your customers arrive {q43.band}. A lead source changes without asking you first, and an algorithm shift or one referrer going quiet can halve your enquiries inside a month.",
        "alt": "You weren't sure where your customers actually come from, which usually means one source is doing more of the work than you think. A lead source can change without asking you first, and one referrer going quiet can halve your enquiries inside a month."
      },
      "key_supplier": {
        "banded": "There's one supplier with no ready replacement. Their price rise is your price rise, and their bad year is your bad year."
      },
      "no_succession": {
        "banded": "There's {q50.band} for what happens if you stop or sell. Every business has an exit, planned or not. The unplanned version is the one where somebody else sets the price.",
        "alt": "You weren't sure what happens to the business if you stop or sell. Every business has an exit, planned or not. The unplanned version is the one where somebody else sets the price."
      },
      "personal_guarantee": {
        "banded": "You've personally guaranteed {q51.band} of the business's obligations. The wall between business risk and personal risk isn't up, so a bad year in the business reaches your house.",
        "alt": "You weren't sure what you've personally guaranteed, and that's worth finding out this week. Where the wall between business risk and personal risk isn't up, a bad year in the business reaches your house."
      },
      "model_misfit": {
        "banded": "The way you spend your week is {q52.band}. It decides how long you'll keep doing this, and a business rarely outlives the owner's appetite for running it.",
        "alt": "You weren't sure whether the way you spend your week matches what you wanted out of this. That question decides how long you'll keep doing it, and a business rarely outlives the owner's appetite for running it."
      },
      "key_licence": {
        "banded": "One licence or accreditation is the thing that lets you trade at all. Let it lapse and the business stops completely rather than slows down."
      },
      "key_person": {
        "banded": "The business can't run without one person. Sold tomorrow, {q49.band}, and there's nobody who could run it if you stepped out. That caps the business at the size of one person's week.",
        "alt": "The business can't run without one person, and nobody has put a number on what that would cost. Until somebody else can run it, this is a job that owns you rather than an asset you own.",
        "variants": [
          {
            "when": [
              [
                "q44",
                [
                  "c"
                ]
              ]
            ],
            "text": "The business can't run without one person, and what they know isn't written down anywhere else. If they go, whether that's illness or a resignation, the knowledge goes with them and you'll be rebuilding it while still trying to deliver."
          }
        ]
      },
      "key_asset": {
        "banded": "One piece of equipment or one vehicle is doing work you have no backup for. A breakdown or a long repair stops revenue you have already sold, and hire rates at short notice are set by people who know you're stuck."
      },
      "cash_flow": {
        "open": "You're profitable on paper and short of cash in practice. The work is sold and the money hasn't landed, so there's nothing sitting there to fund the next job.",
        "evidence": [
          {
            "banded": "you get paid {q54.band}"
          },
          {
            "banded": "the balance lands {q7.band}",
            "precise": "the balance lands {q7.exact} days later"
          },
          {
            "banded": "you're owed {q55.band} past its due date"
          },
          {
            "banded": "{q6.band}"
          },
          {
            "banded": "you're holding {q8.band}"
          }
        ],
        "close": "That's a timing problem rather than a rate problem. Every customer you win right now costs you money before they pay you."
      }
    },
    "riskFix": {
      "key_client": [
        "Set a ceiling, say twenty percent of revenue from any one customer, and treat crossing it as the trigger to go and win two more.",
        "Get them onto a term agreement with a notice period, so a decision to leave gives you time to react.",
        "If the work is committed on a handshake, that is the first conversation to have, before the ceiling."
      ],
      "key_product": [
        "Build a second line and sell it to the customers you already have.",
        "Set a target for what share of revenue it should carry in twelve months, and check it quarterly."
      ],
      "key_channel": [
        "Stand up a second lead source before you need it, and give it ninety days before you judge it.",
        "Write down what you'd do if the current one halved tomorrow. That plan is worth having on paper before you need it."
      ],
      "key_supplier": [
        "Qualify a second supplier and give them ten percent of your volume. A backup you've never bought from isn't a backup.",
        "Get their lead times and pricing in writing, so a change becomes a conversation rather than a surprise."
      ],
      "key_licence": [
        "Put every renewal date in a calendar with a ninety day warning on it.",
        "Make sure a second person can hold or renew it, so a lapse can't come down to one person's inbox."
      ],
      "no_succession": [
        "Write the one page version. Who runs it, and what happens to the customers.",
        "It doesn't need to be right, it needs to exist."
      ],
      "personal_guarantee": [
        "List every guarantee you've signed and put a date against each one to renegotiate or release it.",
        "They're easy to leave in place, because a renewal rarely asks you anything."
      ],
      "model_misfit": [
        "Write down what you actually wanted out of this, then hold your week up against it.",
        "The gap between those two is the brief for the next twelve months."
      ],
      "key_person": [
        "Write down what that person holds, then move one piece of it to somebody else this month.",
        "Name who would run it, tell them, and give them a budget they can act inside. A deputy who can't decide anything is a job title.",
        "Book a month off twelve months out and work backwards from it. That's the deadline that makes it real."
      ],
      "key_asset": [
        "Find out today what a replacement costs at short notice, and who actually has one.",
        "Put it on a service schedule and hold to it."
      ],
      "cash_flow": [
        {
          "text": "You take nothing upfront, which is this whole problem in one answer. Change that before anything else on this list.",
          "when": [
            [
              "q54",
              [
                "e",
                "f"
              ]
            ]
          ]
        },
        {
          "text": "Take money upfront on everything. Half of it well before you start and the rest before you deliver, so it's in the account before your own costs go out."
        },
        {
          "text": "Line the upfront money up to land before your own costs do. Where the final number can't be known in advance, take the balance afterwards and refund the difference."
        },
        {
          "text": "Ask for the money within twenty four hours of finishing. Whatever the gap is between finishing and asking, that gap is yours to close."
        },
        {
          "text": "Collect what's already overdue before you chase anything new. It's the cheapest money available to you.",
          "when": [
            [
              "q55",
              [
                "c",
                "d"
              ]
            ]
          ]
        },
        {
          "text": "Put your terms in writing before the next piece of work starts, and chase on day one past due.",
          "when": [
            [
              "q45",
              [
                "c",
                "d"
              ]
            ]
          ]
        },
        {
          "text": "Get a facility in place while the business is still profitable on paper. Banks lend to businesses that don't look like they need it.",
          "when": [
            [
              "q10",
              [
                "a"
              ]
            ]
          ]
        }
      ]
    },
    "dontDoYet": {
      "talent": {
        "lead": "Until the layer exists, leave these alone.",
        "items": [
          "Don't hire another doer. Every one you add reports to you, and you're the bottleneck.",
          "Don't take on a new market or a new location. Both land on your desk.",
          "Don't start anything that needs your attention for six months.",
          "Don't increase lead generation. The work you win still has to route through you."
        ]
      },
      "fulfilment": {
        "lead": "Until you've done the above, leave these alone.",
        "items": [
          "Don't take on new customers until you've done the above.",
          "Don't start something new.",
          "Don't drop your prices.",
          "Don't promise a shorter lead time to win something."
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
          "Don't take the big thin one because it's good for the brand. Reputation doesn't pay wages.",
          "Don't discount anything. There's nothing left to give away.",
          "Don't invest in growth. Growing an unprofitable model makes it unprofitable faster."
        ]
      }
    },
    "closing": {
      "text": "That's the diagnosis. One constraint, and the things to leave alone while you fix it.\n\nWork the constraint and check back in ninety days. That's long enough for it to move and short enough that you'll still remember what you changed.",
      "cta": "",
      "loose": "That's the read. One thing to push on, and nothing in the way of it.\n\nRun this again in ninety days, or whenever something material changes. The constraint moves as the business grows, and the answer you get next time probably won't be this one."
    },
    "looseBody": "Nothing in here is failing, so there's no evidence to walk you through. What you've got is {d.primaryShort} sitting as the tightest of the seven right now, which makes it the likeliest place the next bit of growth comes from. The actions below are worth doing and none of them are urgent.",
    "riskLead": "These are the things that would hurt most if something went wrong. They aren't capping the business the way the constraint above is, but they're major risks."
  },
  "hardTriggers": {
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
              "c",
              "d"
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
              "c",
              "d"
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
              "c",
              "d"
            ]
          ],
          [
            "q34",
            [
              "c",
              "d"
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
  },
  "families": {
    "supply": [
      "talent",
      "fulfilment",
      "margin"
    ],
    "demand": [
      "value",
      "offer",
      "demand"
    ]
  },
  "cashflowRisk": {
    "block": "cashflow",
    "raiseAt": 45
  },
  "majors": {
    "supply": {
      "name": "supply",
      "title": "You are {c} constrained",
      "titleLoose": "You lean {c} constrained",
      "test": "Double your clients tomorrow and it wouldn't help you. Either you can't deliver them, or delivering them doesn't pay.",
      "due": "Due to"
    },
    "demand": {
      "name": "demand",
      "title": "You are {c} constrained",
      "titleLoose": "You lean {c} constrained",
      "test": "Double your clients tomorrow and you could handle it. The capacity is there and filling it is what caps you.",
      "due": "Due to"
    }
  }
};
